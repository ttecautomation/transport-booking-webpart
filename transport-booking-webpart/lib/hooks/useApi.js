/**
 * Custom React Hook for API Operations
 * Provides reusable API state management with SPFx context support
 * Dependencies: react, api.ts, WebPartContext
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest, ApiError, errorUtils } from '../services/api';
import { logger } from '../config/environment';
/**
 * Custom hook for API operations with enhanced error handling and SPFx support
 */
export const useApi = (url, options = {}) => {
    const { method = 'GET', params = {}, body = null, dependencies = [], immediate = true, context, skipRetry = false, timeout } = options;
    // State management
    const [state, setState] = useState({
        data: null,
        loading: false,
        error: null,
        lastFetched: null
    });
    // Use ref to track if component is mounted to prevent state updates on unmounted components
    const isMountedRef = useRef(true);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    // Safe state update function
    const safeSetState = useCallback((updater) => {
        if (isMountedRef.current) {
            setState(prevState => ({ ...prevState, ...updater }));
        }
    }, []);
    // Execute API request function
    const execute = useCallback(async (overrideOptions = {}) => {
        if (!url) {
            const error = new ApiError('URL is required for API request', 0);
            safeSetState({ error, loading: false });
            throw error;
        }
        // Merge options
        const mergedOptions = {
            method,
            params,
            body,
            context,
            skipRetry,
            timeout,
            ...overrideOptions
        };
        safeSetState({ loading: true, error: null });
        try {
            let response;
            // Prepare request config - use our custom interface
            const requestConfig = {
                params: mergedOptions.params,
                timeout: mergedOptions.timeout,
                skipRetry: mergedOptions.skipRetry
            };
            // Execute request based on method
            switch (mergedOptions.method) {
                case 'POST':
                    response = await apiRequest.post(url, mergedOptions.body, requestConfig, mergedOptions.context);
                    break;
                case 'PUT':
                    response = await apiRequest.put(url, mergedOptions.body, requestConfig, mergedOptions.context);
                    break;
                case 'PATCH':
                    response = await apiRequest.patch(url, mergedOptions.body, requestConfig, mergedOptions.context);
                    break;
                case 'DELETE':
                    response = await apiRequest.delete(url, requestConfig, mergedOptions.context);
                    break;
                default:
                    response = await apiRequest.get(url, requestConfig, mergedOptions.context);
            }
            const responseData = response.data;
            const fetchTime = new Date();
            safeSetState({
                data: responseData,
                loading: false,
                error: null,
                lastFetched: fetchTime
            });
            logger.log(`useApi: Successfully executed ${mergedOptions.method} ${url}`);
            return responseData;
        }
        catch (err) {
            const apiError = err instanceof ApiError ? err : new ApiError(err instanceof Error ? err.message : 'Unknown error occurred', 0, null);
            safeSetState({
                loading: false,
                error: apiError
            });
            // Log error with context
            errorUtils.logError(apiError, `useApi ${mergedOptions.method} ${url}`);
            throw apiError;
        }
    }, [url, method, JSON.stringify(params), JSON.stringify(body), context, skipRetry, timeout]);
    // Refetch function (uses current options)
    const refetch = useCallback(() => {
        return execute();
    }, [execute]);
    // Reset function
    const reset = useCallback(() => {
        safeSetState({
            data: null,
            loading: false,
            error: null,
            lastFetched: null
        });
    }, [safeSetState]);
    // Check if data is stale
    const isStale = useCallback((maxAge = 300000) => {
        if (!state.lastFetched)
            return true;
        return Date.now() - state.lastFetched.getTime() > maxAge;
    }, [state.lastFetched]);
    // Auto-execute on dependencies change
    useEffect(() => {
        if (immediate && url) {
            execute().catch(error => {
                // Error is already handled in execute function
                logger.debug('Auto-execute failed:', error.message);
            });
        }
    }, [immediate, url, ...dependencies]);
    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        lastFetched: state.lastFetched,
        execute,
        refetch,
        reset,
        isStale
    };
};
/**
 * Specialized hook for employee data
 */
export const useEmployee = (email, context) => {
    return useApi('/employee', {
        method: 'POST',
        body: { emailAddress: email },
        immediate: !!email,
        context,
        dependencies: [email]
    });
};
/**
 * Specialized hook for shifts data
 */
