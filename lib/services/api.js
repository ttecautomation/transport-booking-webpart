/**
 * Base API configuration and utilities
 * Provides centralized HTTP client setup with interceptors for SPFx
 * Dependencies: axios, @microsoft/sp-webpart-base, environment.ts
 */
import axios from 'axios';
import { config, logger } from '../config/environment';
import { API_ENDPOINTS } from '../constants/index';
// API Configuration from environment
export const API_CONFIG = {
    BASE_URL: config.api.baseUrl,
    TIMEOUT: config.api.timeout,
    RETRY_ATTEMPTS: config.api.retryAttempts,
};
// Re-export API endpoints for convenience
export { API_ENDPOINTS };
/**
 * Custom API Error class with enhanced error information
 */
export class ApiError extends Error {
    constructor(message, status = 0, data = null, config) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
        this.config = config;
        // Ensure the error name is set correctly
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    /**
     * Get user-friendly error message based on status code
     */
    getUserFriendlyMessage() {
        switch (this.status) {
            case 0:
                return 'Network connection error. Please check your internet connection.';
            case 400:
                return 'Invalid request. Please check your input and try again.';
            case 401:
                return 'Authentication required. Please log in and try again.';
            case 403:
                return 'Access denied. You do not have permission to perform this action.';
            case 404:
                return 'The requested resource was not found.';
            case 408:
                return 'Request timeout. Please try again.';
            case 409:
                return 'There is a conflict with your request. Please check and try again.';
            case 422:
                return 'Invalid data provided. Please correct the errors and try again.';
            case 429:
                return 'Too many requests. Please wait a moment and try again.';
            case 500:
                return 'Server error. Please try again later.';
            case 502:
                return 'Bad gateway. The server is temporarily unavailable.';
            case 503:
                return 'Service unavailable. Please try again later.';
            case 504:
                return 'Gateway timeout. The server took too long to respond.';
            default:
                return this.message || 'An unexpected error occurred. Please try again.';
        }
    }
    /**
     * Check if error is retryable
     */
    isRetryable() {
        // Network errors and server errors (5xx) are typically retryable
        if (this.status === 0)
            return true; // Network error
        if (this.status >= 500 && this.status <= 599)
            return true; // Server errors
        if (this.status === 408)
            return true; // Timeout
        if (this.status === 429)
            return true; // Rate limiting (with backoff)
        return false;
    }
}
/**
 * Create configured axios instance with SPFx integration
 */
const createApiClient = () => {
    const client = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    // Request interceptor
    client.interceptors.request.use((requestConfig) => {
        // Add timestamp to prevent caching
        requestConfig.params = {
            ...requestConfig.params,
            _t: Date.now()
        };
        // Add User-Agent for SPFx identification
        if (requestConfig.headers) {
            requestConfig.headers['User-Agent'] = 'SPFx-Transport-Booking/1.0.0';
            requestConfig.headers['X-Requested-With'] = 'XMLHttpRequest';
        }
        // Log requests in development
        logger.log(`API Request:`, {
            method: requestConfig.method?.toUpperCase(),
            url: requestConfig.url,
            baseURL: requestConfig.baseURL,
            params: requestConfig.params,
            headers: requestConfig.headers,
            data: requestConfig.data ? '[DATA]' : undefined
        });
        return requestConfig;
    }, (error) => {
        logger.error('API Request Setup Error:', error);
        return Promise.reject(new ApiError('Request setup failed', 0, null, error.config));
    });
    // Response interceptor with retry logic
    client.interceptors.response.use((response) => {
        // Log successful responses in development
        logger.log(`API Response Success:`, {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            dataType: typeof response.data,
            dataSize: response.data ? JSON.stringify(response.data).length : 0
        });
        return response;
    }, async (error) => {
        const originalConfig = error.config;
        // Log errors
        logger.error('API Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message,
            url: originalConfig?.url,
            method: originalConfig?.method,
            data: error.response?.data
        });
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data, statusText } = error.response;
            // Fixed: Safe property access for response data
            let errorMessage = statusText;
            if (data) {
                if (typeof data === 'string') {
                    errorMessage = data;
                }
                else if (data && typeof data === 'object') {
                    // Type-safe property checks
                    if (data.hasOwnProperty('message') && typeof data.message === 'string') {
                        errorMessage = data.message;
                    }
                    else if (data.hasOwnProperty('error') && typeof data.error === 'string') {
                        errorMessage = data.error;
                    }
                    else if (data.hasOwnProperty('MESSAGE') && typeof data.MESSAGE === 'string') {
                        errorMessage = data.MESSAGE; // For your API's response format
                    }
                }
            }
            const apiError = new ApiError(errorMessage, status, data, originalConfig);
            // Implement retry logic for retryable errors
            if (originalConfig &&
                !originalConfig.skipRetry &&
                apiError.isRetryable() &&
                (!originalConfig._retryCount || originalConfig._retryCount < API_CONFIG.RETRY_ATTEMPTS)) {
                const retryCount = (originalConfig._retryCount || 0) + 1;
                const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                logger.warn(`Retrying request (${retryCount}/${API_CONFIG.RETRY_ATTEMPTS}) after ${delay}ms`, {
                    url: originalConfig.url,
                    method: originalConfig.method,
                    status
                });
                return new Promise((resolve) => {
                    setTimeout(() => {
                        originalConfig._retryCount = retryCount;
                        resolve(client(originalConfig));
                    }, delay);
                });
            }
            throw apiError;
        }
        else if (error.request) {
            // Network error - no response received
            let networkError;
            if (error.code === 'ECONNABORTED') {
                networkError = new ApiError('Request timeout. Please check your connection.', 408, null, originalConfig);
            }
            else if (error.code === 'ERR_NETWORK') {
                networkError = new ApiError('Network error. Please check your internet connection.', 0, null, originalConfig);
            }
            else {
                networkError = new ApiError('Unable to connect to the server. Please try again.', 0, null, originalConfig);
            }
            // Retry network errors
            if (originalConfig &&
                !originalConfig.skipRetry &&
                (!originalConfig._retryCount || originalConfig._retryCount < API_CONFIG.RETRY_ATTEMPTS)) {
                const retryCount = (originalConfig._retryCount || 0) + 1;
                const delay = Math.pow(2, retryCount) * 1000;
                logger.warn(`Retrying network request (${retryCount}/${API_CONFIG.RETRY_ATTEMPTS}) after ${delay}ms`);
                return new Promise((resolve) => {
                    setTimeout(() => {
                        originalConfig._retryCount = retryCount;
                        resolve(client(originalConfig));
                    }, delay);
                });
            }
            throw networkError;
        }
        else {
            // Request setup error
            throw new ApiError('Request configuration error.', 0, null, originalConfig);
        }
    });
    return client;
};
/**
 * Create singleton API client instance
 */
