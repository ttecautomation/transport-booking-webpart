/**
 * Application Constants
 * Central place for all application constants and enums
 * Dependencies: None (base constants)
 */
// Site configuration
export const SITES = {
    AHMEDABAD: {
        code: 'ahmedabad',
        label: 'Ahmedabad',
        siteId: 11,
        locationCode: 'AMD',
        complementaryHours: { start: 21, end: 6 },
        timezone: 'Asia/Kolkata'
    },
    MOHALI: {
        code: 'mohali',
        label: 'Mohali',
        siteId: 14,
        locationCode: 'MHL',
        complementaryHours: { start: 19, end: 7 },
        timezone: 'Asia/Kolkata'
    }
};
// Booking periods configuration
export const BOOKING_PERIODS = {
    CURRENT_MONTH: {
        code: 'current_month',
        label: 'Current Month',
        weeklyOffsRequired: 2,
        maxWeeklyOffs: 2,
        description: 'Book transport for current month'
    },
    UPCOMING_MONTH: {
        code: 'upcoming_month',
        label: 'Upcoming Month',
        weeklyOffsRequired: 2,
        maxWeeklyOffs: 2,
        description: 'Book transport for the entire next month'
    },
    CURRENT_WEEK: {
        code: 'current_week',
        label: 'Current Week',
        weeklyOffsRequired: 0,
        maxWeeklyOffs: 6,
        description: 'Book transport for current week'
    },
    UPCOMING_WEEK: {
        code: 'upcoming_week',
        label: 'Upcoming Week',
        weeklyOffsRequired: 0,
        maxWeeklyOffs: 6,
        description: 'Book transport for the next working week'
    }
};
// Transport preferences
export const TRANSPORT_PREFERENCES = {
    PICKUP: { type: 1, code: 'pickup', label: 'Pickup Only' },
    DROPOFF: { type: 2, code: 'dropoff', label: 'Drop Off Only' },
    BOTH: { type: 3, code: 'both', label: 'Both Pickup & Drop Off' }
};
// Week days
export const WEEK_DAYS = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday', 'Sunday'
];
// Approval status
export const APPROVAL_STATUS = {
    PENDING: { code: 0, label: 'Pending', color: 'warning' },
    APPROVED: { code: 1, label: 'Approved', color: 'success' },
    REJECTED: { code: 2, label: 'Rejected', color: 'error' }
};
// Validation rules
export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\d{10}$/,
    REQUIRED_FIELDS: [
        'site', 'bookingPeriod', 'shiftTiming', 'transportPreference',
        'weeklyOffs', 'email', 'contactNumber', 'agreementAccepted'
    ]
};
// API endpoints
export const API_ENDPOINTS = {
    EMPLOYEE: '/employee',
    SHIFTS: '/shifts',
    STATIONS: '/stations',
    BOOKING_DATES: '/booking-dates',
    PREFERENCES: '/preferences',
    PREFERENCES_HISTORY: '/preferences/history',
    BOOKING_SUBMIT: '/booking/submit',
    HEALTH: '/health'
};
// Form sections
export const FORM_SECTIONS = {
    BASIC_INFO: 'basic-info',
    SHIFT_SCHEDULE: 'shift-schedule',
    TRANSPORT_PREF: 'transport-pref',
    SCHEDULE_STATIONS: 'schedule-stations',
    CONTACT_AGREEMENT: 'contact-agreement',
    USER_DETAILS: 'user-details'
};
// UI Constants
export const UI_CONSTANTS = {
    STEP_NAMES: [
        'Basic Information',
        'Shift & Schedule',
        'Transport Preferences',
        'Pickup & Drop Stations',
        'Contact & Agreement'
    ],
    WEEK_DAY_COLORS: [
        { name: 'Monday', short: 'Mon', color: '#FF6B6B' },
        { name: 'Tuesday', short: 'Tue', color: '#4ECDC4' },
        { name: 'Wednesday', short: 'Wed', color: '#45B7D1' },
        { name: 'Thursday', short: 'Thu', color: '#96CEB4' },
        { name: 'Friday', short: 'Fri', color: '#FFEAA7' },
        { name: 'Saturday', short: 'Sat', color: '#DDA0DD' },
        { name: 'Sunday', short: 'Sun', color: '#98D8C8' }
    ],
    AVATAR_GRADIENTS: [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ]
};
// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    SERVER_ERROR: 'Server error. Please try again later.',
    UNAUTHORIZED: 'Unauthorized access. Please check your credentials.',
    FORBIDDEN: 'Access forbidden. Please contact administrator.',
    NOT_FOUND: 'Resource not found. Please check the URL.',
    VALIDATION_ERROR: 'Validation failed. Please check your input.',
    TIMEOUT_ERROR: 'Request timeout. Please check your connection.',
    BOOKING_CONFLICT: 'Booking conflict detected. The selected period may be locked.',
    EMPLOYEE_NOT_FOUND: 'Employee information not found. Please contact support.',
    SHIFTS_LOAD_ERROR: 'Failed to load shift timings. Please try again.',
    STATIONS_LOAD_ERROR: 'Failed to load station list. Please try again.',
    DATES_CALCULATION_ERROR: 'Failed to calculate booking dates.',
    BOOKING_SUBMIT_ERROR: 'Failed to submit booking request. Please try again.'
};
// Success messages
export const SUCCESS_MESSAGES = {
    BOOKING_SUBMITTED: 'Transport booking submitted successfully! Check your email for confirmation.',
    DATA_LOADED: 'Data loaded successfully.',
    FORM_RESET: 'Form has been reset successfully.'
};
// SharePoint specific constants
export const SHAREPOINT_CONSTANTS = {
    TRANSPORT_POLICY_URL: 'https://teletechinc.sharepoint.com/:b:/s/OnlineTools/MealTransport/EX7jvv43-FlPi8MXYXBZva8Bcu2lqLvZF-4kXxznwNuDnA?e=xHOqHI',
    DEFAULT_TIMEOUT: 30000,
    MAX_RETRY_ATTEMPTS: 3,
    NOTIFICATION_DURATION: 4000,
    DEFAULT_PAGE_SIZE: 10
};
// Station distance slabs
export const DISTANCE_SLABS = {
    SLAB_1: '0 km - 5 km',
    SLAB_2: '6 km - 10 km',
    SLAB_3: '11 km - 20 km',
    SLAB_4: '21 km - 30 km',
    SLAB_5: 'Above 30 km'
};
// Helper functions for working with constants
export const getSiteByCode = (code) => {
    return Object.values(SITES).find(site => site.code === code);
};
export const getTransportPreferenceByCode = (code) => {
    return Object.values(TRANSPORT_PREFERENCES).find(pref => pref.code === code);
};
export const getBookingPeriodByCode = (code) => {
    return Object.values(BOOKING_PERIODS).find(period => period.code === code);
};
export const getWeekDayColor = (dayName) => {
    return UI_CONSTANTS.WEEK_DAY_COLORS.find(day => day.name === dayName)?.color || '#666';
};
export const getAvatarGradient = (name) => {
    if (!name)
        return UI_CONSTANTS.AVATAR_GRADIENTS[0];
    const hash = name.split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0);
        return a & a;
    }, 0);
    return UI_CONSTANTS.AVATAR_GRADIENTS[Math.abs(hash) % UI_CONSTANTS.AVATAR_GRADIENTS.length];
};
export const getInitials = (name) => {
    if (!name)
        return 'JD';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
// Export default for convenience
export default {
    SITES,
    BOOKING_PERIODS,
    TRANSPORT_PREFERENCES,
    WEEK_DAYS,
    APPROVAL_STATUS,
    VALIDATION_RULES,
    API_ENDPOINTS,
    FORM_SECTIONS,
    UI_CONSTANTS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    SHAREPOINT_CONSTANTS,
    DISTANCE_SLABS
};
//# sourceMappingURL=index.js.map