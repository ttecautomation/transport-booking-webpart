/**
 * Main Transport Booking Form Component - COMPLETE FIXED VERSION
 * Full SPFx-compatible version with critical API fixes applied
 * Dependencies: React, Material-UI, all services, utils, and interfaces
 */
import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, Box, Card, CardContent, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Button, Alert, Checkbox, FormControlLabel, RadioGroup, Radio, FormLabel, CircularProgress, AppBar, Toolbar, Grid, Chip, Paper, Accordion, AccordionSummary, AccordionDetails, LinearProgress, Stepper, Step, StepLabel, Autocomplete, Collapse, Avatar, Divider, } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, LocationOn as LocationIcon, Schedule as ScheduleIcon, DirectionsBus as BusIcon, Person as PersonIcon, Email as EmailIcon, Phone as PhoneIcon, Refresh as RefreshIcon, BugReport as BugReportIcon, } from '@mui/icons-material';
import transportService from '../../services/transportService';
import DateCalculationHelper from '../../utils/dateCalculation';
import SPFXHelper from '../../utils/spfxHelpers';
import { createAppTheme } from '../../themes/muiTheme';
import { useFormSubmission } from '../../hooks/useApi';
import { SITES, TRANSPORT_PREFERENCES, UI_CONSTANTS, FORM_SECTIONS, getInitials, getAvatarGradient, } from '../../constants/index';
import { logger } from '../../config/environment';
/**
 * API Debug Panel Component (for troubleshooting)
 */
const ApiDebugPanel = ({ userEmail, context, enableDebugMode }) => {
    const [debugData, setDebugData] = useState(null);
    const [isDebugging, setIsDebugging] = useState(false);
    if (!enableDebugMode)
        return null;
    const testApiCall = async () => {
        setIsDebugging(true);
        const testEmail = userEmail || 'mohammedrizwan.memon@ttec.com';
        try {
            logger.log('🔧 DEBUG: Direct API test starting...');
            const startTime = Date.now();
            const result = await transportService.getEmployeeByEmail(testEmail, context);
            const endTime = Date.now();
            setDebugData({
                success: true,
                email: testEmail,
                duration: endTime - startTime,
                result,
                resultType: typeof result,
                isNull: result === null,
                hasKeys: result ? Object.keys(result).length : 0,
                timestamp: new Date().toISOString()
            });
            logger.log('🔧 DEBUG: API test completed successfully');
        }
        catch (error) {
            setDebugData({
                success: false,
                email: testEmail,
                error: error instanceof Error ? error.message : String(error),
                errorType: error instanceof Error ? error.constructor.name : typeof error,
                timestamp: new Date().toISOString()
            });
            logger.error('🔧 DEBUG: API test failed:', error);
        }
        finally {
            setIsDebugging(false);
        }
    };
    return (React.createElement(Card, { sx: { mb: 3, border: '2px solid #ff9800' } },
        React.createElement(CardContent, null,
            React.createElement(Box, { display: "flex", alignItems: "center", gap: 2, mb: 2 },
                React.createElement(BugReportIcon, { color: "warning" }),
                React.createElement(Typography, { variant: "h6", color: "warning.main" }, "API Debug Panel"),
                React.createElement(Chip, { label: "DEBUG MODE", color: "warning", size: "small" }),
                React.createElement(Button, { variant: "outlined", color: "warning", size: "small", onClick: testApiCall, disabled: isDebugging }, isDebugging ? 'Testing...' : 'Test API')),
            isDebugging && (React.createElement(Box, { mb: 2 },
                React.createElement(CircularProgress, { size: 20, color: "warning" }),
                React.createElement(Typography, { variant: "body2", sx: { ml: 1, display: 'inline' } }, "Testing API call..."))),
            debugData && (React.createElement(Box, null,
                React.createElement(Alert, { severity: debugData.success ? 'success' : 'error', sx: { mb: 2 } },
                    React.createElement(Typography, { variant: "body2" },
                        React.createElement("strong", null, "API Call Result:"),
                        " ",
                        debugData.success ? 'SUCCESS' : 'FAILED',
                        React.createElement("br", null),
                        React.createElement("strong", null, "Email:"),
                        " ",
                        debugData.email,
                        React.createElement("br", null),
                        React.createElement("strong", null, "Duration:"),
                        " ",
                        debugData.duration,
                        "ms",
                        debugData.success && (React.createElement(React.Fragment, null,
                            React.createElement("br", null),
                            React.createElement("strong", null, "Result Type:"),
                            " ",
                            debugData.resultType,
                            React.createElement("br", null),
                            React.createElement("strong", null, "Is Null:"),
                            " ",
                            debugData.isNull ? 'Yes' : 'No',
                            React.createElement("br", null),
                            React.createElement("strong", null, "Object Keys:"),
                            " ",
                            debugData.hasKeys)))),
                React.createElement(Box, { sx: { bgcolor: 'grey.100', p: 2, borderRadius: 1, maxHeight: 200, overflow: 'auto' } },
                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Raw API Response:"),
                    React.createElement("pre", { style: { fontSize: '12px', margin: '8px 0', whiteSpace: 'pre-wrap' } }, JSON.stringify(debugData.success ? debugData.result : debugData, null, 2))))),
            React.createElement(Alert, { severity: "info", sx: { mt: 2 } },
                React.createElement(Typography, { variant: "caption" }, "This debug panel shows exactly what your API returns vs what the service expects. Remove this before production deployment.")))));
};
/**
 * Main Transport Booking Form Component
 */
