/**
 * SharePoint Framework (SPFX) Integration Utilities
 * Provides helper functions for SharePoint context and integration
 * Dependencies: @microsoft/sp-core-library, environment.ts
 */
import { EnvironmentType } from '@microsoft/sp-core-library';
interface ISharePointPageContext {
    userEmail?: string;
    userDisplayName?: string;
    userLoginName?: string;
    userId?: number;
    webAbsoluteUrl?: string;
    webTitle?: string;
    siteAbsoluteUrl?: string;
    siteServerRelativeUrl?: string;
    webServerRelativeUrl?: string;
    requestId?: string;
    correlationId?: string;
    pageListId?: string;
    listTitle?: string;
    listUrl?: string;
    hasManageWebPermissions?: boolean;
    hasManageListsPermissions?: boolean;
    userPermissions?: any;
    SPVersion?: string;
    currentLanguage?: string;
    webTemplate?: string;
    isSharePoint?: boolean;
}
interface ICurrentUser {
    email: string;
    displayName: string;
    loginName: string;
    userId: number;
    isSharePointUser: boolean;
}
interface IWebContext {
    webUrl: string;
    webTitle: string;
    siteUrl: string;
    webServerRelativeUrl: string;
    siteServerRelativeUrl: string;
}
interface IListContext {
    listId: string;
    listTitle: string;
    listUrl: string;
    isListContext: boolean;
}
interface IUserPermissions {
    hasFullControl: boolean;
    canAddItems: boolean;
    canEditItems: boolean;
    canViewItems: boolean;
    permissions: any;
}
interface IPageInfo {
    title: string;
    url: string;
    serverRequestPath: string;
    isHomePage: boolean;
    pageMode: string;
}
interface IEnvironmentInfo {
    spfxEnvironmentType: EnvironmentType;
    spfxEnvironmentTypeName: string;
    isSharePoint: boolean;
    isLocal: boolean;
    apiBaseUrl: string;
    currentUrl: string;
    hostname: string;
    port: string;
    protocol: string;
    config: any;
    buildDate: string;
}
/**
 * SharePoint Helper Class
 * Handles SharePoint-specific operations and context management
 */
export declare class SPFXHelper {
    /**
     * Get SharePoint page context information
     */
    static getPageContext(): ISharePointPageContext;
    /**
     * Get current SharePoint user information
     */
    static getCurrentUser(): ICurrentUser;
    /**
     * Get SharePoint web information
     */
    static getWebContext(): IWebContext;
    /**
     * Check if running in SharePoint environment
     */
    static isInSharePoint(): boolean;
    /**
     * Check if running in development mode
     */
    static isDevelopmentMode(): boolean;
    /**
     * Show SharePoint notification
     */
    static showNotification(message: string, type?: 'info' | 'success' | 'error' | 'warning', duration?: number): string | null;
    /**
     * Show SharePoint status message
     */
    static showStatus(message: string, color?: 'red' | 'yellow' | 'green' | 'blue'): string | null;
    /**
     * Remove SharePoint status message
     */
    static removeStatus(statusId: string): void;
    /**
     * Get SharePoint list context (if applicable)
     */
    static getListContext(): IListContext;
    /**
     * Get SharePoint permissions for current user
     */
    static getUserPermissions(): IUserPermissions;
    /**
     * Load SharePoint JavaScript libraries
     */
    static loadSharePointLibraries(libraries?: string[]): Promise<string[]>;
    /**
     * Execute SharePoint context operations
     */
    static executeWithContext<T>(callback: (context: any) => T): Promise<T>;
    /**
     * Get current page information
     */
    static getPageInfo(): IPageInfo;
    /**
     * Redirect to SharePoint page
     */
    static redirectTo(url: string): void;
    /**
     * Open SharePoint dialog
     */
    static openDialog(options?: any): any;
    /**
     * Close SharePoint dialog
     */
    static closeDialog(result?: any): void;
    /**
     * Get environment information
     */
    static getEnvironmentInfo(): IEnvironmentInfo;
    /**
     * Get SharePoint request headers for API calls
     */
    static getSharePointHeaders(requestId?: string, correlationId?: string): Record<string, string>;
    /**
     * Check if user has specific permission
     */
    static hasPermission(permission: string): boolean;
    /**
     * Get user's display name with fallback
     */
    static getUserDisplayName(fallback?: string): string;
    /**
     * Get web absolute URL with fallback
     */
    static getWebAbsoluteUrl(): string;
}
/**
 * Export utility functions for convenience
 */
export declare const getCurrentUser: typeof SPFXHelper.getCurrentUser;
export declare const getPageContext: typeof SPFXHelper.getPageContext;
export declare const isInSharePoint: typeof SPFXHelper.isInSharePoint;
export declare const showNotification: typeof SPFXHelper.showNotification;
export declare const isDevelopmentMode: typeof SPFXHelper.isDevelopmentMode;
export declare const getWebContext: typeof SPFXHelper.getWebContext;
export declare const getEnvironmentInfo: typeof SPFXHelper.getEnvironmentInfo;
export declare const getSharePointHeaders: typeof SPFXHelper.getSharePointHeaders;
/**
 * Export default class
 */
export default SPFXHelper;
