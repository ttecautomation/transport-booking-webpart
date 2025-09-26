/**
 * SharePoint Framework (SPFX) Integration Utilities
 * Provides helper functions for SharePoint context and integration
 * Dependencies: @microsoft/sp-core-library, environment.ts
 */
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { config, logger, isDevelopment } from '../config/environment';
/**
 * SharePoint Helper Class
 * Handles SharePoint-specific operations and context management
 */
export class SPFXHelper {
    /**
     * Get SharePoint page context information
     */
    static getPageContext() {
        // Check for SharePoint context in browser window
        if (typeof window !== 'undefined' && window._spPageContextInfo) {
            const context = window._spPageContextInfo;
            return {
                ...context,
                isSharePoint: true
            };
        }
        // Fallback for development environment
        const fallbackContext = {
            userEmail: 'dev.user@company.com',
            userDisplayName: 'Development User',
            userLoginName: 'i:0#.f|membership|dev.user@company.com',
            userId: 1,
            webAbsoluteUrl: 'https://tenant.sharepoint.com/sites/Transport',
            webTitle: 'Transport Booking',
            siteAbsoluteUrl: 'https://tenant.sharepoint.com/sites/Transport',
            siteServerRelativeUrl: '/sites/Transport',
            webServerRelativeUrl: '/sites/Transport',
            requestId: 'dev-request-id',
            correlationId: 'dev-correlation-id',
            isSharePoint: false, // Indicate this is dev mode
        };
        logger.debug('Using fallback SharePoint context for development');
        return fallbackContext;
    }
    /**
     * Get current SharePoint user information
     */
    static getCurrentUser() {
        const context = this.getPageContext();
        return {
            email: context.userEmail || '',
            displayName: context.userDisplayName || '',
            loginName: context.userLoginName || '',
            userId: context.userId || 0,
            isSharePointUser: Boolean(context.userEmail && context.isSharePoint),
        };
    }
    /**
     * Get SharePoint web information
     */
    static getWebContext() {
        const context = this.getPageContext();
        return {
            webUrl: context.webAbsoluteUrl || '',
            webTitle: context.webTitle || '',
            siteUrl: context.siteAbsoluteUrl || '',
            webServerRelativeUrl: context.webServerRelativeUrl || '',
            siteServerRelativeUrl: context.siteServerRelativeUrl || '',
        };
    }
    /**
     * Check if running in SharePoint environment
     */
    static isInSharePoint() {
        const isSharePointEnv = Environment.type === EnvironmentType.SharePoint ||
            Environment.type === EnvironmentType.ClassicSharePoint;
        const hasSharePointContext = !!(typeof window !== 'undefined' &&
            window._spPageContextInfo &&
            window.SP);
        return isSharePointEnv && hasSharePointContext;
    }
    /**
     * Check if running in development mode
     */
    static isDevelopmentMode() {
        return (Environment.type === EnvironmentType.Local ||
            !this.isInSharePoint() ||
            isDevelopment());
    }
    /**
     * Show SharePoint notification
     */
    static showNotification(message, type = 'info', duration = 4000) {
        // Use SharePoint notification API if available
        if (this.isInSharePoint() &&
            typeof window !== 'undefined' &&
            window.SP &&
            window.SP.UI &&
            window.SP.UI.Notify) {
            const sticky = duration === 0;
            const notificationId = window.SP.UI.Notify.addNotification(message, sticky);
            // Auto-hide notification after duration
            if (!sticky && duration > 0) {
                setTimeout(() => {
                    window.SP.UI.Notify.removeNotification(notificationId);
                }, duration);
            }
            return notificationId;
        }
        else {
            // Fallback for development environment
            const logLevel = type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log';
            console[logLevel](`${type.toUpperCase()}: ${message}`);
            // Show browser notification if supported
            if (typeof window !== 'undefined' &&
                'Notification' in window &&
                Notification.permission === 'granted') {
                new Notification(`Transport Booking - ${type}`, {
                    body: message,
                    icon: '/favicon.ico',
                });
            }
            return null;
        }
    }
    /**
     * Show SharePoint status message
     */
    static showStatus(message, color = 'blue') {
        if (this.isInSharePoint() &&
            typeof window !== 'undefined' &&
            window.SP &&
            window.SP.UI &&
            window.SP.UI.Status) {
            const statusId = window.SP.UI.Status.addStatus(message, '', true);
            window.SP.UI.Status.setStatusPriColor(statusId, color);
            return statusId;
        }
        else {
            // Fallback
            logger.log(`STATUS [${color}]: ${message}`);
            return null;
        }
    }
    /**
     * Remove SharePoint status message
     */
    static removeStatus(statusId) {
        if (statusId &&
            this.isInSharePoint() &&
            typeof window !== 'undefined' &&
            window.SP &&
            window.SP.UI &&
            window.SP.UI.Status) {
            window.SP.UI.Status.removeStatus(statusId);
        }
    }
    /**
     * Get SharePoint list context (if applicable)
     */
    static getListContext() {
        const context = this.getPageContext();
        return {
            listId: context.pageListId || '',
            listTitle: context.listTitle || '',
            listUrl: context.listUrl || '',
            isListContext: Boolean(context.pageListId),
        };
    }
    /**
     * Get SharePoint permissions for current user
     */
    static getUserPermissions() {
        const context = this.getPageContext();
        return {
            hasFullControl: Boolean(context.hasManageWebPermissions),
            canAddItems: Boolean(context.hasManageListsPermissions),
            canEditItems: Boolean(context.hasManageListsPermissions),
            canViewItems: true,
            permissions: context.userPermissions || {},
        };
    }
    /**
     * Load SharePoint JavaScript libraries
     */
    static loadSharePointLibraries(libraries = ['sp.runtime.js', 'sp.js']) {
        if (!this.isInSharePoint()) {
            logger.debug('Skipping SharePoint library loading in development');
            return Promise.resolve([]); // Skip in development
        }
        return new Promise((resolve, reject) => {
            const loadedLibraries = [];
            let loadCount = 0;
            const checkComplete = () => {
                loadCount++;
                if (loadCount === libraries.length) {
                    resolve(loadedLibraries);
                }
            };
            libraries.forEach((library) => {
                const libraryKey = library.replace('.js', '').replace('.', '_');
                if (typeof window !== 'undefined' &&
                    (window[libraryKey] ||
                        document.querySelector(`script[src*="${library}"]`))) {
                    // Library already loaded
                    loadedLibraries.push(library);
                    checkComplete();
                }
                else {
                    try {
                        // Load library
                        const script = document.createElement('script');
                        script.src = `/_layouts/15/${library}`;
                        script.onload = () => {
                            loadedLibraries.push(library);
                            checkComplete();
                        };
                        script.onerror = () => {
                            logger.warn(`Failed to load SharePoint library: ${library}`);
                            checkComplete();
                        };
                        document.head.appendChild(script);
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }
    /**
     * Execute SharePoint context operations
     */
    static executeWithContext(callback) {
        if (!this.isInSharePoint()) {
            // Execute immediately in development
            return Promise.resolve(callback(this.getPageContext()));
        }
        return new Promise((resolve, reject) => {
            if (typeof window !== 'undefined' &&
                window.SP &&
                window.SP.ClientContext) {
                try {
                    const result = callback(window.SP.ClientContext.get_current());
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            }
            else {
                // Wait for SharePoint libraries to load
                this.loadSharePointLibraries()
                    .then(() => {
                    try {
                        const result = callback(window.SP.ClientContext.get_current());
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                })
                    .catch(reject);
            }
        });
    }
    /**
     * Get current page information
     */
    static getPageInfo() {
        const context = this.getPageContext();
        return {
            title: typeof document !== 'undefined' ? document.title : context.webTitle || '',
            url: typeof window !== 'undefined' ? window.location.href : '',
            serverRequestPath: context.siteServerRelativeUrl ||
                (typeof window !== 'undefined' ? window.location.pathname : ''),
            isHomePage: Boolean(context.isHomePage),
            pageMode: context.pageMode || 'view',
        };
    }
    /**
     * Redirect to SharePoint page
     */
    static redirectTo(url) {
        if (typeof url === 'string' && url.length > 0) {
            if (url.startsWith('http')) {
                // Absolute URL
                if (typeof window !== 'undefined') {
                    window.location.href = url;
                }
            }
            else {
                // Relative URL - prepend web URL
                const webContext = this.getWebContext();
                const baseUrl = webContext.webUrl || (typeof window !== 'undefined' ? window.location.origin : '');
                if (typeof window !== 'undefined') {
                    window.location.href = baseUrl + (url.startsWith('/') ? url : '/' + url);
                }
            }
        }
    }
    /**
     * Open SharePoint dialog
     */
    static openDialog(options = {}) {
        if (this.isInSharePoint() &&
            typeof window !== 'undefined' &&
            window.SP &&
            window.SP.UI &&
            window.SP.UI.ModalDialog) {
            const defaultOptions = {
                title: 'Transport Booking',
                width: 800,
                height: 600,
                allowMaximize: true,
                showClose: true,
            };
            const dialogOptions = { ...defaultOptions, ...options };
            return window.SP.UI.ModalDialog.showModalDialog(dialogOptions);
        }
        else {
            // Fallback - open in new window
            if (options.url && typeof window !== 'undefined') {
                const newWindow = window.open(options.url, options.title || 'Transport Booking', `width=${options.width || 800},height=${options.height || 600},scrollbars=yes,resizable=yes`);
                return { $5_0: newWindow }; // Mock SP dialog object
            }
        }
    }
    /**
     * Close SharePoint dialog
     */
    static closeDialog(result = null) {
        if (this.isInSharePoint() &&
            typeof window !== 'undefined' &&
            window.SP &&
            window.SP.UI &&
            window.SP.UI.ModalDialog) {
            window.SP.UI.ModalDialog.commonModalDialogClose(1, result);
        }
        else {
            // Fallback - close window if opened as popup
            if (typeof window !== 'undefined' && window.opener) {
                window.close();
            }
        }
    }
    /**
     * Get environment information
     */
    static getEnvironmentInfo() {
        const context = this.getPageContext();
        return {
            spfxEnvironmentType: Environment.type,
            spfxEnvironmentTypeName: EnvironmentType[Environment.type],
            isSharePoint: this.isInSharePoint(),
            isLocal: this.isDevelopmentMode(),
            apiBaseUrl: config.api.baseUrl,
            currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
            port: typeof window !== 'undefined' ? window.location.port : 'N/A',
            protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
            config: config,
            buildDate: config.app.buildDate,
        };
    }
    /**
     * Get SharePoint request headers for API calls
     */
    static getSharePointHeaders(requestId, correlationId) {
        const context = this.getPageContext();
        const headers = {};
        if (context.requestId || requestId) {
            headers['SP-RequestGuid'] = requestId || context.requestId || '';
        }
        if (context.correlationId || correlationId) {
            headers['SP-CorrelationId'] = correlationId || context.correlationId || '';
        }
        if (context.webAbsoluteUrl) {
            headers['X-SP-WebUrl'] = context.webAbsoluteUrl;
        }
        return headers;
    }
    /**
     * Check if user has specific permission
     */
    static hasPermission(permission) {
        const permissions = this.getUserPermissions();
        return permissions.permissions && permissions.permissions[permission];
    }
    /**
     * Get user's display name with fallback
     */
    static getUserDisplayName(fallback = 'User') {
        const user = this.getCurrentUser();
        return user.displayName || fallback;
    }
    /**
     * Get web absolute URL with fallback
     */
    static getWebAbsoluteUrl() {
        const webContext = this.getWebContext();
        return webContext.webUrl || (typeof window !== 'undefined' ? window.location.origin : '');
    }
}
/**
 * Export utility functions for convenience
 */
export const getCurrentUser = SPFXHelper.getCurrentUser.bind(SPFXHelper);
export const getPageContext = SPFXHelper.getPageContext.bind(SPFXHelper);
export const isInSharePoint = SPFXHelper.isInSharePoint.bind(SPFXHelper);
export const showNotification = SPFXHelper.showNotification.bind(SPFXHelper);
export const isDevelopmentMode = SPFXHelper.isDevelopmentMode.bind(SPFXHelper);
export const getWebContext = SPFXHelper.getWebContext.bind(SPFXHelper);
export const getEnvironmentInfo = SPFXHelper.getEnvironmentInfo.bind(SPFXHelper);
export const getSharePointHeaders = SPFXHelper.getSharePointHeaders.bind(SPFXHelper);
/**
 * Export default class
 */
export default SPFXHelper;
//# sourceMappingURL=spfxHelpers.js.map