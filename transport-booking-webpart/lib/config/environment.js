/**
 * SPFx Environment Configuration
 * Base configuration for the entire application
 * Dependencies: None (base file)
 */
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
// Environment detection utilities
const isSharePointEnvironment = () => {
    return Environment.type === EnvironmentType.SharePoint ||
        Environment.type === EnvironmentType.ClassicSharePoint;
};
const isLocalEnvironment = () => {
    return Environment.type === EnvironmentType.Local;
};
const isTeamsEnvironment = () => {
    // Fixed: Check for Teams environment without using non-existent property
    return typeof window.microsoftTeams !== 'undefined' ||
        window.location.hostname.includes('teams.microsoft.com') ||
        Environment.type === EnvironmentType.SharePoint; // Teams apps run in SharePoint context
};
// Auto-detect API base URL based on environment
const getApiBaseUrl = () => {
    if (isLocalEnvironment()) {
        // Development environment - update with your local API URL
        return 'http://localhost:5165/api/Transport';
    }
    // Production environment - update with your Azure API URL
    return 'https://your-api.azurewebsites.net/api/Transport';
};
// Main configuration object
export const config = {
    api: {
        baseUrl: getApiBaseUrl(),
        timeout: 30000,
        retryAttempts: 3
    },
    app: {
        name: 'Transport Booking System',
        version: '1.0.0',
        environment: isLocalEnvironment() ? 'development' : 'production',
        buildDate: new Date().toISOString()
    },
    features: {
        enableLogging: isLocalEnvironment(),
        enableMockData: false,
        enableDebugMode: isLocalEnvironment()
    },
    sharepoint: {
        listNames: {
            bookings: 'TransportBookings',
            shifts: 'ShiftMaster',
            stations: 'TransportStations'
        }
    },
    validation: {
        maxWeeklyOffs: {
            month: 2,
            week: 6
        },
        phoneLength: 10
    }
};
// Environment Detection Utilities
export const isDevelopment = () => isLocalEnvironment();
export const isProduction = () => !isLocalEnvironment();
export const isLoggingEnabled = () => config.features.enableLogging;
export const isSharePoint = () => isSharePointEnvironment();
export const isTeams = () => isTeamsEnvironment();
// Safe console logging with SPFx integration
export const logger = {
    log: (...args) => {
        if (isLoggingEnabled()) {
            console.log('[Transport Booking]', ...args);
        }
    },
    error: (...args) => {
        // Always log errors
        console.error('[Transport Booking ERROR]', ...args);
    },
    warn: (...args) => {
        if (isLoggingEnabled()) {
            console.warn('[Transport Booking WARN]', ...args);
        }
    },
    info: (...args) => {
        if (isLoggingEnabled()) {
            console.info('[Transport Booking INFO]', ...args);
        }
    },
    debug: (...args) => {
        if (isDevelopment()) {
            console.debug('[Transport Booking DEBUG]', ...args);
        }
    }
};
// Get comprehensive environment information
export const getEnvironmentInfo = () => {
    return {
        spfxEnvironmentType: Environment.type,
        spfxEnvironmentTypeName: EnvironmentType[Environment.type],
        isSharePoint: isSharePointEnvironment(),
        isLocal: isLocalEnvironment(),
        isTeams: isTeamsEnvironment(),
        apiBaseUrl: config.api.baseUrl,
        currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
        port: typeof window !== 'undefined' ? window.location.port : 'N/A',
        protocol: typeof window !== 'undefined' ? window.location.protocol : 'N/A',
        config: config,
        buildDate: config.app.buildDate
    };
};
// Initialize and log configuration on load
logger.log('SPFx Environment Configuration Loaded:');
logger.log('- Environment Type:', EnvironmentType[Environment.type]);
logger.log('- Environment:', config.app.environment);
logger.log('- API Base URL:', config.api.baseUrl);
logger.log('- Logging Enabled:', config.features.enableLogging);
if (isDevelopment()) {
    logger.debug('Full Environment Info:', getEnvironmentInfo());
}
export default config;
//# sourceMappingURL=environment.js.map