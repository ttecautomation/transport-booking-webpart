/**
 * Custom React Hook for API Operations
 * Provides reusable API state management with SPFx context support
 * Dependencies: react, api.ts, WebPartContext
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ApiError } from '../services/api';
interface IUseApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    params?: Record<string, any>;
    body?: any;
    dependencies?: any[];
    immediate?: boolean;
    context?: WebPartContext;
    skipRetry?: boolean;
    timeout?: number;
}
interface IUseApiResult<T> {
    data: T | null;
    loading: boolean;
    error: ApiError | null;
    lastFetched: Date | null;
    execute: (overrideOptions?: Partial<IUseApiOptions>) => Promise<T>;
    refetch: () => Promise<T>;
    reset: () => void;
    isStale: (maxAge?: number) => boolean;
}
/**
 * Custom hook for API operations with enhanced error handling and SPFx support
 */
export declare const useApi: <T = any>(url: string | null, options?: IUseApiOptions) => IUseApiResult<T>;
/**
 * Specialized hook for employee data
 */
export declare const useEmployee: (email: string, context?: WebPartContext) => IUseApiResult<any>;
/**
 * Specialized hook for shifts data
 */
export declare const useShifts: (site: string, context?: WebPartContext) => IUseApiResult<any[]>;
/**
 * Specialized hook for stations data
 */
export declare const useStations: (siteId: number, context?: WebPartContext) => IUseApiResult<any[]>;
/**
 * Specialized hook for booking dates
 */
export declare const useBookingDates: (bookingPeriod: string, context?: WebPartContext) => IUseApiResult<any>;
/**
 * Hook for form submission with loading state
 */
export declare const useFormSubmission: (context?: WebPartContext) => {
    isSubmitting: boolean;
    isSuccess: boolean;
    submissionError: ApiError;
    submitForm: (url: string, data: any) => Promise<any>;
    resetSubmissionState: () => void;
};
/**
 * Hook for managing multiple API calls with loading states
 */
export declare const useBatchApi: (context?: WebPartContext) => {
    batchLoading: boolean;
    batchProgress: number;
    batchCompleted: number;
    batchTotal: number;
    batchErrors: ApiError[];
    executeBatch: (requests: Array<{
        url: string;
        options?: IUseApiOptions;
        label?: string;
    }>) => Promise<any[]>;
    resetBatch: () => void;
};
export default useApi;
