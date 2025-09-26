/**
 * Date Calculation Utilities
 * Implements PowerApps date logic for transport booking system
 * Dependencies: dayjs library, constants (optional)
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
/**
 * Date Calculation Helper Class
 * Implements exact PowerApps logic for booking periods
 */
export class DateCalculationHelper {
    /**
     * Check if a booking period should be available
     */
    static isPeriodAvailable(bookingPeriod) {
        const now = dayjs();
        // Current Week is only available until its exception deadline
        if (bookingPeriod === 'current_week') {
            const deadline = dayjs(this.EXCEPTION_CONFIG.currentWeek.overrideLockDate);
            return now.isBefore(deadline);
        }
        // All other periods are always available
        return true;
    }
    /**
     * Get available booking periods
     */
    static getAvailableBookingPeriods() {
        const allPeriods = ['current_month', 'upcoming_month', 'current_week', 'upcoming_week'];
        return allPeriods.filter(period => this.isPeriodAvailable(period));
    }
    /**
     * Check if exception is still active
     */
    static isExceptionActive(bookingPeriod) {
        if (!this.EXCEPTION_CONFIG.enabled)
            return false;
        const now = dayjs();
        if (bookingPeriod === 'current_month') {
            return now.isBefore(dayjs(this.EXCEPTION_CONFIG.currentMonth.expiryDate));
        }
        if (bookingPeriod === 'current_week') {
            return now.isBefore(dayjs(this.EXCEPTION_CONFIG.currentWeek.expiryDate));
        }
        return false;
    }
    /**
     * Calculate booking dates using PowerApps logic
     */
    static calculateBookingDates(bookingPeriod) {
        const today = dayjs();
        let startDate, endDate, lockDate;
        let isException = false;
        let originalLockDate = null;
        switch (bookingPeriod) {
            case 'current_month': {
                // Start Date: First Monday of current month
                const currentMonth = today.startOf('month');
                startDate = this.getFirstMondayOfMonth(currentMonth);
                // End Date: First Sunday of next month
                const nextMonth = today.add(1, 'month').startOf('month');
                endDate = this.getFirstSundayOfMonth(nextMonth);
                // Original Lock Date calculation
                originalLockDate = startDate.subtract(2, 'day');
                // Check for exception
                if (this.isExceptionActive('current_month')) {
                    lockDate = dayjs(this.EXCEPTION_CONFIG.currentMonth.overrideLockDate);
                    isException = true;
                }
                else {
                    lockDate = originalLockDate;
                }
                break;
            }
            case 'upcoming_month': {
                // No exception for upcoming month - normal logic
                startDate = today.add(1, 'month').startOf('month');
                const monthAfterNext = today.add(2, 'month').startOf('month');
                endDate = this.getFirstSundayOfMonth(monthAfterNext);
                const nextMonth = today.add(1, 'month').startOf('month');
                const firstMondayNextMonth = this.getFirstMondayOfMonth(nextMonth);
                lockDate = firstMondayNextMonth.subtract(2, 'day');
                break;
            }
            case 'current_week': {
                // Start Date: Monday of current week
                startDate = today.startOf('week').add(1, 'day');
                // End Date: Sunday of current week
                endDate = today.endOf('week');
                // Original Lock Date calculation
                const yesterday = today.subtract(1, 'day');
                const lastSunday = yesterday.startOf('week');
                originalLockDate = lastSunday.hour(18).minute(0).second(0);
                // Check for exception
                if (this.isExceptionActive('current_week')) {
                    lockDate = dayjs(this.EXCEPTION_CONFIG.currentWeek.overrideLockDate);
                    isException = true;
                }
                else {
                    lockDate = originalLockDate;
                }
                break;
            }
            case 'upcoming_week': {
                // No exception for upcoming week - normal logic
                startDate = today.add(1, 'week').startOf('week').add(1, 'day');
                endDate = startDate.add(6, 'day');
                lockDate = startDate.subtract(1, 'day').hour(18).minute(0).second(0);
                break;
            }
            default:
                throw new Error(`Invalid booking period: ${bookingPeriod}`);
        }
        const isLocked = dayjs().isAfter(lockDate);
        const hoursUntilLock = lockDate.diff(dayjs(), 'hour');
        const minutesUntilLock = lockDate.diff(dayjs(), 'minute') % 60;
        return {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            lockDate: lockDate.toISOString(),
            lockDateFormatted: lockDate.format('MMM DD, YYYY [at] h:mm A'),
            // Additional computed properties
            isLocked,
            isOpen: !isLocked,
            bookingStatus: isLocked ? 'CLOSED' : 'OPEN',
            statusColor: isLocked ? '#f44336' : '#4CAF50',
            statusIcon: isLocked ? 'LOCKED' : 'OPEN',
            // Exception information
            isException,
            originalLockDate: originalLockDate ? originalLockDate.format('MMM DD, YYYY [at] h:mm A') : undefined,
            exceptionNote: isException ? 'Extended deadline (one-time exception)' : undefined,
            // Time remaining
            daysUntilLock: lockDate.diff(dayjs(), 'day'),
            hoursUntilLock,
            minutesUntilLock,
            timeRemainingText: this.getTimeRemainingText(lockDate),
            urgencyLevel: this.getUrgencyLevel(hoursUntilLock),
            // Other properties
            daysUntilStart: startDate.diff(dayjs(), 'day'),
            totalDays: endDate.diff(startDate, 'day') + 1,
            // Raw dayjs objects
            _startDate: startDate,
            _endDate: endDate,
            _lockDate: lockDate
        };
    }
    /**
     * Get formatted time remaining text
     */
    static getTimeRemainingText(lockDate) {
        const now = dayjs();
        const diffMs = lockDate.diff(now);
        if (diffMs <= 0)
            return 'Booking Closed';
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}, ${hours}h remaining`;
        }
        else if (hours > 0) {
            return `${hours}h ${minutes}m remaining`;
        }
        else {
            return `${minutes} minutes remaining`;
        }
    }
    /**
     * Get urgency level based on hours remaining
     */
    static getUrgencyLevel(hoursRemaining) {
        if (hoursRemaining <= 0)
            return 'closed';
        if (hoursRemaining <= 6)
            return 'critical'; // Red
        if (hoursRemaining <= 24)
            return 'urgent'; // Orange
        if (hoursRemaining <= 72)
            return 'warning'; // Yellow
        return 'normal'; // Green
    }
    /**
     * Get urgency color for UI
     */
    static getUrgencyColor(urgencyLevel) {
        const colors = {
            closed: '#f44336',
            critical: '#d32f2f',
            urgent: '#ff9800',
            warning: '#ffc107',
            normal: '#4caf50' // Green
        };
        return colors[urgencyLevel] || colors.normal;
    }
    /**
     * Get first Monday of a month
     */
    static getFirstMondayOfMonth(date) {
        const firstDayOfMonth = date.startOf('month');
        const dayOfWeek = firstDayOfMonth.day();
        if (dayOfWeek === 1) {
            return firstDayOfMonth;
        }
        else if (dayOfWeek === 0) {
            return firstDayOfMonth.add(1, 'day');
        }
        else {
            const daysToMonday = 8 - dayOfWeek;
            return firstDayOfMonth.add(daysToMonday, 'day');
        }
    }
    /**
     * Get first Sunday of a month
     */
    static getFirstSundayOfMonth(date) {
        const firstDayOfMonth = date.startOf('month');
        const dayOfWeek = firstDayOfMonth.day();
        if (dayOfWeek === 0) {
            return firstDayOfMonth;
        }
        else {
            const daysToSunday = 7 - dayOfWeek;
            return firstDayOfMonth.add(daysToSunday, 'day');
        }
    }
    /**
     * Generate working days within date range excluding weekends and weekly offs
     */
    static generateWorkingDates(startDate, endDate, weeklyOffs = []) {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const dates = [];
        let currentDate = start;
        while (currentDate.isSameOrBefore(end)) {
            const dayName = currentDate.format('dddd'); // Full day name
            // Skip weekends (Saturday=6, Sunday=0)
            const dayOfWeek = currentDate.day();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            // Skip weekly offs
            const isWeeklyOff = weeklyOffs.includes(dayName);
            if (!isWeekend && !isWeeklyOff) {
                dates.push({
                    date: currentDate.format('YYYY-MM-DD'),
                    dayName: dayName,
                    dayShort: currentDate.format('ddd'),
                    formatted: currentDate.format('MMM DD, YYYY'),
                    dayjs: currentDate.clone()
                });
            }
            currentDate = currentDate.add(1, 'day');
        }
        return dates;
    }
    /**
     * Validate booking period against current date and lock dates
     */
    static validateBookingPeriod(bookingPeriod) {
        try {
            const dates = this.calculateBookingDates(bookingPeriod);
            return {
                isValid: true,
                isOpen: dates.isOpen,
                canSubmit: !dates.isLocked,
                bookingStatus: dates.bookingStatus,
                statusColor: dates.statusColor,
                statusIcon: dates.statusIcon,
                timeRemaining: dates.timeRemainingText,
                urgencyLevel: dates.urgencyLevel,
                urgencyColor: this.getUrgencyColor(dates.urgencyLevel),
                daysRemaining: dates.daysUntilLock,
                hoursRemaining: dates.hoursUntilLock,
                message: dates.isLocked
                    ? 'Booking period is closed'
                    : `${dates.timeRemainingText}`,
                isException: dates.isException,
                exceptionNote: dates.exceptionNote,
                dates
            };
        }
        catch (error) {
            return {
                isValid: false,
                isOpen: false,
                canSubmit: false,
                bookingStatus: 'ERROR',
                statusColor: '#9e9e9e',
                statusIcon: 'ERROR',
                timeRemaining: 'N/A',
                urgencyLevel: 'closed',
                urgencyColor: '#9e9e9e',
                daysRemaining: 0,
                hoursRemaining: 0,
                message: error.message,
                isException: false,
                dates: null
            };
        }
    }
    /**
     * Get current week details
     */
    static getCurrentWeekInfo() {
        const today = dayjs();
        const startOfWeek = today.startOf('week').add(1, 'day'); // Monday
        const endOfWeek = today.endOf('week').subtract(1, 'day'); // Friday
        return {
            weekNumber: today.week(),
            year: today.year(),
            startDate: startOfWeek.format('YYYY-MM-DD'),
            endDate: endOfWeek.format('YYYY-MM-DD'),
            currentDay: today.format('dddd'),
            daysInWeek: Array.from({ length: 5 }, (_, i) => {
                const date = startOfWeek.add(i, 'day');
                return {
                    date: date.format('YYYY-MM-DD'),
                    dayName: date.format('dddd'),
                    isToday: date.isSame(today, 'day')
                };
            })
        };
    }
    /**
     * Get current month details
     */
    static getCurrentMonthInfo() {
        const today = dayjs();
        const startOfMonth = today.startOf('month');
        const endOfMonth = today.endOf('month');
        return {
            month: today.month() + 1,
            year: today.year(),
            monthName: today.format('MMMM'),
            startDate: startOfMonth.format('YYYY-MM-DD'),
            endDate: endOfMonth.format('YYYY-MM-DD'),
            daysInMonth: endOfMonth.date(),
            currentDate: today.date()
        };
    }
    /**
     * Check if a date falls within business hours for transport
     */
    static checkTransportHours(date, site = 'AMD') {
        const checkDate = dayjs(date);
        const hour = checkDate.hour();
        // Define complementary hours by site
        const complementaryHours = {
            AMD: {
                start: 21,
                end: 6
            },
            MHL: {
                start: 19,
                end: 7
            }
        };
        const siteHours = complementaryHours[site.toUpperCase()] || complementaryHours.AMD;
        // Check if hour falls within complementary range
        const isComplementary = hour >= siteHours.start || hour <= siteHours.end;
        return {
            site: site.toUpperCase(),
            hour,
            isComplementary,
            isChargeable: !isComplementary,
            period: isComplementary ? 'Complementary' : 'Chargeable',
            timeRange: `${siteHours.start}:00 - ${siteHours.end}:00`
        };
    }
    /**
     * Format date for different display purposes
     */
    static formatDate(date, format = 'display') {
        const dateObj = dayjs(date);
        const formats = {
            display: 'MMM DD, YYYY',
            short: 'MM/DD/YYYY',
            long: 'dddd, MMMM DD, YYYY',
            time: 'h:mm A',
            datetime: 'MMM DD, YYYY [at] h:mm A',
            iso: 'YYYY-MM-DD',
            api: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'
        };
        return dateObj.format(formats[format] || format);
    }
    /**
     * Get relative time description
     */
    static getRelativeTime(date) {
        const targetDate = dayjs(date);
        const now = dayjs();
        const diffDays = targetDate.diff(now, 'day');
        if (diffDays === 0)
            return 'Today';
        if (diffDays === 1)
            return 'Tomorrow';
        if (diffDays === -1)
            return 'Yesterday';
        if (diffDays > 0)
            return `In ${diffDays} days`;
        if (diffDays < 0)
            return `${Math.abs(diffDays)} days ago`;
        return targetDate.format('MMM DD, YYYY');
    }
    /**
     * Check if date is a weekend
     */
    static isWeekend(date) {
        const dayOfWeek = dayjs(date).day();
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    }
    /**
     * Get business days between two dates
     */
    static getBusinessDaysBetween(startDate, endDate) {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        let businessDays = 0;
        let currentDate = start;
        while (currentDate.isSameOrBefore(end)) {
            if (!this.isWeekend(currentDate)) {
                businessDays++;
            }
            currentDate = currentDate.add(1, 'day');
        }
        return businessDays;
    }
    /**
     * Add business days to a date (excluding weekends)
     */
    static addBusinessDays(date, days) {
        let currentDate = dayjs(date);
        let remainingDays = days;
        while (remainingDays > 0) {
            currentDate = currentDate.add(1, 'day');
            if (!this.isWeekend(currentDate)) {
                remainingDays--;
            }
        }
        return currentDate;
    }
}
/**
 * ONE-TIME EXCEPTION CONFIGURATION
 * These will override normal lock dates until the specified dates pass
 */
DateCalculationHelper.EXCEPTION_CONFIG = {
    enabled: true,
    currentMonth: {
        overrideLockDate: '2025-09-07T23:59:59',
        expiryDate: '2025-09-08T00:00:00'
    },
    currentWeek: {
        overrideLockDate: '2025-09-04T18:00:00',
        expiryDate: '2025-09-05T00:00:00',
        isOneTimeOnly: true // Flag indicating this is not a regular period
    }
};
/**
 * Export individual utility functions for convenience
 */
export const calculateBookingDates = DateCalculationHelper.calculateBookingDates.bind(DateCalculationHelper);
export const generateWorkingDates = DateCalculationHelper.generateWorkingDates.bind(DateCalculationHelper);
export const validateBookingPeriod = DateCalculationHelper.validateBookingPeriod.bind(DateCalculationHelper);
export const formatDate = DateCalculationHelper.formatDate.bind(DateCalculationHelper);
export const getRelativeTime = DateCalculationHelper.getRelativeTime.bind(DateCalculationHelper);
export const getCurrentWeekInfo = DateCalculationHelper.getCurrentWeekInfo.bind(DateCalculationHelper);
export const getCurrentMonthInfo = DateCalculationHelper.getCurrentMonthInfo.bind(DateCalculationHelper);
export const checkTransportHours = DateCalculationHelper.checkTransportHours.bind(DateCalculationHelper);
export const isWeekend = DateCalculationHelper.isWeekend.bind(DateCalculationHelper);
export const getBusinessDaysBetween = DateCalculationHelper.getBusinessDaysBetween.bind(DateCalculationHelper);
export const addBusinessDays = DateCalculationHelper.addBusinessDays.bind(DateCalculationHelper);
/**
 * Export default class
 */
export default DateCalculationHelper;
//# sourceMappingURL=dateCalculation.js.map