export const useShifts = (site, context) => {
    return useApi('/shifts', {
        method: 'GET',
        params: { site },
        immediate: !!site,
        context,
        dependencies: [site]
    });
};
/**
 * Specialized hook for stations data
 */
export const useStations = (siteId, context) => {
    return useApi('/stations', {
        method: 'GET',
        params: { siteId },
        immediate: !!siteId,
        context,
        dependencies: [siteId]
    });
};
/**
 * Specialized hook for booking dates
 */
export const useBookingDates = (bookingPeriod, context) => {
    return useApi('/booking-dates', {
        method: 'GET',
        params: { bookingPeriod },
        immediate: !!bookingPeriod,
        context,
        dependencies: [bookingPeriod]
    });
};
/**
 * Hook for form submission with loading state
 */
export const useFormSubmission = (context) => {
    const [submissionState, setSubmissionState] = useState({
        isSubmitting: false,
        isSuccess: false,
        submissionError: null
    });
    const submitForm = useCallback(async (url, data) => {
        setSubmissionState({
            isSubmitting: true,
            isSuccess: false,
            submissionError: null
        });
        try {
            const response = await apiRequest.post(url, data, {}, context);
            setSubmissionState({
                isSubmitting: false,
                isSuccess: true,
                submissionError: null
            });
            // Auto-reset success state after 5 seconds
            setTimeout(() => {
                setSubmissionState(prev => ({ ...prev, isSuccess: false }));
            }, 5000);
            return response.data;
        }
        catch (error) {
            const apiError = error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : 'Submission failed', 0);
            setSubmissionState({
                isSubmitting: false,
                isSuccess: false,
                submissionError: apiError
            });
            throw apiError;
        }
    }, [context]);
    const resetSubmissionState = useCallback(() => {
        setSubmissionState({
            isSubmitting: false,
            isSuccess: false,
            submissionError: null
        });
    }, []);
    return {
        isSubmitting: submissionState.isSubmitting,
        isSuccess: submissionState.isSuccess,
        submissionError: submissionState.submissionError,
        submitForm,
        resetSubmissionState
    };
};
/**
 * Hook for managing multiple API calls with loading states
 */
export const useBatchApi = (context) => {
    const [batchState, setBatchState] = useState({
        loading: false,
        completed: 0,
        total: 0,
        errors: []
    });
    const executeBatch = useCallback(async (requests) => {
        setBatchState({
            loading: true,
            completed: 0,
            total: requests.length,
            errors: []
        });
        const results = [];
        const errors = [];
        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            try {
                const { method = 'GET', params, body } = request.options || {};
                let response;
                switch (method) {
                    case 'POST':
                        response = await apiRequest.post(request.url, body, { params }, context);
                        break;
                    case 'PUT':
                        response = await apiRequest.put(request.url, body, { params }, context);
                        break;
                    case 'DELETE':
                        response = await apiRequest.delete(request.url, { params }, context);
                        break;
                    default:
                        response = await apiRequest.get(request.url, { params }, context);
                }
                results.push({
                    success: true,
                    data: response.data,
                    label: request.label,
                    url: request.url
                });
                logger.log(`Batch request ${i + 1}/${requests.length} completed: ${request.label || request.url}`);
            }
            catch (error) {
                const apiError = error instanceof ApiError ? error : new ApiError(error instanceof Error ? error.message : 'Request failed', 0);
                results.push({
                    success: false,
                    error: apiError,
                    label: request.label,
                    url: request.url
                });
                errors.push(apiError);
                logger.error(`Batch request ${i + 1}/${requests.length} failed: ${request.label || request.url}`, apiError);
            }
            setBatchState(prev => ({ ...prev, completed: i + 1 }));
        }
        setBatchState(prev => ({
            ...prev,
            loading: false,
            errors
        }));
        return results;
    }, [context]);
    const resetBatch = useCallback(() => {
        setBatchState({
            loading: false,
            completed: 0,
            total: 0,
            errors: []
        });
    }, []);
    return {
        batchLoading: batchState.loading,
        batchProgress: batchState.total > 0 ? (batchState.completed / batchState.total) * 100 : 0,
        batchCompleted: batchState.completed,
        batchTotal: batchState.total,
        batchErrors: batchState.errors,
        executeBatch,
        resetBatch
    };
};
// Export default hook
export default useApi;
//# sourceMappingURL=useApi.js.map