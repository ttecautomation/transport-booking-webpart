/**
 * Transport Service
 * Main service for handling transport booking API operations
 * Dependencies: api.ts, spfxHelpers.ts, environment.ts, WebPartContext
 */
import { apiRequest, errorUtils } from './api';
import { logger } from '../config/environment';
/**
 * Transport Service Class
 * Handles all transport-related API operations
 */
class TransportService {
    /**
     * Get employee details by email address
     */
    async getEmployeeByEmail(email, context) {
        try {
            logger.log('TransportService: Getting employee by email:', email);
            const response = await apiRequest.post('/employee', { emailAddress: email }, {}, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Employee data retrieved successfully');
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: Employee not found or API returned unsuccessful status');
                return null;
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting employee by email:', error);
            errorUtils.logError(error, 'getEmployeeByEmail');
            throw error;
        }
    }
    /**
     * Get shifts by site code
     */
    async getShiftsBySite(site, context) {
        try {
            logger.log('TransportService: Getting shifts for site:', site);
            const response = await apiRequest.get('/shifts', { params: { site } }, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Shifts data retrieved successfully:', response.data.DATA.length);
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: No shifts found or API returned unsuccessful status');
                return [];
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting shifts by site:', error);
            errorUtils.logError(error, 'getShiftsBySite');
            throw error;
        }
    }
    /**
     * Get stations by site ID
     */
    async getStationsBySite(siteId, context) {
        try {
            logger.log('TransportService: Getting stations for siteId:', siteId);
            const response = await apiRequest.get('/stations', { params: { siteId } }, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Stations data retrieved successfully:', response.data.DATA.length);
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: No stations found or API returned unsuccessful status');
                return [];
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting stations by site:', error);
            errorUtils.logError(error, 'getStationsBySite');
            throw error;
        }
    }
    /**
     * Get booking dates for a period
     */
    async getBookingDates(bookingPeriod, context) {
        try {
            logger.log('TransportService: Getting booking dates for period:', bookingPeriod);
            const response = await apiRequest.get('/booking-dates', { params: { bookingPeriod } }, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Booking dates retrieved successfully');
                return response.data.DATA;
            }
            else {
                throw new Error(response.data?.MESSAGE || 'Failed to get booking dates');
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting booking dates:', error);
            errorUtils.logError(error, 'getBookingDates');
            throw error;
        }
    }
    /**
     * Validate if booking period is still open
     */
    async validateBookingPeriod(bookingPeriod, context) {
        try {
            logger.log('TransportService: Validating booking period:', bookingPeriod);
            const response = await apiRequest.get('/booking/validate', { params: { bookingPeriod } }, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                return response.data.DATA.isOpen;
            }
            else {
                logger.warn('TransportService: Unable to validate booking period, assuming closed');
                return false;
            }
        }
        catch (error) {
            logger.error('TransportService: Error validating booking period:', error);
            // If validation fails, assume period is closed for safety
            return false;
        }
    }
    /**
     * Submit transport booking
     */
    async submitBooking(bookingData, context) {
        try {
            logger.log('TransportService: Submitting booking:', bookingData);
            // Add SharePoint context information if available
            if (context) {
                const pageContext = context.pageContext;
                bookingData.SubmissionContext = {
                    RequestId: pageContext.requestId || '',
                    CorrelationId: pageContext.correlationId || '',
                    UserLoginName: pageContext.user?.loginName || '',
                    WebUrl: pageContext.web.absoluteUrl || '',
                    SiteUrl: pageContext.site?.absoluteUrl || '',
                    SubmittedAt: new Date().toISOString()
                };
            }
            const response = await apiRequest.post('/booking/submit', bookingData, {}, context);
            logger.log('TransportService: Booking submission response:', response.data);
            return response.data;
        }
        catch (error) {
            logger.error('TransportService: Error submitting booking:', error);
            errorUtils.logError(error, 'submitBooking');
            throw error;
        }
    }
    /**
     * Get user preferences history
     */
    async getUserPreferences(email, context) {
        try {
            logger.log('TransportService: Getting user preferences for:', email);
            const response = await apiRequest.post('/preferences', { emailAddress: email }, {}, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: User preferences retrieved successfully');
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: No preferences found');
                return [];
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting user preferences:', error);
            // Don't throw error for preferences - it's not critical
            return [];
        }
    }
    /**
     * Get transport booking history for user
     */
    async getBookingHistory(email, limit = 10, context) {
        try {
            logger.log('TransportService: Getting booking history for:', email);
            const response = await apiRequest.post('/preferences/history', { emailAddress: email, limit }, {}, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Booking history retrieved successfully');
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: No booking history found');
                return [];
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting booking history:', error);
            // Don't throw error for history - it's not critical
            return [];
        }
    }
    /**
     * Health check for transport service
     */
    async healthCheck(context) {
        try {
            logger.log('TransportService: Performing health check');
            const response = await apiRequest.get('/health', {
                timeout: 10000,
                skipRetry: true
            }, context);
            const isHealthy = response.data?.STATUS === 'SUCCESS' || response.status === 200;
            logger.log('TransportService: Health check result:', isHealthy);
            return isHealthy;
        }
        catch (error) {
            logger.error('TransportService: Health check failed:', error);
            return false;
        }
    }
    /**
     * Test API connection
     */
    async testConnection(context) {
        try {
            return await this.healthCheck(context);
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Get API information for debugging
     */
    getApiInfo() {
        return {
            baseUrl: process.env.NODE_ENV || 'production',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'production',
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Get service configuration and settings
     */
    async getServiceConfig(context) {
        try {
            logger.log('TransportService: Getting service configuration');
            const response = await apiRequest.get('/config', {}, context);
            if (response.data?.STATUS === 'SUCCESS' && response.data?.DATA) {
                logger.log('TransportService: Service configuration retrieved successfully');
                return response.data.DATA;
            }
            else {
                logger.warn('TransportService: Using default configuration');
                return {
                    maxRetryAttempts: 3,
                    timeout: 30000,
                    enableDebugLogging: false,
                    supportedSites: ['ahmedabad', 'mohali'],
                    maxBookingDays: 35
                };
            }
        }
        catch (error) {
            logger.error('TransportService: Error getting service configuration:', error);
            // Return default config if service config fails
            return {
                maxRetryAttempts: 3,
                timeout: 30000,
                enableDebugLogging: false,
                supportedSites: ['ahmedabad', 'mohali'],
                maxBookingDays: 35
            };
        }
    }
    /**
     * Batch operation to get all required data for form initialization
     * Fixed: Use manual Promise implementation for es2020 target
     */
    async initializeFormData(email, site, siteId, context) {
        try {
            logger.log('TransportService: Initializing form data for:', { email, site, siteId });
            // Manual Promise settlement implementation for es2020 compatibility
            const promises = [
                this.getEmployeeByEmail(email, context).catch(error => ({ error, result: null })),
                this.getShiftsBySite(site, context).catch(error => ({ error, result: [] })),
                this.getStationsBySite(siteId, context).catch(error => ({ error, result: [] })),
                this.getUserPreferences(email, context).catch(error => ({ error, result: [] })),
                this.getServiceConfig(context).catch(error => ({ error, result: {} }))
            ];
            const results = await Promise.all(promises);
            const result = {
                employee: results[0] && !('error' in results[0]) ? results[0] : null,
                shifts: results[1] && !('error' in results[1]) ? results[1] : [],
                stations: results[2] && !('error' in results[2]) ? results[2] : [],
                preferences: results[3] && !('error' in results[3]) ? results[3] : [],
                config: results[4] && !('error' in results[4]) ? results[4] : {}
            };
            logger.log('TransportService: Form data initialized successfully:', {
                employeeFound: !!result.employee,
                shiftsCount: result.shifts.length,
                stationsCount: result.stations.length,
                preferencesCount: result.preferences.length,
                configLoaded: !!result.config
            });
            return result;
        }
        catch (error) {
            logger.error('TransportService: Error initializing form data:', error);
            errorUtils.logError(error, 'initializeFormData');
            throw error;
        }
    }
    /**
     * Utility method to get current user from SharePoint context
     */
    getCurrentUserInfo(context) {
        if (!context) {
            return {
                email: '',
                displayName: '',
                loginName: ''
            };
        }
        const user = context.pageContext.user;
        return {
            email: user.email || '',
            displayName: user.displayName || '',
            loginName: user.loginName || ''
        };
    }
    /**
     * Log user activity for analytics
     */
    async logUserActivity(activityData, context) {
        try {
            const logData = {
                ...activityData,
                timestamp: activityData.timestamp || new Date().toISOString(),
                sessionId: context ? context.sessionId || 'unknown' : 'unknown',
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            // Fire and forget - don't wait for response
            apiRequest.post('/analytics/log', logData, {
                timeout: 5000,
                skipRetry: true
            }, context).catch(error => {
                logger.warn('TransportService: Failed to log user activity (non-critical):', error);
            });
        }
        catch (error) {
            // Ignore analytics logging errors - they shouldn't affect user experience
            logger.warn('TransportService: Error setting up activity logging (non-critical):', error);
        }
    }
}
// Create singleton instance
const transportService = new TransportService();
// Export default instance
export default transportService;
// Export class for testing purposes
export { TransportService };
//# sourceMappingURL=transportService.js.map