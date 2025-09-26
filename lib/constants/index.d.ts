/**
 * Application Constants
 * Central place for all application constants and enums
 * Dependencies: None (base constants)
 */
export declare const SITES: {
    readonly AHMEDABAD: {
        readonly code: "ahmedabad";
        readonly label: "Ahmedabad";
        readonly siteId: 11;
        readonly locationCode: "AMD";
        readonly complementaryHours: {
            readonly start: 21;
            readonly end: 6;
        };
        readonly timezone: "Asia/Kolkata";
    };
    readonly MOHALI: {
        readonly code: "mohali";
        readonly label: "Mohali";
        readonly siteId: 14;
        readonly locationCode: "MHL";
        readonly complementaryHours: {
            readonly start: 19;
            readonly end: 7;
        };
        readonly timezone: "Asia/Kolkata";
    };
};
export declare const BOOKING_PERIODS: {
    readonly CURRENT_MONTH: {
        readonly code: "current_month";
        readonly label: "Current Month";
        readonly weeklyOffsRequired: 2;
        readonly maxWeeklyOffs: 2;
        readonly description: "Book transport for current month";
    };
    readonly UPCOMING_MONTH: {
        readonly code: "upcoming_month";
        readonly label: "Upcoming Month";
        readonly weeklyOffsRequired: 2;
        readonly maxWeeklyOffs: 2;
        readonly description: "Book transport for the entire next month";
    };
    readonly CURRENT_WEEK: {
        readonly code: "current_week";
        readonly label: "Current Week";
        readonly weeklyOffsRequired: 0;
        readonly maxWeeklyOffs: 6;
        readonly description: "Book transport for current week";
    };
    readonly UPCOMING_WEEK: {
        readonly code: "upcoming_week";
        readonly label: "Upcoming Week";
        readonly weeklyOffsRequired: 0;
        readonly maxWeeklyOffs: 6;
        readonly description: "Book transport for the next working week";
    };
};
export declare const TRANSPORT_PREFERENCES: {
    readonly PICKUP: {
        readonly type: 1;
        readonly code: "pickup";
        readonly label: "Pickup Only";
    };
    readonly DROPOFF: {
        readonly type: 2;
        readonly code: "dropoff";
        readonly label: "Drop Off Only";
    };
    readonly BOTH: {
        readonly type: 3;
        readonly code: "both";
        readonly label: "Both Pickup & Drop Off";
    };
};
export declare const WEEK_DAYS: readonly ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export declare const APPROVAL_STATUS: {
    readonly PENDING: {
        readonly code: 0;
        readonly label: "Pending";
        readonly color: "warning";
    };
    readonly APPROVED: {
        readonly code: 1;
        readonly label: "Approved";
        readonly color: "success";
    };
    readonly REJECTED: {
        readonly code: 2;
        readonly label: "Rejected";
        readonly color: "error";
    };
};
export declare const VALIDATION_RULES: {
    readonly EMAIL: RegExp;
    readonly PHONE: RegExp;
    readonly REQUIRED_FIELDS: readonly ["site", "bookingPeriod", "shiftTiming", "transportPreference", "weeklyOffs", "email", "contactNumber", "agreementAccepted"];
};
export declare const API_ENDPOINTS: {
    readonly EMPLOYEE: "/employee";
    readonly SHIFTS: "/shifts";
    readonly STATIONS: "/stations";
    readonly BOOKING_DATES: "/booking-dates";
    readonly PREFERENCES: "/preferences";
    readonly PREFERENCES_HISTORY: "/preferences/history";
    readonly BOOKING_SUBMIT: "/booking/submit";
    readonly HEALTH: "/health";
};
export declare const FORM_SECTIONS: {
    readonly BASIC_INFO: "basic-info";
    readonly SHIFT_SCHEDULE: "shift-schedule";
    readonly TRANSPORT_PREF: "transport-pref";
    readonly SCHEDULE_STATIONS: "schedule-stations";
    readonly CONTACT_AGREEMENT: "contact-agreement";
    readonly USER_DETAILS: "user-details";
};
export declare const UI_CONSTANTS: {
    readonly STEP_NAMES: readonly ["Basic Information", "Shift & Schedule", "Transport Preferences", "Pickup & Drop Stations", "Contact & Agreement"];
    readonly WEEK_DAY_COLORS: readonly [{
        readonly name: "Monday";
        readonly short: "Mon";
        readonly color: "#FF6B6B";
    }, {
        readonly name: "Tuesday";
        readonly short: "Tue";
        readonly color: "#4ECDC4";
    }, {
        readonly name: "Wednesday";
        readonly short: "Wed";
        readonly color: "#45B7D1";
    }, {
        readonly name: "Thursday";
        readonly short: "Thu";
        readonly color: "#96CEB4";
    }, {
        readonly name: "Friday";
        readonly short: "Fri";
        readonly color: "#FFEAA7";
    }, {
        readonly name: "Saturday";
        readonly short: "Sat";
        readonly color: "#DDA0DD";
    }, {
        readonly name: "Sunday";
        readonly short: "Sun";
        readonly color: "#98D8C8";
    }];
    readonly AVATAR_GRADIENTS: readonly ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"];
};
export declare const ERROR_MESSAGES: {
    readonly NETWORK_ERROR: "Network error. Please check your internet connection.";
    readonly SERVER_ERROR: "Server error. Please try again later.";
    readonly UNAUTHORIZED: "Unauthorized access. Please check your credentials.";
    readonly FORBIDDEN: "Access forbidden. Please contact administrator.";
    readonly NOT_FOUND: "Resource not found. Please check the URL.";
    readonly VALIDATION_ERROR: "Validation failed. Please check your input.";
    readonly TIMEOUT_ERROR: "Request timeout. Please check your connection.";
    readonly BOOKING_CONFLICT: "Booking conflict detected. The selected period may be locked.";
    readonly EMPLOYEE_NOT_FOUND: "Employee information not found. Please contact support.";
    readonly SHIFTS_LOAD_ERROR: "Failed to load shift timings. Please try again.";
    readonly STATIONS_LOAD_ERROR: "Failed to load station list. Please try again.";
    readonly DATES_CALCULATION_ERROR: "Failed to calculate booking dates.";
    readonly BOOKING_SUBMIT_ERROR: "Failed to submit booking request. Please try again.";
};
export declare const SUCCESS_MESSAGES: {
    readonly BOOKING_SUBMITTED: "Transport booking submitted successfully! Check your email for confirmation.";
    readonly DATA_LOADED: "Data loaded successfully.";
    readonly FORM_RESET: "Form has been reset successfully.";
};
export declare const SHAREPOINT_CONSTANTS: {
    readonly TRANSPORT_POLICY_URL: "https://teletechinc.sharepoint.com/:b:/s/OnlineTools/MealTransport/EX7jvv43-FlPi8MXYXBZva8Bcu2lqLvZF-4kXxznwNuDnA?e=xHOqHI";
    readonly DEFAULT_TIMEOUT: 30000;
    readonly MAX_RETRY_ATTEMPTS: 3;
    readonly NOTIFICATION_DURATION: 4000;
    readonly DEFAULT_PAGE_SIZE: 10;
};
export declare const DISTANCE_SLABS: {
    readonly SLAB_1: "0 km - 5 km";
    readonly SLAB_2: "6 km - 10 km";
    readonly SLAB_3: "11 km - 20 km";
    readonly SLAB_4: "21 km - 30 km";
    readonly SLAB_5: "Above 30 km";
};
export declare type SiteCode = keyof typeof SITES;
export declare type BookingPeriodCode = keyof typeof BOOKING_PERIODS;
export declare type TransportPreferenceCode = keyof typeof TRANSPORT_PREFERENCES;
export declare type WeekDay = typeof WEEK_DAYS[number];
export declare type FormSection = typeof FORM_SECTIONS[keyof typeof FORM_SECTIONS];
export declare type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export declare const getSiteByCode: (code: string) => {
    readonly code: "ahmedabad";
    readonly label: "Ahmedabad";
    readonly siteId: 11;
    readonly locationCode: "AMD";
    readonly complementaryHours: {
        readonly start: 21;
        readonly end: 6;
    };
    readonly timezone: "Asia/Kolkata";
} | {
    readonly code: "mohali";
    readonly label: "Mohali";
    readonly siteId: 14;
    readonly locationCode: "MHL";
    readonly complementaryHours: {
        readonly start: 19;
        readonly end: 7;
    };
    readonly timezone: "Asia/Kolkata";
};
export declare const getTransportPreferenceByCode: (code: string) => {
    readonly type: 1;
    readonly code: "pickup";
    readonly label: "Pickup Only";
} | {
    readonly type: 2;
    readonly code: "dropoff";
    readonly label: "Drop Off Only";
} | {
    readonly type: 3;
    readonly code: "both";
    readonly label: "Both Pickup & Drop Off";
};
export declare const getBookingPeriodByCode: (code: string) => {
    readonly code: "current_month";
    readonly label: "Current Month";
    readonly weeklyOffsRequired: 2;
    readonly maxWeeklyOffs: 2;
    readonly description: "Book transport for current month";
} | {
    readonly code: "upcoming_month";
    readonly label: "Upcoming Month";
    readonly weeklyOffsRequired: 2;
    readonly maxWeeklyOffs: 2;
    readonly description: "Book transport for the entire next month";
} | {
    readonly code: "current_week";
    readonly label: "Current Week";
    readonly weeklyOffsRequired: 0;
    readonly maxWeeklyOffs: 6;
    readonly description: "Book transport for current week";
} | {
    readonly code: "upcoming_week";
    readonly label: "Upcoming Week";
    readonly weeklyOffsRequired: 0;
    readonly maxWeeklyOffs: 6;
    readonly description: "Book transport for the next working week";
};
export declare const getWeekDayColor: (dayName: string) => "#FF6B6B" | "#4ECDC4" | "#45B7D1" | "#96CEB4" | "#FFEAA7" | "#DDA0DD" | "#98D8C8" | "#666";
export declare const getAvatarGradient: (name: string) => string;
export declare const getInitials: (name: string) => string;
declare const _default: {
    SITES: {
        readonly AHMEDABAD: {
            readonly code: "ahmedabad";
            readonly label: "Ahmedabad";
            readonly siteId: 11;
            readonly locationCode: "AMD";
            readonly complementaryHours: {
                readonly start: 21;
                readonly end: 6;
            };
            readonly timezone: "Asia/Kolkata";
        };
        readonly MOHALI: {
            readonly code: "mohali";
            readonly label: "Mohali";
            readonly siteId: 14;
            readonly locationCode: "MHL";
            readonly complementaryHours: {
                readonly start: 19;
                readonly end: 7;
            };
            readonly timezone: "Asia/Kolkata";
        };
    };
    BOOKING_PERIODS: {
        readonly CURRENT_MONTH: {
            readonly code: "current_month";
            readonly label: "Current Month";
            readonly weeklyOffsRequired: 2;
            readonly maxWeeklyOffs: 2;
            readonly description: "Book transport for current month";
        };
        readonly UPCOMING_MONTH: {
            readonly code: "upcoming_month";
            readonly label: "Upcoming Month";
            readonly weeklyOffsRequired: 2;
            readonly maxWeeklyOffs: 2;
            readonly description: "Book transport for the entire next month";
        };
        readonly CURRENT_WEEK: {
            readonly code: "current_week";
            readonly label: "Current Week";
            readonly weeklyOffsRequired: 0;
            readonly maxWeeklyOffs: 6;
            readonly description: "Book transport for current week";
        };
        readonly UPCOMING_WEEK: {
            readonly code: "upcoming_week";
            readonly label: "Upcoming Week";
            readonly weeklyOffsRequired: 0;
            readonly maxWeeklyOffs: 6;
            readonly description: "Book transport for the next working week";
        };
    };
    TRANSPORT_PREFERENCES: {
        readonly PICKUP: {
            readonly type: 1;
            readonly code: "pickup";
            readonly label: "Pickup Only";
        };
        readonly DROPOFF: {
            readonly type: 2;
            readonly code: "dropoff";
            readonly label: "Drop Off Only";
        };
        readonly BOTH: {
            readonly type: 3;
            readonly code: "both";
            readonly label: "Both Pickup & Drop Off";
        };
    };
    WEEK_DAYS: readonly ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    APPROVAL_STATUS: {
        readonly PENDING: {
            readonly code: 0;
            readonly label: "Pending";
            readonly color: "warning";
        };
        readonly APPROVED: {
            readonly code: 1;
            readonly label: "Approved";
            readonly color: "success";
        };
        readonly REJECTED: {
            readonly code: 2;
            readonly label: "Rejected";
            readonly color: "error";
        };
    };
    VALIDATION_RULES: {
        readonly EMAIL: RegExp;
        readonly PHONE: RegExp;
        readonly REQUIRED_FIELDS: readonly ["site", "bookingPeriod", "shiftTiming", "transportPreference", "weeklyOffs", "email", "contactNumber", "agreementAccepted"];
    };
    API_ENDPOINTS: {
        readonly EMPLOYEE: "/employee";
        readonly SHIFTS: "/shifts";
        readonly STATIONS: "/stations";
        readonly BOOKING_DATES: "/booking-dates";
        readonly PREFERENCES: "/preferences";
        readonly PREFERENCES_HISTORY: "/preferences/history";
        readonly BOOKING_SUBMIT: "/booking/submit";
        readonly HEALTH: "/health";
    };
    FORM_SECTIONS: {
        readonly BASIC_INFO: "basic-info";
        readonly SHIFT_SCHEDULE: "shift-schedule";
        readonly TRANSPORT_PREF: "transport-pref";
        readonly SCHEDULE_STATIONS: "schedule-stations";
        readonly CONTACT_AGREEMENT: "contact-agreement";
        readonly USER_DETAILS: "user-details";
    };
    UI_CONSTANTS: {
        readonly STEP_NAMES: readonly ["Basic Information", "Shift & Schedule", "Transport Preferences", "Pickup & Drop Stations", "Contact & Agreement"];
        readonly WEEK_DAY_COLORS: readonly [{
            readonly name: "Monday";
            readonly short: "Mon";
            readonly color: "#FF6B6B";
        }, {
            readonly name: "Tuesday";
            readonly short: "Tue";
            readonly color: "#4ECDC4";
        }, {
            readonly name: "Wednesday";
            readonly short: "Wed";
            readonly color: "#45B7D1";
        }, {
            readonly name: "Thursday";
            readonly short: "Thu";
            readonly color: "#96CEB4";
        }, {
            readonly name: "Friday";
            readonly short: "Fri";
            readonly color: "#FFEAA7";
        }, {
            readonly name: "Saturday";
            readonly short: "Sat";
            readonly color: "#DDA0DD";
        }, {
            readonly name: "Sunday";
            readonly short: "Sun";
            readonly color: "#98D8C8";
        }];
        readonly AVATAR_GRADIENTS: readonly ["linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"];
    };
    ERROR_MESSAGES: {
        readonly NETWORK_ERROR: "Network error. Please check your internet connection.";
        readonly SERVER_ERROR: "Server error. Please try again later.";
        readonly UNAUTHORIZED: "Unauthorized access. Please check your credentials.";
        readonly FORBIDDEN: "Access forbidden. Please contact administrator.";
        readonly NOT_FOUND: "Resource not found. Please check the URL.";
        readonly VALIDATION_ERROR: "Validation failed. Please check your input.";
        readonly TIMEOUT_ERROR: "Request timeout. Please check your connection.";
        readonly BOOKING_CONFLICT: "Booking conflict detected. The selected period may be locked.";
        readonly EMPLOYEE_NOT_FOUND: "Employee information not found. Please contact support.";
        readonly SHIFTS_LOAD_ERROR: "Failed to load shift timings. Please try again.";
        readonly STATIONS_LOAD_ERROR: "Failed to load station list. Please try again.";
        readonly DATES_CALCULATION_ERROR: "Failed to calculate booking dates.";
        readonly BOOKING_SUBMIT_ERROR: "Failed to submit booking request. Please try again.";
    };
    SUCCESS_MESSAGES: {
        readonly BOOKING_SUBMITTED: "Transport booking submitted successfully! Check your email for confirmation.";
        readonly DATA_LOADED: "Data loaded successfully.";
        readonly FORM_RESET: "Form has been reset successfully.";
    };
    SHAREPOINT_CONSTANTS: {
        readonly TRANSPORT_POLICY_URL: "https://teletechinc.sharepoint.com/:b:/s/OnlineTools/MealTransport/EX7jvv43-FlPi8MXYXBZva8Bcu2lqLvZF-4kXxznwNuDnA?e=xHOqHI";
        readonly DEFAULT_TIMEOUT: 30000;
        readonly MAX_RETRY_ATTEMPTS: 3;
        readonly NOTIFICATION_DURATION: 4000;
        readonly DEFAULT_PAGE_SIZE: 10;
    };
    DISTANCE_SLABS: {
        readonly SLAB_1: "0 km - 5 km";
        readonly SLAB_2: "6 km - 10 km";
        readonly SLAB_3: "11 km - 20 km";
        readonly SLAB_4: "21 km - 30 km";
        readonly SLAB_5: "Above 30 km";
    };
};
export default _default;
