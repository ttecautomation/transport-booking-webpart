/**
 * FIXED: TransportBookingWebPart.ts
 * Updated to properly access user email from SPFx context
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { PropertyPaneTextField, PropertyPaneDropdown, PropertyPaneToggle, PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'TransportBookingWebPartStrings';
import TransportBooking from './components/TransportBooking';
import { logger } from '../../config/environment';
import { SPHttpClient } from '@microsoft/sp-http';
export default class TransportBookingWebPart extends BaseClientSideWebPart {
    constructor() {
        super(...arguments);
        this._isDarkTheme = false;
        this._environmentMessage = '';
        this._userEmail = '';
    }
    render() {
        try {
            const element = React.createElement(TransportBooking, {
                description: this.properties.description || 'Transport Booking Form',
                context: this.context,
                isDarkTheme: this._isDarkTheme,
                environmentMessage: this._environmentMessage,
                hasTeamsContext: !!this.context.sdks.microsoftTeams,
                userDisplayName: this.context.pageContext.user.displayName,
                userEmail: this._userEmail,
                apiEndpoint: this.properties.apiEndpoint,
                enableDebugMode: this.properties.enableDebugMode || false,
                defaultSite: this.properties.defaultSite || '',
                showUserInfo: this.properties.showUserInfo !== false
            });
            ReactDom.render(element, this.domElement);
        }
        catch (error) {
            logger.error('Error rendering Transport Booking Web Part:', error);
            this.domElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #d32f2f; border: 2px solid #d32f2f; border-radius: 8px; background-color: #ffebee;">
          <h3>Transport Booking - Error</h3>
          <p>Failed to load the transport booking form.</p>
          <p>Please refresh the page or contact support.</p>
        </div>
      `;
        }
    }
    async onInit() {
        try {
            // Set default properties if not configured
            if (!this.properties.apiEndpoint) {
                this.properties.apiEndpoint = 'https://app-mti-api-prod.azurewebsites.net/api';
            }
            if (this.properties.enableDebugMode === undefined) {
                this.properties.enableDebugMode = false;
            }
            if (this.properties.showUserInfo === undefined) {
                this.properties.showUserInfo = true;
            }
            if (this.properties.enableNotifications === undefined) {
                this.properties.enableNotifications = true;
            }
            if (!this.properties.maxRetryAttempts) {
                this.properties.maxRetryAttempts = 3;
            }
            if (!this.properties.requestTimeout) {
                this.properties.requestTimeout = 30000;
            }
            // ✅ FIXED: Get user email using multiple fallback methods
            this._userEmail = await this._getUserEmail();
            // Get environment message
            this._environmentMessage = await this._getEnvironmentMessage();
            // Test API connectivity (non-blocking)
            this._testApiConnectivity().catch(error => {
                logger.error('API connectivity test failed:', error);
            });
        }
        catch (error) {
            logger.error('Error during web part initialization:', error);
            this._environmentMessage = 'Initialization error occurred';
        }
    }
    /**
     * ✅ FIXED: Get user email using multiple methods with fallbacks
     */
    async _getUserEmail() {
        var _a;
        try {
            // Method 1: Try SPFx pageContext.user.email (SharePoint Online)
            if (this.context.pageContext.user.email) {
                logger.log('✅ User email from pageContext.user.email:', this.context.pageContext.user.email);
                return this.context.pageContext.user.email;
            }
            // Method 2: Extract email from loginName (common in SPO)
            const loginName = this.context.pageContext.user.loginName;
            if (loginName && loginName.includes('|')) {
                // Format: "i:0#.f|membership|user@domain.com" or "i:0#.w|domain\username"
                const parts = loginName.split('|');
                if (parts.length >= 3 && parts[2].includes('@')) {
                    const extractedEmail = parts[2];
                    logger.log('✅ User email extracted from loginName:', extractedEmail);
                    return extractedEmail;
                }
            }
            // Method 3: Try Microsoft Graph API (requires permissions)
            if (this.context.msGraphClientFactory) {
                try {
                    const graphClient = await this.context.msGraphClientFactory.getClient('3');
                    const user = await graphClient.api('/me').select('mail,userPrincipalName').get();
                    const email = user.mail || user.userPrincipalName;
                    if (email) {
                        logger.log('✅ User email from Microsoft Graph:', email);
                        return email;
                    }
                }
                catch (graphError) {
                    logger.warn('Microsoft Graph API not available or insufficient permissions:', graphError);
                }
            }
            // Method 4: Try SharePoint REST API
            if (this.context.spHttpClient) {
                try {
                    const response = await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser?$select=Email`, SPHttpClient.configurations.v1);
                    if (response.ok) {
                        const userData = await response.json();
                        if (userData.Email) {
                            logger.log('✅ User email from SharePoint REST API:', userData.Email);
                            return userData.Email;
                        }
                    }
                }
                catch (restError) {
                    logger.warn('SharePoint REST API call failed:', restError);
                }
            }
            // Method 5: Legacy _spPageContextInfo fallback
            if (typeof window !== 'undefined' && window._spPageContextInfo) {
                const pageContext = window._spPageContextInfo;
                if (pageContext.userEmail) {
                    logger.log('✅ User email from _spPageContextInfo:', pageContext.userEmail);
                    return pageContext.userEmail;
                }
            }
            // Method 6: Teams context (if in Teams)
            if (this.context.sdks.microsoftTeams) {
                try {
                    const teamsContext = await this.context.sdks.microsoftTeams.teamsJs.app.getContext();
                    if ((_a = teamsContext.user) === null || _a === void 0 ? void 0 : _a.userPrincipalName) {
                        logger.log('✅ User email from Teams context:', teamsContext.user.userPrincipalName);
                        return teamsContext.user.userPrincipalName;
                    }
                }
                catch (teamsError) {
                    logger.warn('Failed to get Teams context:', teamsError);
                }
            }
            // Fallback: Generate email from display name (for development/testing)
            const displayName = this.context.pageContext.user.displayName;
            if (displayName) {
                // Simple fallback: convert "John Doe" to "john.doe@ttec.com"
                const fallbackEmail = displayName
                    .toLowerCase()
                    .replace(/\s+/g, '.')
                    .replace(/[^a-z0-9.]/g, '') + '@ttec.com';
                logger.warn('⚠️ Using fallback email generated from display name:', fallbackEmail);
                return fallbackEmail;
            }
            // Final fallback
            const finalFallback = 'user@ttec.com';
            logger.warn('⚠️ Using final fallback email:', finalFallback);
            return finalFallback;
        }
        catch (error) {
            logger.error('❌ Error getting user email:', error);
            return 'error@ttec.com';
        }
    }
    async _testApiConnectivity() {
        logger.log('API connectivity test - placeholder implementation');
    }
    async _getEnvironmentMessage() {
        if (!!this.context.sdks.microsoftTeams) {
            try {
                const context = await this.context.sdks.microsoftTeams.teamsJs.app.getContext();
                let environmentMessage = '';
                switch (context.app.host.name) {
                    case 'Office':
                        environmentMessage = this.context.isServedFromLocalhost
                            ? strings.AppLocalEnvironmentOffice
                            : strings.AppOfficeEnvironment;
                        break;
                    case 'Outlook':
                        environmentMessage = this.context.isServedFromLocalhost
                            ? strings.AppLocalEnvironmentOutlook
                            : strings.AppOutlookEnvironment;
                        break;
                    case 'Teams':
                    case 'TeamsModern':
                        environmentMessage = this.context.isServedFromLocalhost
                            ? strings.AppLocalEnvironmentTeams
                            : strings.AppTeamsTabEnvironment;
                        break;
                    default:
                        environmentMessage = strings.UnknownEnvironment;
                }
                return environmentMessage;
            }
            catch (error) {
                logger.error('Error getting Teams context:', error);
                return strings.UnknownEnvironment;
            }
        }
        return this.context.isServedFromLocalhost
            ? strings.AppLocalEnvironmentSharePoint
            : strings.AppSharePointEnvironment;
    }
    onThemeChanged(currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        const { semanticColors } = currentTheme;
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || '');
            this.domElement.style.setProperty('--link', semanticColors.link || '');
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || '');
        }
    }
    onDispose() {
        ReactDom.unmountComponentAtNode(this.domElement);
    }
    get dataVersion() {
        return Version.parse('1.0');
    }
    getPropertyPaneConfiguration() {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel,
                                    value: this.properties.description || 'Employee transport booking form'
                                }),
                                PropertyPaneTextField('apiEndpoint', {
                                    label: 'API Endpoint URL',
                                    value: this.properties.apiEndpoint || 'https://app-mti-api-prod.azurewebsites.net/api',
                                    placeholder: 'https://app-mti-api-prod.azurewebsites.net/api'
                                }),
                                PropertyPaneDropdown('defaultSite', {
                                    label: 'Default Site',
                                    options: [
                                        { key: '', text: 'No Default - Let user choose' },
                                        { key: 'ahmedabad', text: 'Ahmedabad (AMD)' },
                                        { key: 'mohali', text: 'Mohali (MHL)' }
                                    ],
                                    selectedKey: this.properties.defaultSite || ''
                                }),
                                PropertyPaneToggle('showUserInfo', {
                                    label: 'Show User Information Card',
                                    checked: this.properties.showUserInfo !== false,
                                    onText: 'Shown',
                                    offText: 'Hidden'
                                }),
                                PropertyPaneToggle('enableDebugMode', {
                                    label: 'Enable Debug Mode',
                                    checked: this.properties.enableDebugMode || false,
                                    onText: 'Enabled - Shows debug information',
                                    offText: 'Disabled - Production mode'
                                }),
                                PropertyPaneToggle('enableNotifications', {
                                    label: 'Enable SharePoint Notifications',
                                    checked: this.properties.enableNotifications !== false,
                                    onText: 'Enabled',
                                    offText: 'Disabled'
                                })
                            ]
                        }
                    ]
                },
                {
                    header: {
                        description: 'Advanced Configuration'
                    },
                    groups: [
                        {
                            groupName: 'API Settings',
                            groupFields: [
                                PropertyPaneSlider('requestTimeout', {
                                    label: 'Request Timeout (seconds)',
                                    min: 5,
                                    max: 120,
                                    value: this.properties.requestTimeout ? this.properties.requestTimeout / 1000 : 30,
                                    showValue: true,
                                    step: 5
                                }),
                                PropertyPaneSlider('maxRetryAttempts', {
                                    label: 'Max Retry Attempts',
                                    min: 0,
                                    max: 10,
                                    value: this.properties.maxRetryAttempts || 3,
                                    showValue: true,
                                    step: 1
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
    onPropertyPaneFieldChanged(propertyPath, oldValue, newValue) {
        // Handle timeout conversion (seconds to milliseconds)
        if (propertyPath === 'requestTimeout') {
            this.properties.requestTimeout = newValue * 1000;
        }
        // Validate API endpoint URL
        if (propertyPath === 'apiEndpoint') {
            if (newValue && !newValue.startsWith('http')) {
                this.properties.apiEndpoint = 'https://' + newValue;
            }
        }
        // Validate retry attempts
        if (propertyPath === 'maxRetryAttempts') {
            if (newValue < 0) {
                this.properties.maxRetryAttempts = 0;
            }
            else if (newValue > 10) {
                this.properties.maxRetryAttempts = 10;
            }
        }
        // Re-render if significant properties change
        if (['apiEndpoint', 'defaultSite', 'enableDebugMode'].includes(propertyPath)) {
            this.render();
        }
        super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
}
//# sourceMappingURL=TransportBookingWebPart.js.map