export const apiClient = createApiClient();
/**
 * Add SharePoint context headers to request config
 */
export const addSharePointHeaders = (config = {}, context) => {
    if (!context)
        return config;
    // Fixed: Use safe property access for PageContext properties
    const pageContext = context.pageContext;
    const headers = {
        ...config.headers,
        'SP-RequestGuid': pageContext.requestId || '',
        'SP-CorrelationId': pageContext.correlationId || '',
        'X-SP-WebUrl': pageContext.web.absoluteUrl || '',
        'X-SP-SiteUrl': pageContext.site?.absoluteUrl || '',
        'X-SP-UserLoginName': pageContext.user?.loginName || '',
    };
    // Remove empty headers
    Object.keys(headers).forEach(key => {
        if (!headers[key]) {
            delete headers[key];
        }
    });
    return {
        ...config,
        headers
    };
};
/**
 * Generic API request methods with enhanced error handling and SPFx support
 */
export const apiRequest = {
    /**
     * GET request with SPFx context support
     */
    get: async (url, config = {}, context) => {
        const requestConfig = addSharePointHeaders(config, context);
        return apiClient.get(url, requestConfig);
    },
    /**
     * POST request with SPFx context support
     */
    post: async (url, data = {}, config = {}, context) => {
        const requestConfig = addSharePointHeaders(config, context);
        return apiClient.post(url, data, requestConfig);
    },
    /**
     * PUT request with SPFx context support
     */
    put: async (url, data = {}, config = {}, context) => {
        const requestConfig = addSharePointHeaders(config, context);
        return apiClient.put(url, data, requestConfig);
    },
    /**
     * DELETE request with SPFx context support
     */
    delete: async (url, config = {}, context) => {
        const requestConfig = addSharePointHeaders(config, context);
        return apiClient.delete(url, requestConfig);
    },
    /**
     * PATCH request with SPFx context support
     */
    patch: async (url, data = {}, config = {}, context) => {
        const requestConfig = addSharePointHeaders(config, context);
        return apiClient.patch(url, data, requestConfig);
    }
};
/**
 * Environment detection and configuration utilities
 */
export const environment = {
    isDevelopment: () => config.app.environment === 'development',
    isProduction: () => config.app.environment === 'production',
    apiBaseUrl: () => API_CONFIG.BASE_URL,
    getConfig: () => ({
        ENVIRONMENT: config.app.environment,
        API_BASE_URL: API_CONFIG.BASE_URL,
        VERSION: config.app.version,
        BUILD_DATE: config.app.buildDate,
        TIMEOUT: API_CONFIG.TIMEOUT,
        RETRY_ATTEMPTS: API_CONFIG.RETRY_ATTEMPTS
    }),
    /**
     * Test API connectivity
     */
    testConnection: async (context) => {
        try {
            const response = await apiRequest.get('/health', {}, context);
            return response.status === 200;
        }
        catch (error) {
            logger.error('API connectivity test failed:', error);
            return false;
        }
    },
    /**
     * Get API health status with detailed information
     */
    getHealthStatus: async (context) => {
        const startTime = Date.now();
        try {
            const response = await apiRequest.get('/health', {
                timeout: 10000, // 10 second timeout for health check
            }, context);
            const responseTime = Date.now() - startTime;
            return {
                isHealthy: response.status === 200,
                responseTime,
                status: response.status,
                message: response.data?.message || 'API is healthy'
            };
        }
        catch (error) {
            const responseTime = Date.now() - startTime;
            const apiError = error;
            return {
                isHealthy: false,
                responseTime,
                status: apiError.status,
                message: apiError.getUserFriendlyMessage()
            };
        }
    }
};
/**
 * Utility functions for error handling
 */
export const errorUtils = {
    /**
     * Check if error is an API error
     */
    isApiError: (error) => {
        return error instanceof ApiError;
    },
    /**
     * Extract user-friendly message from any error
     */
    getUserMessage: (error) => {
        if (errorUtils.isApiError(error)) {
            return error.getUserFriendlyMessage();
        }
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return 'An unexpected error occurred. Please try again.';
    },
    /**
     * Log error with context
     */
    logError: (error, context = 'API') => {
        if (errorUtils.isApiError(error)) {
            logger.error(`${context} Error:`, {
                message: error.message,
                status: error.status,
                data: error.data,
                url: error.config?.url,
                method: error.config?.method
            });
        }
        else {
            logger.error(`${context} Error:`, error);
        }
    }
};
/**
 * Export default configured client
 */
export default apiClient;
//# sourceMappingURL=api.js.map