/**
 * Transport Service
 * Main service for handling transport booking API operations
 * Dependencies: api.ts, spfxHelpers.ts, environment.ts, WebPartContext
 */
import { WebPartContext } from '@microsoft/sp-webpart-base';
interface IApiResponse<T = any> {
    STATUS: string;
    MESSAGE: string;
    DATA?: T;
}
interface IEmployee {
    FULL_NAME: string;
    ORACLEID: string;
    EMAILID: string;
    MOBILE_NUMBER_P: string;
    LOCATION: string;
    LOCATION_NAME: string;
    PROGRAM: string;
    DESIGNATION: string;
    SITE_CODE: string;
    SITEID: number;
}
interface IShift {
    SHIFT_ID: number;
    SHIFT_START: string;
    SHIFT_END: string;
    SHIFT_DISPLAY?: string;
    CHARGEABLE_PICKUP: boolean;
    CHARGEABLE_DROPOFF: boolean;
}
interface IStation {
    ID: number;
    STATION_NAME: string;
    STATION_DISPLAY?: string;
    DISTANCE_SLAB?: string;
    LATITUDE?: number;
    LONGITUDE?: number;
}
interface IBookingDates {
    startDate: string;
    endDate: string;
    lockDate: string;
    lockDateFormatted: string;
}
/**
 * Transport Service Class
 * Handles all transport-related API operations
 */
declare class TransportService {
    /**
     * Get employee details by email address
     */
    getEmployeeByEmail(email: string, context?: WebPartContext): Promise<IEmployee | null>;
    /**
     * Get shifts by site code
     */
    getShiftsBySite(site: string, context?: WebPartContext): Promise<IShift[]>;
    /**
     * Get stations by site ID
     */
    getStationsBySite(siteId: number, context?: WebPartContext): Promise<IStation[]>;
    /**
     * Get booking dates for a period
     */
    getBookingDates(bookingPeriod: string, context?: WebPartContext): Promise<IBookingDates>;
    /**
     * Validate if booking period is still open
     */
    validateBookingPeriod(bookingPeriod: string, context?: WebPartContext): Promise<boolean>;
    /**
     * Submit transport booking
     */
    submitBooking(bookingData: any, context?: WebPartContext): Promise<IApiResponse>;
    /**
     * Get user preferences history
     */
    getUserPreferences(email: string, context?: WebPartContext): Promise<any[]>;
    /**
     * Get transport booking history for user
     */
    getBookingHistory(email: string, limit?: number, context?: WebPartContext): Promise<any[]>;
    /**
     * Health check for transport service
     */
    healthCheck(context?: WebPartContext): Promise<boolean>;
    /**
     * Test API connection
     */
    testConnection(context?: WebPartContext): Promise<boolean>;
    /**
     * Get API information for debugging
     */
    getApiInfo(): any;
    /**
     * Get service configuration and settings
     */
    getServiceConfig(context?: WebPartContext): Promise<any>;
    /**
     * Batch operation to get all required data for form initialization
     * Fixed: Use manual Promise implementation for es2020 target
     */
    initializeFormData(email: string, site: string, siteId: number, context?: WebPartContext): Promise<{
        employee: IEmployee | null;
        shifts: IShift[];
        stations: IStation[];
        preferences: any[];
        config: any;
    }>;
    /**
     * Utility method to get current user from SharePoint context
     */
    getCurrentUserInfo(context?: WebPartContext): {
        email: string;
        displayName: string;
        loginName: string;
    };
    /**
     * Log user activity for analytics
     */
    logUserActivity(activityData: {
        email: string;
        activity: string;
        details?: any;
        timestamp?: string;
    }, context?: WebPartContext): Promise<void>;
}
declare const transportService: TransportService;
export default transportService;
export { TransportService };
