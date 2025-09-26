/**
 * Date Calculation Utilities
 * Implements PowerApps date logic for transport booking system
 * Dependencies: dayjs library, constants (optional)
 */
import { Dayjs } from 'dayjs';
interface IBookingDates {
    startDate: string;
    endDate: string;
    lockDate: string;
    lockDateFormatted: string;
    isLocked: boolean;
    isOpen: boolean;
    bookingStatus: string;
    statusColor: string;
    statusIcon: string;
    isException: boolean;
    originalLockDate?: string;
    exceptionNote?: string;
    daysUntilLock: number;
    hoursUntilLock: number;
    minutesUntilLock: number;
    timeRemainingText: string;
    urgencyLevel: string;
    daysUntilStart: number;
    totalDays: number;
    _startDate: Dayjs;
    _endDate: Dayjs;
    _lockDate: Dayjs;
}
interface IValidationResult {
    isValid: boolean;
    isOpen: boolean;
    canSubmit: boolean;
    bookingStatus: string;
    statusColor: string;
    statusIcon: string;
    timeRemaining: string;
    urgencyLevel: string;
    urgencyColor: string;
    daysRemaining: number;
    hoursRemaining: number;
    message: string;
    isException: boolean;
    exceptionNote?: string;
    dates: IBookingDates | null;
}
interface IWorkingDate {
    date: string;
    dayName: string;
    dayShort: string;
    formatted: string;
    dayjs: Dayjs;
}
interface IWeekInfo {
    weekNumber: number;
    year: number;
    startDate: string;
    endDate: string;
    currentDay: string;
    daysInWeek: Array<{
        date: string;
        dayName: string;
        isToday: boolean;
    }>;
}
interface IMonthInfo {
    month: number;
    year: number;
    monthName: string;
    startDate: string;
    endDate: string;
    daysInMonth: number;
    currentDate: number;
}
interface ITransportHoursResult {
    site: string;
    hour: number;
    isComplementary: boolean;
    isChargeable: boolean;
    period: string;
    timeRange: string;
}
interface IExceptionConfig {
    enabled: boolean;
    currentMonth: {
        overrideLockDate: string;
        expiryDate: string;
    };
    currentWeek: {
        overrideLockDate: string;
        expiryDate: string;
        isOneTimeOnly: boolean;
    };
}
/**
 * Date Calculation Helper Class
 * Implements exact PowerApps logic for booking periods
 */
export declare class DateCalculationHelper {
    /**
     * ONE-TIME EXCEPTION CONFIGURATION
     * These will override normal lock dates until the specified dates pass
     */
    static EXCEPTION_CONFIG: IExceptionConfig;
    /**
     * Check if a booking period should be available
     */
    static isPeriodAvailable(bookingPeriod: string): boolean;
    /**
     * Get available booking periods
     */
    static getAvailableBookingPeriods(): string[];
    /**
     * Check if exception is still active
     */
    static isExceptionActive(bookingPeriod: string): boolean;
    /**
     * Calculate booking dates using PowerApps logic
     */
    static calculateBookingDates(bookingPeriod: string): IBookingDates;
    /**
     * Get formatted time remaining text
     */
    static getTimeRemainingText(lockDate: Dayjs): string;
    /**
     * Get urgency level based on hours remaining
     */
    static getUrgencyLevel(hoursRemaining: number): string;
    /**
     * Get urgency color for UI
     */
    static getUrgencyColor(urgencyLevel: string): string;
    /**
     * Get first Monday of a month
     */
    static getFirstMondayOfMonth(date: Dayjs): Dayjs;
    /**
     * Get first Sunday of a month
     */
    static getFirstSundayOfMonth(date: Dayjs): Dayjs;
    /**
     * Generate working days within date range excluding weekends and weekly offs
     */
    static generateWorkingDates(startDate: string | Dayjs, endDate: string | Dayjs, weeklyOffs?: string[]): IWorkingDate[];
    /**
     * Validate booking period against current date and lock dates
     */
    static validateBookingPeriod(bookingPeriod: string): IValidationResult;
    /**
     * Get current week details
     */
    static getCurrentWeekInfo(): IWeekInfo;
    /**
     * Get current month details
     */
    static getCurrentMonthInfo(): IMonthInfo;
    /**
     * Check if a date falls within business hours for transport
     */
    static checkTransportHours(date: string | Dayjs, site?: string): ITransportHoursResult;
    /**
     * Format date for different display purposes
     */
    static formatDate(date: string | Dayjs, format?: string): string;
    /**
     * Get relative time description
     */
    static getRelativeTime(date: string | Dayjs): string;
    /**
     * Check if date is a weekend
     */
    static isWeekend(date: string | Dayjs): boolean;
    /**
     * Get business days between two dates
     */
    static getBusinessDaysBetween(startDate: string | Dayjs, endDate: string | Dayjs): number;
    /**
     * Add business days to a date (excluding weekends)
     */
    static addBusinessDays(date: string | Dayjs, days: number): Dayjs;
}
/**
 * Export individual utility functions for convenience
 */
export declare const calculateBookingDates: typeof DateCalculationHelper.calculateBookingDates;
export declare const generateWorkingDates: typeof DateCalculationHelper.generateWorkingDates;
export declare const validateBookingPeriod: typeof DateCalculationHelper.validateBookingPeriod;
export declare const formatDate: typeof DateCalculationHelper.formatDate;
export declare const getRelativeTime: typeof DateCalculationHelper.getRelativeTime;
export declare const getCurrentWeekInfo: typeof DateCalculationHelper.getCurrentWeekInfo;
export declare const getCurrentMonthInfo: typeof DateCalculationHelper.getCurrentMonthInfo;
export declare const checkTransportHours: typeof DateCalculationHelper.checkTransportHours;
export declare const isWeekend: typeof DateCalculationHelper.isWeekend;
export declare const getBusinessDaysBetween: typeof DateCalculationHelper.getBusinessDaysBetween;
export declare const addBusinessDays: typeof DateCalculationHelper.addBusinessDays;
/**
 * Export types for use in components
 */
export type { IBookingDates, IValidationResult, IWorkingDate, IWeekInfo, IMonthInfo, ITransportHoursResult };
/**
 * Export default class
 */
export default DateCalculationHelper;