const TransportBookingForm = props => {
    var _a, _b, _c;
    const { context, isDarkTheme, environmentMessage, userDisplayName, userEmail, apiEndpoint, enableDebugMode, defaultSite, showUserInfo = true, } = props;
    // Create theme with dark mode support
    const theme = React.useMemo(() => createAppTheme(isDarkTheme ? 'dark' : 'light'), [isDarkTheme]);
    // Form state using the interface
    const [formData, setFormData] = useState({
        site: defaultSite || '',
        bookingPeriod: '',
        shiftTiming: '',
        weeklyOffs: [],
        transportPreference: '',
        pickupStation: '',
        dropOffStation: '',
        sameAsPickup: false,
        pickupLandmark: '',
        dropOffLandmark: '',
        email: '',
        contactNumber: '',
        agreementAccepted: false,
    });
    const [expandedKmGroups, setExpandedKmGroups] = useState({
        '0 km - 5 km': true,
        '6 km - 10 km': false,
        '11 km - 20 km': false,
        '21 km - 30 km': false,
        'Above 30 km': false,
    });
    // Component state
    const [currentUser, setCurrentUser] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [stations, setStations] = useState([]);
    const [calculatedDates, setCalculatedDates] = useState({
        startDate: null,
        endDate: null,
        lockDate: null,
        lockDateFormatted: null,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSection, setExpandedSection] = useState(FORM_SECTIONS.BASIC_INFO);
    const [currentStep, setCurrentStep] = useState(0);
    // Station selection state
    const [stationSearchPickup, setStationSearchPickup] = useState('');
    const [stationSearchDropoff, setStationSearchDropoff] = useState('');
    const [showPickupDropdown, setShowPickupDropdown] = useState(false);
    const [showDropoffDropdown, setShowDropoffDropdown] = useState(false);
    const [expandedGroups, setExpandedGroups] = useState({});
    // Booking periods and status
    const [bookingPeriods, setBookingPeriods] = useState([]);
    const [bookingStatus, setBookingStatus] = useState(null);
    // Form submission hook
    const { isSubmitting, isSuccess, submissionError, submitForm, resetSubmissionState } = useFormSubmission(context);
    // Sites configuration
    const sites = Object.values(SITES).map(site => ({
        value: site.code,
        label: site.label,
        siteId: site.siteId,
        locationCode: site.locationCode,
    }));
    // Transport preferences configuration
    const transportPreferences = Object.values(TRANSPORT_PREFERENCES).map(pref => ({
        value: pref.code,
        label: pref.label,
        type: pref.type,
        description: pref.label.replace(' Only', '').replace('Both ', 'Complete '),
    }));
    // Week days with colors
    const weekDays = UI_CONSTANTS.WEEK_DAY_COLORS;
    // Form steps
    const steps = UI_CONSTANTS.STEP_NAMES;
    // Helper functions
    const calculateBookingPeriods = useCallback(() => {
        const periods = [];
        const allPeriods = ['current_month', 'upcoming_month', 'current_week', 'upcoming_week'];
        allPeriods.forEach(periodType => {
            try {
                const calculatedDates = DateCalculationHelper.calculateBookingDates(periodType);
                const validation = DateCalculationHelper.validateBookingPeriod(periodType);
                const formatDateDisplay = (dateStr) => {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    });
                };
                let description;
                if (periodType.includes('month')) {
                    const monthYear = new Date(calculatedDates.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                    });
                    description = `${monthYear} (${formatDateDisplay(calculatedDates.startDate)} - ${formatDateDisplay(calculatedDates.endDate)})`;
                }
                else {
                    description = `${formatDateDisplay(calculatedDates.startDate)} - ${formatDateDisplay(calculatedDates.endDate)}`;
                }
                let label = periodType
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                if (periodType === 'current_week') {
                    label += ' (Limited Time)';
                }
                periods.push({
                    value: periodType,
                    label: label,
                    description: description,
                    calculatedDates: calculatedDates,
                    status: validation,
                    isOpen: validation.isOpen,
                    statusIcon: validation.statusIcon,
                    statusColor: validation.statusColor,
                    timeRemaining: validation.timeRemaining,
                    isTemporary: periodType === 'current_week',
                });
            }
            catch (error) {
                logger.error(`Error calculating dates for ${periodType}:`, error);
            }
        });
        return periods;
    }, []);
    // Initialize component
    useEffect(() => {
        initializeUser();
        const calculatedPeriods = calculateBookingPeriods();
        setBookingPeriods(calculatedPeriods);
    }, [calculateBookingPeriods]);
    // FIXED: Initialize user from SharePoint context or API
    const initializeUser = async () => {
        setIsLoading(true);
        try {
            let userEmailToUse = userEmail;
            // Email validation and fallback
            if (!userEmailToUse || userEmailToUse === 'error@ttec.com') {
                const spUser = SPFXHelper.getCurrentUser();
                userEmailToUse = spUser.email || 'demo.user@ttec.com';
                if (enableDebugMode) {
                    logger.debug('Using fallback email from SPFXHelper or demo:', userEmailToUse);
                }
            }
            logger.log('🔍 Starting user initialization with email:', userEmailToUse);
            // Clear any previous errors
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.general;
                return newErrors;
            });
            // Add API call debugging
            logger.log('📡 Calling transportService.getEmployeeByEmail...');
            const startTime = Date.now();
            const employee = await transportService.getEmployeeByEmail(userEmailToUse, context);
            const endTime = Date.now();
            logger.log(`📡 API call completed in ${endTime - startTime}ms`);
            // CRITICAL FIX: Enhanced employee validation
            if (employee !== null && typeof employee === 'object') {
                logger.log('✅ Employee object received (not null)');
                logger.log('✅ Employee type check:', typeof employee);
                logger.log('✅ Employee keys:', Object.keys(employee));
                logger.log('✅ Raw employee data received:', employee);
                // VALIDATION: Check for essential fields
                const hasRequiredFields = Boolean(employee.ORACLEID &&
                    employee.EMAILID &&
                    employee.FULL_NAME);
                logger.log('✅ Required fields validation:', {
                    hasOracleId: !!employee.ORACLEID,
                    hasEmail: !!employee.EMAILID,
                    hasFullName: !!employee.FULL_NAME,
                    overall: hasRequiredFields
                });
                if (hasRequiredFields) {
                    // NORMALIZATION: Ensure proper data types and handle missing fields
                    const normalizedEmployee = {
                        ORACLEID: Number(employee.ORACLEID) || 0,
                        EMPNO: Number(employee.EMPNO) || 0,
                        FIRST_NAME: employee.FIRST_NAME || '',
                        LAST_NAME: employee.LAST_NAME || '',
                        FULL_NAME: employee.FULL_NAME || `${employee.FIRST_NAME || ''} ${employee.LAST_NAME || ''}`.trim() || 'Unknown User',
                        PROGRAM: employee.PROGRAM || 'Not Specified',
                        DESIGNATION: employee.DESIGNATION || 'Not Specified',
                        EMAILID: employee.EMAILID || userEmailToUse,
                        MOBILE_NUMBER_P: employee.MOBILE_NUMBER_P || '',
                        LOCATION: employee.LOCATION || '',
                        LOCATION_NAME: employee.LOCATION_NAME || '',
                        IS_ACTIVE: Boolean(employee.IS_ACTIVE !== false),
                        SITE_CODE: employee.SITE_CODE || '',
                        SITEID: Number(employee.SITEID) || 0,
                    };
                    logger.log('✅ Normalized employee data:', normalizedEmployee);
                    logger.log('✅ About to set currentUser state...');
                    // STATE UPDATE: Set user state
                    setCurrentUser(normalizedEmployee);
                    // FORM DATA UPDATE: Pre-fill form with user data
                    setFormData(prev => ({
                        ...prev,
                        email: normalizedEmployee.EMAILID,
                        contactNumber: normalizedEmployee.MOBILE_NUMBER_P,
                        site: normalizedEmployee.SITE_CODE || defaultSite || '',
                    }));
                    logger.log('✅ User state and form data updated successfully');
                    // AUTO-LOAD: Load dependent data if we have site information
                    if (normalizedEmployee.SITE_CODE && normalizedEmployee.SITEID) {
                        logger.log('🔄 Auto-loading shifts and stations for site:', {
                            siteCode: normalizedEmployee.SITE_CODE,
                            siteId: normalizedEmployee.SITEID
                        });
                        try {
                            await Promise.all([
                                loadShifts(normalizedEmployee.SITE_CODE),
                                loadStations(normalizedEmployee.SITEID),
                            ]);
                            logger.log('✅ Dependent data loaded successfully');
                        }
                        catch (dependentDataError) {
                            logger.error('⚠️ Error loading dependent data (non-critical):', dependentDataError);
                            // Don't throw - this is not critical for user initialization
                        }
                    }
                    else {
                        logger.warn('⚠️ No site information available, skipping dependent data load');
                    }
                    // SUCCESS: User initialization completed
                    logger.log('🎉 User initialization completed successfully!');
                    return;
                }
                else {
                    // Invalid employee data
                    logger.error('❌ Employee data validation failed - missing required fields');
                    throw new Error(`Invalid employee data received - missing required fields. Email: ${userEmailToUse}`);
                }
            }
            else {
                // No employee data received
                logger.warn('❌ No employee data received from API');
                logger.log('❌ Employee value:', employee);
                logger.log('❌ Employee type:', typeof employee);
                if (employee === null) {
                    throw new Error(`Employee not found in system for email: ${userEmailToUse}`);
                }
                else {
                    throw new Error(`Invalid employee data format received for email: ${userEmailToUse}`);
                }
            }
        }
        catch (error) {
            logger.error('❌ Error during user initialization:', error);
            // ENHANCED ERROR HANDLING: Provide detailed error information
            let errorMessage = 'Failed to load user information';
            let shouldUseFallback = false;
            if (error instanceof Error) {
                errorMessage = error.message;
                // Determine if we should use fallback data based on error type
                if (error.message.includes('Employee not found') ||
                    error.message.includes('Invalid employee data') ||
                    error.message.includes('Network error') ||
                    error.message.includes('timeout')) {
                    shouldUseFallback = true;
                }
            }
            logger.log('🔄 Error analysis:', {
                errorMessage,
                shouldUseFallback,
                errorType: error instanceof Error ? error.constructor.name : typeof error
            });
            if (shouldUseFallback || enableDebugMode) {
                // FALLBACK: Use demo user data for development/testing
                logger.log('🔄 Using fallback demo user data...');
                const demoUser = {
                    ORACLEID: 7500021,
                    EMPNO: 0,
                    FIRST_NAME: 'Mohammedrizwan',
                    LAST_NAME: 'Memon',
                    FULL_NAME: 'Mohammedrizwan Memon',
                    PROGRAM: 'APPLICATION DELIVERY SG&A',
                    DESIGNATION: 'Senior Automation Developer',
                    EMAILID: userEmail || 'mohammedrizwan.memon@ttec.com',
                    MOBILE_NUMBER_P: '9974417860',
                    LOCATION: 'AMD',
                    LOCATION_NAME: 'Ahmedabad',
                    IS_ACTIVE: true,
                    SITE_CODE: 'ahmedabad',
                    SITEID: 11,
                };
                logger.log('✅ Setting demo user data:', demoUser);
                setCurrentUser(demoUser);
                setFormData(prev => ({
                    ...prev,
                    email: demoUser.EMAILID,
                    contactNumber: demoUser.MOBILE_NUMBER_P,
                    site: demoUser.SITE_CODE,
                }));
                // Show warning to user about fallback data
                if (enableDebugMode) {
                    setErrors({
                        general: `⚠️ Using demo data due to API issue: ${errorMessage}`
                    });
                }
                // Still try to load API data for the demo site
                try {
                    await Promise.all([
                        loadShifts(demoUser.SITE_CODE),
                        loadStations(demoUser.SITEID)
                    ]);
                    logger.log('✅ Demo user dependent data loaded successfully');
                }
                catch (demoDataError) {
                    logger.error('❌ Failed to load demo user dependent data:', demoDataError);
                }
            }
            else {
                // PRODUCTION ERROR: Show user-friendly error without fallback
                setErrors({
                    general: `Failed to load your employee information. Please contact IT support if this issue persists. (${errorMessage})`
                });
                // Clear user data
                setCurrentUser(null);
            }
        }
        finally {
            setIsLoading(false);
            logger.log('🏁 User initialization process completed');
        }
    };
    // Add state debugging useEffect
    useEffect(() => {
        if (currentUser) {
            logger.log('✅ Current user state updated:', {
                fullName: currentUser.FULL_NAME,
                designation: currentUser.DESIGNATION,
                email: currentUser.EMAILID,
                hasDesignation: !!currentUser.DESIGNATION,
                designationType: typeof currentUser.DESIGNATION,
            });
        }
    }, [currentUser]);
    useEffect(() => {
        console.log('🔍 FORM STATE DEBUG:', {
            selectedSite: formData.site,
            shiftsCount: shifts.length,
            stationsCount: stations.length,
            selectedShift: formData.shiftTiming,
            selectedPickupStation: formData.pickupStation,
            selectedDropoffStation: formData.dropOffStation,
            transportPreference: formData.transportPreference,
            formDataSite: formData.site,
            sitesAvailable: sites.map(s => s.value),
        });
    }, [
        formData.site,
        shifts.length,
        stations.length,
        formData.shiftTiming,
        formData.pickupStation,
        formData.dropOffStation,
        formData.transportPreference,
    ]);
    // Debug component to verify state
    const DebugCurrentUser = () => {
        if (!enableDebugMode || !currentUser)
            return null;
        return (React.createElement(Alert, { severity: 'info', sx: { mb: 2 } },
            React.createElement(Typography, { variant: 'body2' },
                React.createElement("strong", null, "\uD83D\uDD0D Debug Info:"),
                React.createElement("br", null),
                "Current User Loaded: ",
                currentUser ? '✅ Yes' : '❌ No',
                React.createElement("br", null),
                "Designation Value: \"",
                (currentUser === null || currentUser === void 0 ? void 0 : currentUser.DESIGNATION) || 'undefined',
                "\"",
                React.createElement("br", null),
                "Designation Type: ",
                typeof (currentUser === null || currentUser === void 0 ? void 0 : currentUser.DESIGNATION),
                React.createElement("br", null),
                "Full Object Keys: ",
                currentUser ? Object.keys(currentUser).join(', ') : 'None')));
    };
    // Load shifts for selected site
    const loadShifts = async (site) => {
        try {
            console.log('🔍 Loading shifts for site:', site);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.shifts;
                return newErrors;
            });
            const shiftsData = await transportService.getShiftsBySite(site, context);
            console.log('✅ Shifts data loaded:', shiftsData);
            if (Array.isArray(shiftsData) && shiftsData.length > 0) {
                setShifts(shiftsData);
                console.log('✅ Shifts state updated with', shiftsData.length, 'shifts');
            }
            else {
                setShifts([]);
                console.warn('⚠️ No shifts returned for site:', site);
            }
        }
        catch (error) {
            console.error('❌ Error loading shifts:', error);
            setErrors(prev => ({
                ...prev,
                shifts: `API Error: ${error.message}`,
            }));
            setShifts([]);
        }
    };
    // Load stations for selected site
    const loadStations = async (siteId) => {
        try {
            console.log('🔍 Loading stations for siteId:', siteId);
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.stations;
                return newErrors;
            });
            const stationsData = await transportService.getStationsBySite(siteId, context);
            console.log('✅ Stations data loaded:', stationsData);
            if (Array.isArray(stationsData) && stationsData.length > 0) {
                setStations(stationsData);
                console.log('✅ Stations state updated with', stationsData.length, 'stations');
            }
            else {
                setStations([]);
                console.warn('⚠️ No stations returned for siteId:', siteId);
            }
        }
        catch (error) {
            console.error('❌ Error loading stations:', error);
            setErrors(prev => ({
                ...prev,
                stations: `API Error: ${error.message}`,
            }));
            setStations([]);
        }
    };
    const getGroupedStations = useCallback((stationsArray) => {
        if (!Array.isArray(stationsArray) || stationsArray.length === 0) {
            return [];
        }
        console.log('🔧 Grouping stations:', stationsArray.length, 'total stations');
        // Group stations by KILOMETER_SLAB
        const grouped = stationsArray.reduce((acc, station) => {
            const kmSlab = station.KILOMETER_SLAB || 'Unknown';
            if (!acc[kmSlab]) {
                acc[kmSlab] = [];
            }
            acc[kmSlab].push({
                ...station,
                label: station.STATION_NAME,
                value: station.ID.toString(),
                searchText: station.STATION_NAME.toLowerCase(),
                group: kmSlab
            });
            return acc;
        }, {});
        // Sort each group alphabetically by STATION_NAME
        Object.keys(grouped).forEach(group => {
            grouped[group].sort((a, b) => a.STATION_NAME.localeCompare(b.STATION_NAME));
        });
        // Define KM slab order as requested
        const kmSlabOrder = [
            '0 km - 5 km',
            '6 km - 10 km',
            '11 km - 20 km',
            '21 km - 30 km',
            'Above 30 km'
        ];
        // Create ordered grouped array
        const orderedGroups = [];
        kmSlabOrder.forEach(kmSlab => {
            if (grouped[kmSlab] && grouped[kmSlab].length > 0) {
                orderedGroups.push({
                    group: kmSlab,
                    options: grouped[kmSlab],
                    count: grouped[kmSlab].length
                });
                console.log(`📍 Group "${kmSlab}": ${grouped[kmSlab].length} stations`);
            }
        });
        // Add any remaining groups not in predefined order (safety net)
        Object.keys(grouped).forEach(kmSlab => {
            if (!kmSlabOrder.includes(kmSlab)) {
                orderedGroups.push({
                    group: kmSlab,
                    options: grouped[kmSlab],
                    count: grouped[kmSlab].length
                });
                console.log(`📍 Additional group "${kmSlab}": ${grouped[kmSlab].length} stations`);
            }
        });
        console.log('✅ Stations grouped into', orderedGroups.length, 'groups');
        return orderedGroups;
    }, []);
    // Get grouped stations for autocomplete
    const groupedStations = React.useMemo(() => getGroupedStations(stations), [stations, getGroupedStations]);
    // Flatten stations for autocomplete options with group information
    const flattenedStations = React.useMemo(() => groupedStations.flatMap(group => group.options.map((station) => ({
        ...station,
        groupLabel: group.group,
        groupCount: group.count
    }))), [groupedStations]);
    // Handle station search and group expansion
    const handleStationSearch = (searchValue, stationType) => {
        console.log(`🔍 Station search (${stationType}):`, searchValue);
        if (searchValue && searchValue.length > 0) {
            // Find groups that contain matching stations
            const matchingGroups = {};
            // Start with all groups collapsed
            Object.keys(expandedKmGroups).forEach(group => {
                matchingGroups[group] = false;
            });
            // Expand groups with matching stations
            let matchCount = 0;
            flattenedStations.forEach(station => {
                if (station.searchText.includes(searchValue.toLowerCase())) {
                    matchingGroups[station.groupLabel] = true;
                    matchCount++;
                }
            });
            console.log(`📍 Search "${searchValue}" found ${matchCount} matches`);
            console.log('📍 Expanding groups:', Object.keys(matchingGroups).filter(k => matchingGroups[k]));
            setExpandedKmGroups(matchingGroups);
        }
        else {
            // Reset to default state (only first group expanded)
            setExpandedKmGroups({
                '0 km - 5 km': true,
                '6 km - 10 km': false,
                '11 km - 20 km': false,
                '21 km - 30 km': false,
                'Above 30 km': false
            });
        }
    };
    const handleGroupToggle = (groupName) => {
        setExpandedKmGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
        console.log(`📁 Group "${groupName}" ${expandedKmGroups[groupName] ? 'collapsed' : 'expanded'}`);
    };
    const renderStationGroup = (params) => {
        const group = params.group;
        const isExpanded = expandedKmGroups[group];
        const groupData = groupedStations.find(g => g.group === group);
        return (React.createElement(Box, { key: params.key },
            React.createElement(Box, { sx: {
                    px: 2,
                    py: 1.5,
                    backgroundColor: 'primary.50',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'primary.100'
                    }
                }, onClick: () => handleGroupToggle(group) },
                React.createElement(Typography, { variant: "subtitle2", sx: { fontWeight: 600, color: 'primary.main' } },
                    "\uD83D\uDCCD ",
                    group),
                React.createElement(Box, { display: "flex", alignItems: "center", gap: 1 },
                    React.createElement(Chip, { label: `${(groupData === null || groupData === void 0 ? void 0 : groupData.count) || 0} stations`, size: "small", color: "primary", variant: "outlined" }),
                    React.createElement(Typography, { variant: "caption", sx: {
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        } }, "\u25BC"))),
            React.createElement(Collapse, { in: isExpanded, timeout: 300 },
                React.createElement(Box, { sx: { backgroundColor: 'grey.50' } }, params.children))));
    };
    const renderStationOption = (props, option) => (React.createElement(Box, { component: "li", ...props, sx: {
            px: 3,
            py: 1.5,
            borderLeft: '3px solid',
            borderColor: 'primary.light',
            margin: '2px 0',
            borderRadius: '0 4px 4px 0',
            '&:hover': {
                backgroundColor: 'primary.50',
                borderColor: 'primary.main'
            },
            '&[aria-selected="true"]': {
                backgroundColor: 'primary.100',
                borderColor: 'primary.dark'
            }
        } },
        React.createElement(Box, { width: "100%" },
            React.createElement(Typography, { variant: "body2", sx: { fontWeight: 500 } }, option.STATION_NAME),
            React.createElement(Typography, { variant: "caption", color: "text.secondary", sx: { display: 'flex', gap: 1 } },
                React.createElement("span", null,
                    "\uD83D\uDCCF ",
                    option.DISTANCE,
                    "km"),
                React.createElement("span", null, "\u2022"),
                React.createElement("span", null,
                    "\uD83D\uDCCD ",
                    option.groupLabel)))));
    // Calculate booking dates
    const calculateBookingDates = async (bookingPeriod) => {
        try {
            const formatToDisplay = (dateStr) => {
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                });
            };
            // Try API first
            try {
                const dates = await transportService.getBookingDates(bookingPeriod, context);
                logger.log('Booking dates from API:', dates);
                const formattedDates = {
                    startDate: formatToDisplay(dates.startDate),
                    endDate: formatToDisplay(dates.endDate),
                    lockDate: dates.lockDate,
                    lockDateFormatted: dates.lockDateFormatted ||
                        new Date(dates.lockDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        }),
                };
                setCalculatedDates(formattedDates);
                return;
            }
            catch (apiError) {
                logger.log('API failed, trying DateCalculationHelper...', apiError);
            }
            // Fallback to DateCalculationHelper
            const dates = DateCalculationHelper.calculateBookingDates(bookingPeriod);
            logger.log('Booking dates from DateCalculationHelper:', dates);
            const formattedDates = {
                startDate: formatToDisplay(dates.startDate),
                endDate: formatToDisplay(dates.endDate),
                lockDate: dates.lockDate,
                lockDateFormatted: dates.lockDateFormatted,
            };
            setCalculatedDates(formattedDates);
        }
        catch (error) {
            logger.error('Error calculating dates:', error);
            setErrors(prev => ({
                ...prev,
                dates: `Failed to calculate booking dates: ${error.message}`,
            }));
            // Ultimate fallback with demo dates
            const getFallbackDates = (period) => {
                const isMonth = period.includes('month');
                const isCurrent = period.includes('current');
                return {
                    startDate: isMonth
                        ? isCurrent
                            ? '05-Sep-2025'
                            : '01-Oct-2025'
                        : isCurrent
                            ? '26-Aug-2025'
                            : '02-Sep-2025',
                    endDate: isMonth
                        ? isCurrent
                            ? '01-Oct-2025'
                            : '05-Nov-2025'
                        : isCurrent
                            ? '01-Sep-2025'
                            : '08-Sep-2025',
                    lockDate: '2025-08-30 00:00:00',
                    lockDateFormatted: '30-Aug-2025 at 12:00 AM',
                };
            };
            setCalculatedDates(getFallbackDates(bookingPeriod));
        }
    };
    // Update booking periods when available
    useEffect(() => {
        if (formData.bookingPeriod && bookingPeriods.length > 0) {
            const selectedPeriod = bookingPeriods.find(p => p.value === formData.bookingPeriod);
            if (selectedPeriod && selectedPeriod.calculatedDates) {
                const dates = selectedPeriod.calculatedDates;
                const formatToDisplay = (dateStr) => {
                    const date = new Date(dateStr);
                    return date.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    });
                };
                setCalculatedDates({
                    startDate: formatToDisplay(dates.startDate),
                    endDate: formatToDisplay(dates.endDate),
                    lockDate: dates.lockDate,
                    lockDateFormatted: dates.lockDateFormatted,
                });
            }
        }
    }, [formData.bookingPeriod, bookingPeriods]);
    // Update booking status
    useEffect(() => {
        const updateBookingStatus = () => {
            if (formData.bookingPeriod) {
                const status = DateCalculationHelper.validateBookingPeriod(formData.bookingPeriod);
                setBookingStatus(status);
            }
        };
        updateBookingStatus();
        const interval = setInterval(updateBookingStatus, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [formData.bookingPeriod]);
    // Form handlers - Fixed to handle SelectChangeEvent
    const handleSelectChange = (fieldName) => (event) => {
        const value = event.target.value;
        console.log(`🔍 Dropdown changed - Field: ${fieldName}, Value: ${value}`);
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        // Clear errors for this field
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
        // Handle dependent field updates
        if (fieldName === 'site') {
            console.log('🔍 Site changed, clearing dependent fields...');
            const selectedSite = sites.find(s => s.value === value);
            if (selectedSite) {
                setFormData(prev => ({
                    ...prev,
                    shiftTiming: '',
                    pickupStation: '',
                    dropOffStation: '',
                    sameAsPickup: false,
                    pickupLandmark: '',
                    dropOffLandmark: '',
                }));
                setStationSearchPickup('');
                setStationSearchDropoff('');
                setShowPickupDropdown(false);
                setShowDropoffDropdown(false);
                console.log('🔍 Loading data for site:', selectedSite);
                loadShifts(value);
                loadStations(selectedSite.siteId);
            }
        }
        if (fieldName === 'bookingPeriod') {
            setFormData(prev => ({ ...prev, weeklyOffs: [] }));
            calculateBookingDates(value);
        }
        if (fieldName === 'transportPreference') {
            setFormData(prev => ({
                ...prev,
                pickupStation: '',
                dropOffStation: '',
                sameAsPickup: false,
                pickupLandmark: '',
                dropOffLandmark: '',
            }));
            setStationSearchPickup('');
            setStationSearchDropoff('');
        }
    };
    const handleChange = (fieldName) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        if (errors[fieldName]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };
    const handleCheckboxChange = (fieldName) => (event) => {
        const { checked } = event.target;
        setFormData(prev => {
            const newData = { ...prev, [fieldName]: checked };
            if (fieldName === 'sameAsPickup' && checked) {
                newData.dropOffStation = prev.pickupStation;
                newData.dropOffLandmark = prev.pickupLandmark;
                if (prev.pickupStation) {
                    const station = stations.find(s => s.ID === parseInt(prev.pickupStation));
                    if (station) {
                        setStationSearchDropoff(station.STATION_NAME);
                    }
                }
            }
            return newData;
        });
    };
    const handleWeeklyOffChange = (day) => {
        setFormData(prev => {
            const currentOffs = prev.weeklyOffs || [];
            const isSelected = currentOffs.includes(day);
            const isMonthlyBooking = prev.bookingPeriod.includes('month');
            let newOffs;
            if (isSelected) {
                newOffs = currentOffs.filter(item => item !== day);
            }
            else {
                if (isMonthlyBooking && currentOffs.length >= 2) {
                    return prev;
                }
                if (!isMonthlyBooking && currentOffs.length >= 6) {
                    return prev;
                }
                newOffs = [...currentOffs, day];
            }
            return { ...prev, weeklyOffs: newOffs };
        });
        if (errors.weeklyOffs) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.weeklyOffs;
                return newErrors;
            });
        }
    };
    const handleStationSelect = (stationType, station) => {
        if (stationType === 'pickup') {
            setFormData(prev => {
                const newData = { ...prev, pickupStation: station.ID.toString() };
                if (prev.sameAsPickup) {
                    newData.dropOffStation = station.ID.toString();
                    newData.dropOffLandmark = prev.pickupLandmark;
                    setStationSearchDropoff(station.STATION_NAME);
                }
                return newData;
            });
            setStationSearchPickup(station.STATION_NAME);
            setShowPickupDropdown(false);
        }
        else if (stationType === 'dropoff') {
            setFormData(prev => ({ ...prev, dropOffStation: station.ID.toString() }));
            setStationSearchDropoff(station.STATION_NAME);
            setShowDropoffDropdown(false);
        }
    };
    const clearStationSelection = (stationType) => {
        if (stationType === 'pickup') {
            setFormData(prev => {
                const newData = { ...prev, pickupStation: '' };
                if (prev.sameAsPickup) {
                    newData.dropOffStation = '';
                    newData.dropOffLandmark = '';
                    setStationSearchDropoff('');
                }
                return newData;
            });
            setStationSearchPickup('');
        }
        else if (stationType === 'dropoff') {
            setFormData(prev => ({ ...prev, dropOffStation: '' }));
            setStationSearchDropoff('');
        }
    };
    // Validation
    const validateForm = () => {
        const newErrors = {};
        if (!formData.site)
            newErrors.site = 'Site selection is required';
        if (!formData.bookingPeriod)
            newErrors.bookingPeriod = 'Booking period is required';
        if (!formData.shiftTiming)
            newErrors.shiftTiming = 'Shift timing is required';
        if (!formData.transportPreference)
            newErrors.transportPreference = 'Transport preference is required';
        if (!formData.email)
            newErrors.email = 'Email address is required';
        if (!formData.contactNumber)
            newErrors.contactNumber = 'Contact number is required';
        if (!formData.agreementAccepted)
            newErrors.agreementAccepted = 'Agreement acceptance is required';
        // Weekly offs validation
        const isMonthlyBooking = formData.bookingPeriod.includes('month');
        if (isMonthlyBooking && formData.weeklyOffs.length !== 2) {
            newErrors.weeklyOffs = 'Select exactly 2 weekly offs for monthly booking';
        }
        if (!isMonthlyBooking && formData.weeklyOffs.length === 0) {
            newErrors.weeklyOffs = 'Select at least 1 weekly off';
        }
        // Station validations
        if (formData.transportPreference === 'pickup' && !formData.pickupStation) {
            newErrors.pickupStation = 'Pickup Station is required';
        }
        if (formData.transportPreference === 'dropoff' && !formData.dropOffStation) {
            newErrors.dropOffStation = 'Drop Off Station is required';
        }
        if (formData.transportPreference === 'both') {
            if (!formData.pickupStation)
                newErrors.pickupStation = 'Pickup Station is required';
            if (!formData.dropOffStation)
                newErrors.dropOffStation = 'Drop Off Station is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        const phoneRegex = /^\d{10}$/;
        if (formData.contactNumber && !phoneRegex.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be exactly 10 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) {
            logger.warn('Form validation failed');
            return;
        }
        try {
            console.log('🚀 Starting form submission...');
            // Set loading state
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.general;
                return newErrors;
            });
            // Get selected data objects
            const selectedShift = shifts.find((s) => s.SHIFT_ID === parseInt(formData.shiftTiming));
            const selectedSite = sites.find((s) => s.value === formData.site);
            if (!selectedShift || !selectedSite) {
                throw new Error('Please verify all form selections are valid.');
            }
            // Get selected period dates
            const selectedPeriod = bookingPeriods.find((p) => p.value === formData.bookingPeriod);
            if (!selectedPeriod || !selectedPeriod.calculatedDates) {
                throw new Error('Invalid booking period selected. Please refresh and try again.');
            }
            console.log('📋 Form data validated:', {
                selectedShift: selectedShift.SHIFT_DISPLAY,
                selectedSite: selectedSite.label,
                selectedPeriod: selectedPeriod.label
            });
            // Helper function to get station name by ID (using STATION_NAME)
            const getStationName = (stationId) => {
                if (!stationId)
                    return '';
                const station = stations.find((s) => s.ID === parseInt(stationId));
                return station ? station.STATION_NAME : ''; // Use STATION_NAME (not STATION_DISPLAY)
            };
            // Helper function to format transport preferences
            const formatTransportPreferences = () => {
                const preferences = [];
                if (formData.transportPreference === 'pickup' || formData.transportPreference === 'both') {
                    const chargeType = selectedShift.CHARGEABLE_PICKUP ? 'Chargeable' : 'Complementary';
                    preferences.push(`Pickup ${chargeType}`);
                }
                if (formData.transportPreference === 'dropoff' || formData.transportPreference === 'both') {
                    const chargeType = selectedShift.CHARGEABLE_DROPOFF ? 'Chargeable' : 'Complementary';
                    preferences.push(`Drop-Off ${chargeType}`);
                }
                return preferences.join(',');
            };
            // Convert dates from calculated dates to proper ISO format
            const dates = selectedPeriod.calculatedDates;
            const startDate = new Date(dates.startDate);
            const endDate = new Date(dates.endDate);
            // Determine landmark values based on transport preference
            let pickupLandmark = '';
            let dropOffLandmark = '';
            if (formData.transportPreference === 'pickup') {
                pickupLandmark = formData.pickupLandmark || '';
            }
            else if (formData.transportPreference === 'dropoff') {
                dropOffLandmark = formData.dropOffLandmark || '';
            }
            else if (formData.transportPreference === 'both') {
                if (formData.sameAsPickup) {
                    pickupLandmark = formData.pickupLandmark || '';
                    dropOffLandmark = formData.pickupLandmark || ''; // Same as pickup
                }
                else {
                    pickupLandmark = formData.pickupLandmark || '';
                    dropOffLandmark = formData.dropOffLandmark || '';
                }
            }
            // Create comprehensive booking data structure
            const bookingData = {
                // Basic Information
                Site: selectedSite.label,
                SiteCode: selectedSite.value,
                SiteId: selectedSite.siteId,
                // Booking Period
                BookingPeriod: formData.bookingPeriod,
                BookingStart: startDate.toISOString(),
                BookingEnd: endDate.toISOString(),
                // Shift Information
                ShiftId: selectedShift.SHIFT_ID,
                ShiftStart: selectedShift.SHIFT_START,
                ShiftEnd: selectedShift.SHIFT_END,
                ShiftDisplay: selectedShift.SHIFT_DISPLAY,
                // Station Information (using STATION_NAME)
                PickupStationId: (formData.transportPreference === 'pickup' || formData.transportPreference === 'both')
                    ? parseInt(formData.pickupStation) || null : null,
                PickupStationName: (formData.transportPreference === 'pickup' || formData.transportPreference === 'both')
                    ? getStationName(formData.pickupStation) : null,
                DropOffStationId: (formData.transportPreference === 'dropoff' || formData.transportPreference === 'both')
                    ? parseInt(formData.dropOffStation) || null : null,
                DropOffStationName: (formData.transportPreference === 'dropoff' || formData.transportPreference === 'both')
                    ? getStationName(formData.dropOffStation) : null,
                // Landmarks
                PickupLandmark: pickupLandmark,
                DropOffLandmark: dropOffLandmark,
                SameAsPickup: formData.sameAsPickup,
                // Schedule
                WeekOffs: formData.weeklyOffs.join(','),
                WeeklyOffsArray: formData.weeklyOffs,
                // Transport Preferences
                TransportPreference: formatTransportPreferences(),
                TransportPreferenceCode: formData.transportPreference,
                ChargeablePickup: selectedShift.CHARGEABLE_PICKUP,
                ChargeableDropoff: selectedShift.CHARGEABLE_DROPOFF,
                // User Information
                BookedForOracleId: null,
                EmailAddress: formData.email,
                ContactNumber: formData.contactNumber,
                CreatedByOracleId: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.ORACLEID) || 0,
                CreatedByName: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.FULL_NAME) || '',
                // Metadata
                CreatedTimeStamp: new Date().toISOString(),
                AgreementAccepted: formData.agreementAccepted,
                FormVersion: '2.0',
                SubmissionSource: 'SPFx Web Part'
            };
            console.log('📤 Submitting booking with complete data structure:', bookingData);
            // Show loading state
            console.log('⏳ Submitting to API...');
            const result = await transportService.submitBooking(bookingData, context);
            console.log('📥 API response received:', result);
            if (result.STATUS === 'SUCCESS') {
                console.log('✅ Booking submitted successfully');
                // Clear any previous errors
                setErrors({});
                // Show success notification
                if (SPFXHelper.isInSharePoint()) {
                    SPFXHelper.showNotification('Transport booking submitted successfully! Check your email for confirmation.', 'success', 5000);
                }
                // Call success callback if provided
                if (props.onFormSubmit) {
                    props.onFormSubmit(bookingData);
                }
                // Auto-reset form after success
                setTimeout(() => {
                    console.log('🔄 Auto-resetting form...');
                    handleReset();
                }, 3000);
            }
            else {
                // Handle API error response
                const errorMessage = result.MESSAGE || 'Failed to submit booking';
                console.error('❌ API returned error:', errorMessage);
                throw new Error(errorMessage);
            }
        }
        catch (error) {
            console.error('❌ Submission error:', error);
            // Extract meaningful error message
            let errorMessage = 'Error submitting form. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === 'string') {
                errorMessage = error;
            }
            else if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = error.message;
            }
            // Set error state
            setErrors({
                general: errorMessage,
            });
            // Show error notification
            if (SPFXHelper.isInSharePoint()) {
                SPFXHelper.showNotification(`Submission failed: ${errorMessage}`, 'error', 0 // Sticky notification for errors
                );
            }
            // Call error callback if provided
            if (props.onError) {
                props.onError(errorMessage);
            }
            // Log for debugging
            logger.error('Form submission failed:', {
                error: errorMessage,
                formData: formData,
                currentUser: currentUser === null || currentUser === void 0 ? void 0 : currentUser.EMAILID
            });
        }
    };
    // Form reset
    const handleReset = () => {
        setFormData({
            site: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.SITE_CODE) || defaultSite || '',
            bookingPeriod: '',
            shiftTiming: '',
            weeklyOffs: [],
            transportPreference: '',
            pickupStation: '',
            dropOffStation: '',
            sameAsPickup: false,
            pickupLandmark: '',
            dropOffLandmark: '',
            email: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.EMAILID) || '',
            contactNumber: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.MOBILE_NUMBER_P) || '',
            agreementAccepted: false,
        });
        // Reset station search states
        setStationSearchPickup('');
        setStationSearchDropoff('');
        setShowPickupDropdown(false);
        setShowDropoffDropdown(false);
        setExpandedGroups({});
        // Reset KM group expansion to default
        setExpandedKmGroups({
            '0 km - 5 km': true,
            '6 km - 10 km': false,
            '11 km - 20 km': false,
            '21 km - 30 km': false,
            'Above 30 km': false
        });
        setErrors({});
        setCurrentStep(0);
        setExpandedSection(FORM_SECTIONS.BASIC_INFO);
        setCalculatedDates({
            startDate: null,
            endDate: null,
            lockDate: null,
            lockDateFormatted: null,
        });
        logger.log('Form reset completed');
    };
    // Progress calculation
    const getStepProgress = () => {
        let progress = 0;
        let completedControls = 0;
        const totalControls = 10;
        if (formData.site)
            completedControls += 1;
        if (formData.bookingPeriod)
            completedControls += 1;
        if (formData.shiftTiming)
            completedControls += 1;
        if (formData.weeklyOffs.length > 0)
            completedControls += 1;
        if (formData.transportPreference)
            completedControls += 1;
        // Station completion based on preference
        if (formData.transportPreference === 'pickup' && formData.pickupStation)
            completedControls += 2;
        else if (formData.transportPreference === 'dropoff' && formData.dropOffStation)
            completedControls += 2;
        else if (formData.transportPreference === 'both') {
            if (formData.pickupStation)
                completedControls += 1;
            if (formData.dropOffStation)
                completedControls += 1;
        }
        if (formData.email)
            completedControls += 1;
        if (formData.contactNumber)
            completedControls += 1;
        if (formData.agreementAccepted)
            completedControls += 1;
        progress = Math.round((completedControls / totalControls) * 100);
        return Math.min(progress, 100);
    };
    // Loading state
    if (isLoading) {
        return (React.createElement(ThemeProvider, { theme: theme },
            React.createElement(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', sx: { p: 3 } },
                React.createElement(Paper, { elevation: 2, sx: { p: 4, textAlign: 'center', borderRadius: 3 } },
                    React.createElement(CircularProgress, { size: 60, sx: { mb: 2, color: 'primary.main' } }),
                    React.createElement(Typography, { variant: 'h6', color: 'text.primary', gutterBottom: true }, "Loading Transport Booking Form"),
                    React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, "Please wait while we fetch your information...")))));
    }
    return (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(Box, { sx: { maxWidth: 1200, margin: '0 auto', p: 2 } },
            React.createElement(Card, { sx: { mb: 3, overflow: 'visible' } },
                React.createElement(AppBar, { position: 'static', sx: {
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        borderRadius: '16px 16px 0 0',
                    } },
                    React.createElement(Toolbar, { sx: { py: 2 } },
                        React.createElement(BusIcon, { sx: { mr: 2, fontSize: 28 } }),
                        React.createElement(Box, { sx: { flexGrow: 1 } },
                            React.createElement(Typography, { variant: 'h5', component: 'div', sx: { fontWeight: 'bold' } }, "Two Way Transport Booking"),
                            React.createElement(Typography, { variant: 'body2', sx: { opacity: 0.9 } }, "Secure your daily commute with ease")),
                        React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 2 } },
                            React.createElement(Box, { sx: { position: 'relative', display: 'inline-flex' } },
                                React.createElement(CircularProgress, { variant: 'determinate', value: getStepProgress(), size: 50, thickness: 4, sx: { color: 'rgba(255,255,255,0.8)' } }),
                                React.createElement(Box, { sx: {
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    } },
                                    React.createElement(Typography, { variant: 'caption', component: 'div', color: 'white', sx: { fontWeight: 'bold' } },
                                        getStepProgress(),
                                        "%"))),
                            currentUser && (React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 } },
                                React.createElement(Avatar, { sx: {
                                        width: 40,
                                        height: 40,
                                        background: getAvatarGradient(currentUser.FULL_NAME),
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    } }, getInitials(currentUser.FULL_NAME)),
                                React.createElement(Typography, { variant: 'body2', sx: { opacity: 0.9 } }, currentUser.FULL_NAME || userDisplayName))))))),
            environmentMessage && (React.createElement(Alert, { severity: 'info', sx: { mb: 3 } },
                React.createElement(Typography, { variant: 'body2' }, environmentMessage))),
            enableDebugMode && (React.createElement(ApiDebugPanel, { userEmail: userEmail || 'mohammedrizwan.memon@ttec.com', context: context, enableDebugMode: enableDebugMode })),
            isSuccess && (React.createElement(Alert, { severity: 'success', sx: { mb: 3 } },
                React.createElement(Typography, { variant: 'body1' },
                    React.createElement("strong", null, "Success!"),
                    " Transport booking submitted successfully. Check your email for confirmation."))),
            submissionError && (React.createElement(Alert, { severity: 'error', sx: { mb: 3 } },
                React.createElement(Typography, { variant: 'body1' }, submissionError.getUserFriendlyMessage()))),
            errors.general && (React.createElement(Alert, { severity: 'error', sx: { mb: 3 } },
                React.createElement(Typography, { variant: 'body1' }, errors.general))),
            showUserInfo && currentUser && (React.createElement(Card, { sx: { mb: 3 } },
                React.createElement(CardContent, null,
                    React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 3 },
                        React.createElement(Avatar, { sx: {
                                width: 64,
                                height: 64,
                                background: getAvatarGradient(currentUser.FULL_NAME || 'User'),
                                fontSize: 24,
                                fontWeight: 'bold',
                                boxShadow: 2,
                            } }, getInitials(currentUser.FULL_NAME || 'User')),
                        React.createElement(Box, { flex: 1 },
                            React.createElement(Typography, { variant: 'h6', gutterBottom: true, sx: { display: 'flex', alignItems: 'center', gap: 1 } },
                                React.createElement(PersonIcon, { color: 'primary' }),
                                "User Information",
                                isLoading && React.createElement(CircularProgress, { size: 16 })),
                            React.createElement(Grid, { container: true, spacing: 2 },
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2' },
                                        React.createElement("strong", null, "Name:"),
                                        " ",
                                        currentUser.FULL_NAME || 'Loading...')),
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2' },
                                        React.createElement("strong", null, "Email:"),
                                        " ",
                                        currentUser.EMAILID || 'Loading...')),
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2' },
                                        React.createElement("strong", null, "Location:"),
                                        " ",
                                        currentUser.LOCATION_NAME || 'Loading...')),
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2', sx: { wordBreak: 'break-word' } },
                                        React.createElement("strong", null, "Designation:"),
                                        " ",
                                        currentUser.DESIGNATION || 'Not Available',
                                        enableDebugMode && (React.createElement(Box, { component: 'span', sx: { fontSize: '0.75rem', color: 'text.secondary', ml: 1 } },
                                            "(Debug: ",
                                            typeof currentUser.DESIGNATION,
                                            ", Length:",
                                            ' ',
                                            (currentUser.DESIGNATION || '').length,
                                            ")")))),
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2' },
                                        React.createElement("strong", null, "Program:"),
                                        " ",
                                        currentUser.PROGRAM || 'Not Available')),
                                React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                    React.createElement(Typography, { variant: 'body2' },
                                        React.createElement("strong", null, "Oracle ID:"),
                                        " ",
                                        currentUser.ORACLEID || 'Not Available'))))),
                    enableDebugMode && (React.createElement(Box, { sx: { mt: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 } },
                        React.createElement(Typography, { variant: 'caption', component: 'div', sx: { fontFamily: 'monospace', fontSize: '0.75rem' } },
                            React.createElement("strong", null, "DEBUG - Current User Object:"),
                            React.createElement("pre", { style: { margin: '8px 0', fontSize: '0.7rem', lineHeight: 1.3 } }, JSON.stringify(currentUser, null, 2))))),
                    React.createElement(DebugCurrentUser, null)))),
            React.createElement(Paper, { sx: { p: 3, mb: 3, borderRadius: 3 } },
                React.createElement(Stepper, { activeStep: currentStep, alternativeLabel: true }, steps.map((label, index) => (React.createElement(Step, { key: label, completed: getStepProgress() >= (index + 1) * 20 },
                    React.createElement(StepLabel, null,
                        React.createElement(Typography, { variant: 'caption', sx: { fontWeight: 500 } }, label)))))),
                React.createElement(Box, { sx: { mt: 2 } },
                    React.createElement(LinearProgress, { variant: 'determinate', value: getStepProgress(), sx: {
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                background: 'linear-gradient(90deg, #4CAF50, #2196F3)',
                            },
                        } }),
                    React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mt: 1, textAlign: 'center' } },
                        "Form completion: ",
                        getStepProgress(),
                        "%"))),
            React.createElement(Card, { sx: { borderRadius: 3 } },
                React.createElement(CardContent, { sx: { p: 0 } },
                    React.createElement("form", { onSubmit: handleSubmit },
                        React.createElement(Accordion, { expanded: expandedSection === FORM_SECTIONS.BASIC_INFO, onChange: () => setExpandedSection(expandedSection === FORM_SECTIONS.BASIC_INFO ? '' : FORM_SECTIONS.BASIC_INFO), sx: { boxShadow: 'none', '&:before': { display: 'none' } } },
                            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 2, width: '100%' },
                                    React.createElement(LocationIcon, { color: 'primary' }),
                                    React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600 } }, "Basic Information"),
                                    React.createElement(Chip, { label: formData.site && formData.bookingPeriod ? 'Complete' : '1', color: formData.site && formData.bookingPeriod ? 'success' : 'primary', size: 'small' }))),
                            React.createElement(AccordionDetails, null,
                                React.createElement(Grid, { container: true, spacing: 3 },
                                    React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(FormControl, { fullWidth: true, error: !!errors.site },
                                            React.createElement(InputLabel, { id: 'site-select-label' }, "Site"),
                                            React.createElement(Select, { labelId: 'site-select-label', id: 'site-select', value: formData.site || '', onChange: handleSelectChange('site'), label: 'Site', displayEmpty: false, MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 48 * 4.5 + 8,
                                                            width: 250,
                                                        },
                                                    },
                                                    disableScrollLock: true,
                                                    anchorOrigin: {
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    },
                                                    transformOrigin: {
                                                        vertical: 'top',
                                                        horizontal: 'left',
                                                    },
                                                }, onClick: () => console.log('🔍 Site dropdown clicked'), onOpen: () => console.log('🔍 Site dropdown opened'), onClose: () => console.log('🔍 Site dropdown closed') }, sites.length === 0 ? (React.createElement(MenuItem, { disabled: true },
                                                React.createElement("em", null, "Loading sites..."))) : (sites.map(site => (React.createElement(MenuItem, { key: `site-${site.value}`, value: site.value },
                                                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
                                                    React.createElement("span", null, site.label),
                                                    React.createElement(Chip, { label: site.locationCode, size: 'small', variant: 'outlined' }))))))),
                                            errors.site && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1 } }, errors.site)))),
                                    React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(FormControl, { fullWidth: true, error: !!errors.bookingPeriod },
                                            React.createElement(InputLabel, null, "Booking Period"),
                                            React.createElement(Select, { value: formData.bookingPeriod, onChange: handleSelectChange('bookingPeriod'), label: 'Booking Period' }, bookingPeriods.map(period => (React.createElement(MenuItem, { key: period.value, value: period.value, disabled: !period.isOpen },
                                                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '100%' },
                                                    React.createElement("span", null, period.label),
                                                    React.createElement(Chip, { label: period.isOpen ? 'Open' : 'Closed', color: period.isOpen ? 'success' : 'error', size: 'small' })))))),
                                            errors.bookingPeriod && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1 } }, errors.bookingPeriod))))))),
                        React.createElement(Divider, null),
                        React.createElement(Accordion, { expanded: expandedSection === FORM_SECTIONS.SHIFT_SCHEDULE, onChange: () => setExpandedSection(expandedSection === FORM_SECTIONS.SHIFT_SCHEDULE
                                ? ''
                                : FORM_SECTIONS.SHIFT_SCHEDULE), disabled: !formData.site || !formData.bookingPeriod, sx: { boxShadow: 'none', '&:before': { display: 'none' } } },
                            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 2, width: '100%' },
                                    React.createElement(ScheduleIcon, { color: 'primary' }),
                                    React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600 } }, "Shift & Schedule"),
                                    React.createElement(Chip, { label: formData.shiftTiming && formData.weeklyOffs.length ? 'Complete' : '2', color: formData.shiftTiming && formData.weeklyOffs.length ? 'success' : 'primary', size: 'small' }))),
                            React.createElement(AccordionDetails, null,
                                React.createElement(Grid, { container: true, spacing: 3 },
                                    React.createElement(Grid, { item: true, xs: 12 },
                                        React.createElement(FormControl, { fullWidth: true, error: !!errors.shiftTiming },
                                            React.createElement(InputLabel, { id: 'shift-select-label' }, "Shift Timing"),
                                            React.createElement(Select, { labelId: 'shift-select-label', id: 'shift-select', value: formData.shiftTiming || '', onChange: handleSelectChange('shiftTiming'), label: 'Shift Timing', disabled: shifts.length === 0, displayEmpty: false, MenuProps: {
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 48 * 6 + 8,
                                                            width: 400,
                                                        },
                                                    },
                                                    disableScrollLock: true,
                                                }, onClick: () => console.log('🔍 Shift dropdown clicked, shifts available:', shifts.length) }, shifts.length === 0 ? (React.createElement(MenuItem, { disabled: true },
                                                React.createElement("em", null, formData.site ? 'Loading shifts...' : 'Please select a site first'))) : (shifts.map(shift => (React.createElement(MenuItem, { key: `shift-${shift.SHIFT_ID}`, value: shift.SHIFT_ID.toString() },
                                                React.createElement(Box, { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' },
                                                    React.createElement("span", null, shift.SHIFT_DISPLAY ||
                                                        `${shift.SHIFT_START} - ${shift.SHIFT_END}`),
                                                    React.createElement(Box, { display: 'flex', gap: 1 },
                                                        React.createElement(Chip, { label: `Pickup: ${shift.CHARGEABLE_PICKUP ? 'Paid' : 'Free'}`, color: shift.CHARGEABLE_PICKUP ? 'warning' : 'success', size: 'small' }),
                                                        React.createElement(Chip, { label: `Drop: ${shift.CHARGEABLE_DROPOFF ? 'Paid' : 'Free'}`, color: shift.CHARGEABLE_DROPOFF ? 'warning' : 'success', size: 'small' })))))))),
                                            errors.shiftTiming && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1 } }, errors.shiftTiming)),
                                            enableDebugMode && (React.createElement(Typography, { variant: 'caption', color: 'text.secondary', sx: { mt: 1 } },
                                                "Debug: ",
                                                shifts.length,
                                                " shifts loaded for site \"",
                                                formData.site,
                                                "\"",
                                                shifts.length > 0 && ` (${shifts.map(s => s.SHIFT_ID).join(', ')})`)))),
                                    formData.bookingPeriod && (React.createElement(Grid, { item: true, xs: 12 },
                                        React.createElement(Paper, { variant: 'outlined', sx: { p: 2, borderRadius: 2 } },
                                            React.createElement(Typography, { variant: 'subtitle1', gutterBottom: true, sx: { fontWeight: 600 } },
                                                "Weekly Offs",
                                                React.createElement(Typography, { variant: 'caption', sx: { ml: 1, color: 'text.secondary' } }, formData.bookingPeriod.includes('month')
                                                    ? '(Select exactly 2 days)'
                                                    : '(Select up to 6 days)')),
                                            React.createElement(Grid, { container: true, spacing: 1, sx: { mt: 1 } }, weekDays.map(day => {
                                                const isMonthlyBooking = formData.bookingPeriod.includes('month');
                                                const isSelected = formData.weeklyOffs.includes(day.name);
                                                const canSelect = isSelected ||
                                                    (isMonthlyBooking && formData.weeklyOffs.length < 2) ||
                                                    (!isMonthlyBooking && formData.weeklyOffs.length < 6);
                                                return (React.createElement(Grid, { item: true, xs: 6, sm: 4, md: 3, key: day.name },
                                                    React.createElement(Paper, { elevation: isSelected ? 4 : 1, sx: {
                                                            p: 1.5,
                                                            textAlign: 'center',
                                                            cursor: canSelect ? 'pointer' : 'not-allowed',
                                                            borderRadius: 2,
                                                            background: isSelected
                                                                ? `linear-gradient(135deg, ${day.color}, ${day.color}dd)`
                                                                : 'white',
                                                            color: isSelected ? 'white' : 'text.primary',
                                                            opacity: canSelect ? 1 : 0.5,
                                                            transition: 'all 0.3s ease',
                                                            '&:hover': canSelect
                                                                ? {
                                                                    transform: 'translateY(-2px)',
                                                                    boxShadow: 4,
                                                                }
                                                                : {},
                                                        }, onClick: () => canSelect && handleWeeklyOffChange(day.name) },
                                                        React.createElement(Typography, { variant: 'body2', sx: { fontWeight: 'bold' } }, day.short),
                                                        React.createElement(Typography, { variant: 'caption', sx: { opacity: 0.8 } }, day.name))));
                                            })),
                                            errors.weeklyOffs && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1, display: 'block' } }, errors.weeklyOffs)))))))),
                        React.createElement(Divider, null),
                        React.createElement(Accordion, { expanded: expandedSection === FORM_SECTIONS.TRANSPORT_PREF, onChange: () => setExpandedSection(expandedSection === FORM_SECTIONS.TRANSPORT_PREF
                                ? ''
                                : FORM_SECTIONS.TRANSPORT_PREF), disabled: !formData.shiftTiming || !formData.weeklyOffs.length, sx: { boxShadow: 'none', '&:before': { display: 'none' } } },
                            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 2 },
                                    React.createElement(BusIcon, { color: 'primary' }),
                                    React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600 } }, "Transport Preferences"),
                                    React.createElement(Chip, { label: formData.transportPreference ? 'Complete' : '3', color: formData.transportPreference ? 'success' : 'primary', size: 'small' }))),
                            React.createElement(AccordionDetails, null,
                                React.createElement(FormControl, { component: 'fieldset', error: !!errors.transportPreference },
                                    React.createElement(FormLabel, { component: 'legend', sx: { mb: 2 } }, "Choose your transport service"),
                                    React.createElement(RadioGroup, { value: formData.transportPreference, onChange: handleSelectChange('transportPreference') },
                                        React.createElement(Grid, { container: true, spacing: 2 }, transportPreferences.map(pref => (React.createElement(Grid, { item: true, xs: 12, sm: 4, key: pref.value },
                                            React.createElement(Paper, { variant: 'outlined', sx: {
                                                    p: 2,
                                                    borderColor: formData.transportPreference === pref.value
                                                        ? 'primary.main'
                                                        : 'grey.300',
                                                    backgroundColor: formData.transportPreference === pref.value
                                                        ? 'primary.50'
                                                        : 'background.paper',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        borderColor: 'primary.main',
                                                        boxShadow: 2,
                                                    },
                                                }, onClick: () => setFormData(prev => ({ ...prev, transportPreference: pref.value })) },
                                                React.createElement(FormControlLabel, { value: pref.value, control: React.createElement(Radio, null), label: React.createElement(Box, null,
                                                        React.createElement(Typography, { variant: 'body1', sx: { fontWeight: 600 } }, pref.label),
                                                        React.createElement(Typography, { variant: 'body2', color: 'text.secondary' }, pref.description)), sx: { m: 0, width: '100%' } }))))))),
                                    errors.transportPreference && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1 } }, errors.transportPreference))))),
                        React.createElement(Divider, null),
                        React.createElement(Accordion, { expanded: expandedSection === FORM_SECTIONS.SCHEDULE_STATIONS, onChange: () => setExpandedSection(expandedSection === FORM_SECTIONS.SCHEDULE_STATIONS
                                ? ''
                                : FORM_SECTIONS.SCHEDULE_STATIONS), disabled: !formData.transportPreference, sx: { boxShadow: 'none', '&:before': { display: 'none' } } },
                            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 2 },
                                    React.createElement(BusIcon, { color: 'primary' }),
                                    React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600 } }, "Pickup & Drop Stations"),
                                    React.createElement(Chip, { label: formData.pickupStation || formData.dropOffStation ? 'Complete' : '4', color: formData.pickupStation || formData.dropOffStation ? 'success' : 'primary', size: 'small' }))),
                            React.createElement(AccordionDetails, null,
                                React.createElement(Grid, { container: true, spacing: 3 },
                                    (formData.transportPreference === 'pickup' || formData.transportPreference === 'both') && (React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(Box, null,
                                            React.createElement(Typography, { variant: "body2", sx: { mb: 1, fontWeight: 500, color: 'text.primary' } }, "Pickup Station"),
                                            React.createElement(Autocomplete, { id: "pickup-station-autocomplete", options: flattenedStations, groupBy: (option) => option.groupLabel, getOptionLabel: (option) => option.STATION_NAME, value: flattenedStations.find(station => station.value === formData.pickupStation) || null, onChange: (event, newValue) => {
                                                    const stationId = newValue ? newValue.value : '';
                                                    console.log('🚌 Pickup station selected:', newValue === null || newValue === void 0 ? void 0 : newValue.STATION_NAME, 'ID:', stationId);
                                                    setFormData(prev => {
                                                        const newData = { ...prev, pickupStation: stationId };
                                                        // Handle same as pickup logic
                                                        if (prev.sameAsPickup && stationId) {
                                                            newData.dropOffStation = stationId;
                                                            console.log('🔄 Auto-copying to dropoff (same as pickup enabled)');
                                                        }
                                                        return newData;
                                                    });
                                                    // Clear errors
                                                    if (errors.pickupStation) {
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.pickupStation;
                                                            return newErrors;
                                                        });
                                                    }
                                                }, onInputChange: (event, value, reason) => {
                                                    if (reason === 'input') {
                                                        handleStationSearch(value, 'pickup');
                                                    }
                                                }, renderGroup: renderStationGroup, renderOption: renderStationOption, renderInput: (params) => (React.createElement(TextField, { ...params, label: "Search Pickup Station", placeholder: "Type to search stations...", error: !!errors.pickupStation, helperText: errors.pickupStation || 'Search by station name', InputProps: {
                                                        ...params.InputProps,
                                                        startAdornment: (React.createElement(Box, { sx: { mr: 1 } },
                                                            React.createElement(LocationIcon, { color: "primary" }))),
                                                    } })), clearOnEscape: true, disableCloseOnSelect: false, blurOnSelect: "touch", disabled: stations.length === 0, loading: stations.length === 0, loadingText: "Loading stations...", noOptionsText: React.createElement(Box, { sx: { p: 2, textAlign: 'center' } },
                                                    React.createElement(Typography, { variant: "body2", color: "text.secondary" }, formData.site ? 'No stations found' : 'Please select a site first')), ListboxProps: {
                                                    style: { maxHeight: 400 }
                                                }, sx: { width: '100%' } }),
                                            enableDebugMode && (React.createElement(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 1, display: 'block' } },
                                                "Debug: ",
                                                stations.length,
                                                " total | ",
                                                groupedStations.length,
                                                " groups | Selected: ",
                                                formData.pickupStation || 'None',
                                                formData.pickupStation && flattenedStations.find(s => s.value === formData.pickupStation) &&
                                                    ` (${(_a = flattenedStations.find(s => s.value === formData.pickupStation)) === null || _a === void 0 ? void 0 : _a.STATION_NAME})`))))),
                                    (formData.transportPreference === 'dropoff' || formData.transportPreference === 'both') && (React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(Box, null,
                                            React.createElement(Typography, { variant: "body2", sx: { mb: 1, fontWeight: 500, color: 'text.primary' } }, "Drop-off Station"),
                                            React.createElement(Autocomplete, { id: "dropoff-station-autocomplete", options: flattenedStations, groupBy: (option) => option.groupLabel, getOptionLabel: (option) => option.STATION_NAME, value: flattenedStations.find(station => station.value === formData.dropOffStation) || null, onChange: (event, newValue) => {
                                                    const stationId = newValue ? newValue.value : '';
                                                    console.log('🚌 Dropoff station selected:', newValue === null || newValue === void 0 ? void 0 : newValue.STATION_NAME, 'ID:', stationId);
                                                    setFormData(prev => ({ ...prev, dropOffStation: stationId }));
                                                    // Clear errors
                                                    if (errors.dropOffStation) {
                                                        setErrors(prev => {
                                                            const newErrors = { ...prev };
                                                            delete newErrors.dropOffStation;
                                                            return newErrors;
                                                        });
                                                    }
                                                }, onInputChange: (event, value, reason) => {
                                                    if (reason === 'input') {
                                                        handleStationSearch(value, 'dropoff');
                                                    }
                                                }, renderGroup: renderStationGroup, renderOption: renderStationOption, renderInput: (params) => (React.createElement(TextField, { ...params, label: "Search Drop-off Station", placeholder: formData.sameAsPickup ? "Same as pickup station" : "Type to search stations...", error: !!errors.dropOffStation, helperText: formData.sameAsPickup ?
                                                        "Drop-off station will be same as pickup" :
                                                        errors.dropOffStation || 'Search by station name', InputProps: {
                                                        ...params.InputProps,
                                                        startAdornment: (React.createElement(Box, { sx: { mr: 1 } },
                                                            React.createElement(LocationIcon, { color: formData.sameAsPickup ? "disabled" : "secondary" }))),
                                                    } })), clearOnEscape: true, disableCloseOnSelect: false, blurOnSelect: "touch", disabled: formData.sameAsPickup || stations.length === 0, loading: stations.length === 0 && formData.site && !formData.sameAsPickup, loadingText: "Loading stations...", noOptionsText: React.createElement(Box, { sx: { p: 2, textAlign: 'center' } },
                                                    React.createElement(Typography, { variant: "body2", color: "text.secondary" }, formData.sameAsPickup ? 'Using same as pickup station' :
                                                        formData.site ? 'No stations found' : 'Please select a site first')), ListboxProps: {
                                                    style: { maxHeight: 400 }
                                                }, sx: {
                                                    width: '100%',
                                                    '& .MuiAutocomplete-input': {
                                                        color: formData.sameAsPickup ? 'text.disabled' : 'text.primary'
                                                    }
                                                } }),
                                            enableDebugMode && (React.createElement(Typography, { variant: "caption", color: "text.secondary", sx: { mt: 1, display: 'block' } },
                                                "Debug: ",
                                                stations.length,
                                                " total | ",
                                                groupedStations.length,
                                                " groups | Selected: ",
                                                formData.dropOffStation || 'None',
                                                " | SameAsPickup: ",
                                                formData.sameAsPickup ? 'Yes' : 'No',
                                                formData.dropOffStation && flattenedStations.find(s => s.value === formData.dropOffStation) &&
                                                    ` (${(_b = flattenedStations.find(s => s.value === formData.dropOffStation)) === null || _b === void 0 ? void 0 : _b.STATION_NAME})`))))),
                                    formData.transportPreference === 'both' && (React.createElement(Grid, { item: true, xs: 12 },
                                        React.createElement(Paper, { variant: "outlined", sx: {
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: formData.sameAsPickup ? 'success.50' : 'grey.50',
                                                borderColor: formData.sameAsPickup ? 'success.main' : 'grey.300',
                                                transition: 'all 0.3s ease'
                                            } },
                                            React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: formData.sameAsPickup, onChange: (e) => {
                                                        const checked = e.target.checked;
                                                        console.log('🔄 Same as pickup changed:', checked);
                                                        setFormData(prev => {
                                                            const newData = { ...prev, sameAsPickup: checked };
                                                            // Auto-copy pickup station to dropoff when enabled
                                                            if (checked && prev.pickupStation) {
                                                                newData.dropOffStation = prev.pickupStation;
                                                                newData.dropOffLandmark = prev.pickupLandmark;
                                                                console.log('📋 Auto-copied pickup to dropoff');
                                                            }
                                                            else if (!checked) {
                                                                // Clear dropoff when disabled
                                                                newData.dropOffStation = '';
                                                                newData.dropOffLandmark = '';
                                                                console.log('🧹 Cleared dropoff selections');
                                                            }
                                                            return newData;
                                                        });
                                                    }, color: "primary" }), label: React.createElement(Box, null,
                                                    React.createElement(Typography, { variant: "body2", sx: { fontWeight: 500 } }, "\uD83D\uDD04 Use same station for drop-off"),
                                                    React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Automatically copies your pickup station and landmark")) }),
                                            formData.sameAsPickup && formData.pickupStation && (React.createElement(Box, { sx: { mt: 2, p: 1.5, backgroundColor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'success.light' } },
                                                React.createElement(Typography, { variant: "caption", color: "success.main", sx: { fontWeight: 600 } }, "\uD83D\uDCCD Using Station:"),
                                                React.createElement(Typography, { variant: "body2", sx: { ml: 1 } }, ((_c = flattenedStations.find(s => s.value === formData.pickupStation)) === null || _c === void 0 ? void 0 : _c.STATION_NAME) || 'Unknown Station')))))),
                                    React.createElement(Grid, { item: true, xs: 12 },
                                        React.createElement(Typography, { variant: 'subtitle2', gutterBottom: true, sx: { fontWeight: 600 } }, "Nearest Landmark (Optional)"),
                                        formData.transportPreference === 'both' && !formData.sameAsPickup ? (React.createElement(Grid, { container: true, spacing: 2 },
                                            React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                                React.createElement(TextField, { fullWidth: true, label: 'Pickup Landmark', multiline: true, rows: 2, value: formData.pickupLandmark, onChange: handleChange('pickupLandmark'), placeholder: 'Landmark near pickup location' })),
                                            React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                                React.createElement(TextField, { fullWidth: true, label: 'Drop-off Landmark', multiline: true, rows: 2, value: formData.dropOffLandmark, onChange: handleChange('dropOffLandmark'), placeholder: 'Landmark near drop-off location' })))) : (React.createElement(TextField, { fullWidth: true, label: 'Landmark', multiline: true, rows: 2, value: formData.transportPreference === 'pickup'
                                                ? formData.pickupLandmark
                                                : formData.transportPreference === 'dropoff'
                                                    ? formData.dropOffLandmark
                                                    : formData.pickupLandmark, onChange: e => {
                                                const value = e.target.value;
                                                if (formData.transportPreference === 'pickup') {
                                                    setFormData(prev => ({ ...prev, pickupLandmark: value }));
                                                }
                                                else if (formData.transportPreference === 'dropoff') {
                                                    setFormData(prev => ({ ...prev, dropOffLandmark: value }));
                                                }
                                                else if (formData.transportPreference === 'both' &&
                                                    formData.sameAsPickup) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        pickupLandmark: value,
                                                        dropOffLandmark: value,
                                                    }));
                                                }
                                            }, placeholder: 'Help us locate you better (e.g., Near Metro Station, Opposite Shopping Mall)' })))))),
                        React.createElement(Divider, null),
                        React.createElement(Accordion, { expanded: expandedSection === FORM_SECTIONS.CONTACT_AGREEMENT, onChange: () => setExpandedSection(expandedSection === FORM_SECTIONS.CONTACT_AGREEMENT
                                ? ''
                                : FORM_SECTIONS.CONTACT_AGREEMENT), disabled: !formData.transportPreference, sx: { boxShadow: 'none', '&:before': { display: 'none' } } },
                            React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                                React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 2 },
                                    React.createElement(PersonIcon, { color: 'primary' }),
                                    React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600 } }, "Contact & Agreement"),
                                    React.createElement(Chip, { label: formData.email && formData.contactNumber && formData.agreementAccepted
                                            ? 'Complete'
                                            : '5', color: formData.email && formData.contactNumber && formData.agreementAccepted
                                            ? 'success'
                                            : 'primary', size: 'small' }))),
                            React.createElement(AccordionDetails, null,
                                React.createElement(Grid, { container: true, spacing: 3 },
                                    React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(TextField, { fullWidth: true, label: 'Email Address', type: 'email', value: formData.email, onChange: handleChange('email'), error: !!errors.email, helperText: errors.email, InputProps: {
                                                startAdornment: React.createElement(EmailIcon, { sx: { mr: 1, color: 'action.active' } }),
                                            } })),
                                    React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                                        React.createElement(TextField, { fullWidth: true, label: 'Contact Number', type: 'tel', value: formData.contactNumber, onChange: e => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                setFormData(prev => ({ ...prev, contactNumber: value }));
                                            }, error: !!errors.contactNumber, helperText: errors.contactNumber, InputProps: {
                                                startAdornment: React.createElement(PhoneIcon, { sx: { mr: 1, color: 'action.active' } }),
                                            } })),
                                    React.createElement(Grid, { item: true, xs: 12 },
                                        React.createElement(Paper, { variant: 'outlined', sx: { p: 2, borderRadius: 2, backgroundColor: 'grey.50' } },
                                            React.createElement(FormControlLabel, { control: React.createElement(Checkbox, { checked: formData.agreementAccepted, onChange: handleCheckboxChange('agreementAccepted'), color: 'primary' }), label: React.createElement(Typography, { variant: 'body2', sx: { lineHeight: 1.6 } },
                                                    "By submitting this request, I confirm my agreement to comply with TTEC's",
                                                    ' ',
                                                    React.createElement(Box, { component: 'a', href: 'https://teletechinc.sharepoint.com/:b:/s/OnlineTools/MealTransport/EX7jvv43-FlPi8MXYXBZva8Bcu2lqLvZF-4kXxznwNuDnA?e=xHOqHI', target: '_blank', rel: 'noopener noreferrer', sx: {
                                                            color: 'primary.main',
                                                            fontWeight: 'bold',
                                                            textDecoration: 'underline',
                                                            '&:hover': {
                                                                textDecoration: 'none',
                                                            },
                                                        } }, "Transport Policy"),
                                                    ", and I understand that this action constitutes my binding consent.") }),
                                            errors.agreementAccepted && (React.createElement(Typography, { variant: 'caption', color: 'error', sx: { mt: 1, display: 'block' } }, errors.agreementAccepted))))))),
                        React.createElement(Box, { sx: { p: 3, backgroundColor: 'grey.50', borderRadius: '0 0 16px 16px' } },
                            React.createElement(Box, { display: 'flex', gap: 2, justifyContent: 'center' },
                                React.createElement(Button, { variant: 'outlined', size: 'large', onClick: handleReset, disabled: isSubmitting, startIcon: React.createElement(RefreshIcon, null), sx: { minWidth: 140 } }, "Reset Form"),
                                React.createElement(Button, { variant: 'contained', size: 'large', type: 'submit', disabled: isSubmitting || getStepProgress() < 100, sx: { minWidth: 140 } }, isSubmitting ? (React.createElement(Box, { display: 'flex', alignItems: 'center', gap: 1 },
                                    React.createElement(CircularProgress, { size: 20, color: 'inherit' }),
                                    "Submitting...")) : ('Submit Request'))),
                            isSubmitting && (React.createElement(Box, { sx: { mt: 2 } },
                                React.createElement(LinearProgress, { color: 'primary' }),
                                React.createElement(Typography, { variant: 'body2', color: 'text.secondary', sx: { mt: 1, textAlign: 'center' } }, "Processing your transport request..."))))))),
            calculatedDates.startDate && bookingStatus && (React.createElement(Card, { sx: { mt: 3, borderRadius: 3 } },
                React.createElement(CardContent, null,
                    React.createElement(Box, { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 },
                        React.createElement(Typography, { variant: 'h6', sx: { fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 } },
                            React.createElement(ScheduleIcon, { color: 'primary' }),
                            "Booking Period Details"),
                        React.createElement(Chip, { label: bookingStatus.bookingStatus, color: bookingStatus.isOpen ? 'success' : 'error', sx: {
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                            } })),
                    React.createElement(Grid, { container: true, spacing: 3 },
                        React.createElement(Grid, { item: true, xs: 12, sm: 4 },
                            React.createElement(Paper, { variant: 'outlined', sx: { p: 2, textAlign: 'center', borderRadius: 2 } },
                                React.createElement(Typography, { variant: 'caption', color: 'text.secondary', sx: { fontWeight: 600 } }, "START DATE"),
                                React.createElement(Typography, { variant: 'h6', color: 'primary.main', sx: { fontWeight: 'bold' } }, calculatedDates.startDate))),
                        React.createElement(Grid, { item: true, xs: 12, sm: 4 },
                            React.createElement(Paper, { variant: 'outlined', sx: { p: 2, textAlign: 'center', borderRadius: 2 } },
                                React.createElement(Typography, { variant: 'caption', color: 'text.secondary', sx: { fontWeight: 600 } }, "END DATE"),
                                React.createElement(Typography, { variant: 'h6', color: 'success.main', sx: { fontWeight: 'bold' } }, calculatedDates.endDate))),
                        React.createElement(Grid, { item: true, xs: 12, sm: 4 },
                            React.createElement(Paper, { variant: 'outlined', sx: {
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    borderColor: bookingStatus.statusColor + '40',
                                    backgroundColor: bookingStatus.statusColor + '10',
                                } },
                                React.createElement(Typography, { variant: 'caption', color: 'text.secondary', sx: { fontWeight: 600 } }, bookingStatus.isOpen ? 'DEADLINE' : 'CLOSED'),
                                React.createElement(Typography, { variant: 'h6', sx: {
                                        fontWeight: 'bold',
                                        color: bookingStatus.statusColor,
                                    } }, calculatedDates.lockDateFormatted),
                                bookingStatus.isOpen && (React.createElement(Typography, { variant: 'caption', sx: { color: bookingStatus.statusColor } }, bookingStatus.timeRemaining))))),
                    bookingStatus.urgencyLevel === 'critical' && bookingStatus.isOpen && (React.createElement(Alert, { severity: 'warning', sx: { mt: 2 } },
                        React.createElement(Typography, { variant: 'body2', sx: { fontWeight: 600 } }, "Urgent: Less than 6 hours remaining to submit booking!")))))),
            enableDebugMode && (React.createElement(Card, { sx: { mt: 3, borderRadius: 3 } },
                React.createElement(CardContent, null,
                    React.createElement(Typography, { variant: 'h6', gutterBottom: true, sx: { fontWeight: 600 } }, "Debug Information"),
                    React.createElement(Grid, { container: true, spacing: 2 },
                        React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "Environment:"),
                                ' ',
                                context.isServedFromLocalhost ? 'Development' : 'Production'),
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "API Endpoint:"),
                                " ",
                                apiEndpoint || 'Default'),
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "SharePoint Context:"),
                                ' ',
                                SPFXHelper.isInSharePoint() ? 'Available' : 'Not Available')),
                        React.createElement(Grid, { item: true, xs: 12, sm: 6 },
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "Shifts Loaded:"),
                                " ",
                                shifts.length),
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "Stations Loaded:"),
                                " ",
                                stations.length),
                            React.createElement(Typography, { variant: 'body2' },
                                React.createElement("strong", null, "User Context:"),
                                " ",
                                currentUser ? 'Loaded' : 'Not Loaded')))))))));
};
export default TransportBookingForm;
//# sourceMappingURL=TransportBookingForm.js.map