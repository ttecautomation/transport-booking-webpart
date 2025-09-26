/**
 * FIXED: TransportBookingWebPart.ts
 * Updated to properly access user email from SPFx context
 */
import { Version } from '@microsoft/sp-core-library';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
export interface ITransportBookingWebPartProps {
    description: string;
    apiEndpoint: string;
    enableDebugMode: boolean;
    defaultSite: string;
    showUserInfo: boolean;
    enableNotifications: boolean;
    maxRetryAttempts: number;
    requestTimeout: number;
}
export default class TransportBookingWebPart extends BaseClientSideWebPart<ITransportBookingWebPartProps> {
    private _isDarkTheme;
    private _environmentMessage;
    private _userEmail;
    render(): void;
    protected onInit(): Promise<void>;
    /**
     * ✅ FIXED: Get user email using multiple methods with fallbacks
     */
    private _getUserEmail;
    private _testApiConnectivity;
    private _getEnvironmentMessage;
    protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void;
    protected onDispose(): void;
    protected get dataVersion(): Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
    protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void;
}
