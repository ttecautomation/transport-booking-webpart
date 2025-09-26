/**
 * Base API configuration and utilities
 * Provides centralized HTTP client setup with interceptors for SPFx
 * Dependencies: axios, @microsoft/sp-webpart-base, environment.ts
 */
import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { API_ENDPOINTS } from '../constants/index';
interface IApiConfig {
    BASE_URL: string;
    TIMEOUT: number;
    RETRY_ATTEMPTS: number;
}
interface IApiError extends Error {
    name: string;
    status: number;
    data: any;
    config?: AxiosRequestConfig;
}
export declare const API_CONFIG: IApiConfig;
export { API_ENDPOINTS };
/**
 * Custom API Error class with enhanced error information
 */
export declare class ApiError extends Error implements IApiError {
    name: string;
    status: number;
    data: any;
    config?: AxiosRequestConfig;
    constructor(message: string, status?: number, data?: any, config?: AxiosRequestConfig);
    /**
     * Get user-friendly error message based on status code
     */
    getUserFriendlyMessage(): string;
    /**
     * Check if error is retryable
     */
    isRetryable(): boolean;
}
/**
 * Create singleton API client instance
 */
export declare const apiClient: AxiosInstance;
/**
 * Add SharePoint context headers to request config
 */
export declare const addSharePointHeaders: (config?: AxiosRequestConfig, context?: WebPartContext) => AxiosRequestConfig;
/**
 * Generic API request methods with enhanced error handling and SPFx support
 */
export declare const apiRequest: {
    /**
     * GET request with SPFx context support
     */
    get: <T = any>(url: string, config?: AxiosRequestConfig, context?: WebPartContext) => Promise<AxiosResponse<T, any>>;
    /**
     * POST request with SPFx context support
     */
    post: <T_1 = any>(url: string, data?: any, config?: AxiosRequestConfig, context?: WebPartContext) => Promise<AxiosResponse<T_1, any>>;
    /**
     * PUT request with SPFx context support
     */
    put: <T_2 = any>(url: string, data?: any, config?: AxiosRequestConfig, context?: WebPartContext) => Promise<AxiosResponse<T_2, any>>;
    /**
     * DELETE request with SPFx context support
     */
    delete: <T_3 = any>(url: string, config?: AxiosRequestConfig, context?: WebPartContext) => Promise<AxiosResponse<T_3, any>>;
    /**
     * PATCH request with SPFx context support
     */
    patch: <T_4 = any>(url: string, data?: any, config?: AxiosRequestConfig, context?: WebPartContext) => Promise<AxiosResponse<T_4, any>>;
};
/**
 * Environment detection and configuration utilities
 */
export declare const environment: {
    isDevelopment: () => boolean;
    isProduction: () => boolean;
    apiBaseUrl: () => string;
    getConfig: () => {
        ENVIRONMENT: string;
        API_BASE_URL: string;
        VERSION: string;
        BUILD_DATE: string;
        TIMEOUT: number;
        RETRY_ATTEMPTS: number;
    };
    /**
     * Test API connectivity
     */
    testConnection: (context?: WebPartContext) => Promise<boolean>;
    /**
     * Get API health status with detailed information
     */
    getHealthStatus: (context?: WebPartContext) => Promise<{
        isHealthy: boolean;
        responseTime: number;
        status: number;
        message: string;
    }>;
};
/**
 * Utility functions for error handling
 */
export declare const errorUtils: {
    /**
     * Check if error is an API error
     */
    isApiError: (error: any) => error is ApiError;
    /**
     * Extract user-friendly message from any error
     */
    getUserMessage: (error: any) => string;
    /**
     * Log error with context
     */
    logError: (error: any, context?: string) => void;
};
/**
 * Export default configured client
 */
export default apiClient;
