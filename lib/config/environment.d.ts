/**
 * SPFx Environment Configuration
 * Base configuration for the entire application
 * Dependencies: None (base file)
 */
import { EnvironmentType } from '@microsoft/sp-core-library';
interface IAppConfig {
    api: {
        baseUrl: string;
        timeout: number;
        retryAttempts: number;
    };
    app: {
        name: string;
        version: string;
        environment: string;
        buildDate: string;
    };
    features: {
        enableLogging: boolean;
        enableMockData: boolean;
        enableDebugMode: boolean;
    };
    sharepoint: {
        listNames: {
            bookings: string;
            shifts: string;
            stations: string;
        };
    };
    validation: {
        maxWeeklyOffs: {
            month: number;
            week: number;
        };
        phoneLength: number;
    };
}
export declare const config: IAppConfig;
export declare const isDevelopment: () => boolean;
export declare const isProduction: () => boolean;
export declare const isLoggingEnabled: () => boolean;
export declare const isSharePoint: () => boolean;
export declare const isTeams: () => boolean;
export declare const logger: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
};
export declare const getEnvironmentInfo: () => {
    spfxEnvironmentType: EnvironmentType;
    spfxEnvironmentTypeName: string;
    isSharePoint: boolean;
    isLocal: boolean;
    isTeams: boolean;
    apiBaseUrl: string;
    currentUrl: string;
    hostname: string;
    port: string;
    protocol: string;
    config: IAppConfig;
    buildDate: string;
};
export default config;
