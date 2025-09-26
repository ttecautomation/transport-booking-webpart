/**
 * Material-UI Theme Configuration
 * Central theme configuration for consistent UI styling
 * Dependencies: @mui/material only
 */
import { createTheme } from '@mui/material/styles';
// Custom theme configuration
const themeOptions = {
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#dc004e',
            light: '#ff5983',
            dark: '#9a0036',
            contrastText: '#ffffff',
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
            contrastText: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff',
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
            contrastText: '#ffffff',
        },
        // Background colors
        background: {
            default: '#fafafa',
            paper: '#ffffff',
        },
        // Text colors
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
        },
    },
    typography: {
        fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: {
            fontSize: '2.125rem',
            fontWeight: 300,
            lineHeight: 1.167,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 400,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.167,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.235,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.334,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.6,
        },
        subtitle1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.75,
        },
        subtitle2: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.57,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.5,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.43,
        },
        button: {
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: 1.75,
            textTransform: 'none', // Disable uppercase transformation
        },
        caption: {
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1.66,
        },
        overline: {
            fontSize: '0.625rem',
            fontWeight: 400,
            lineHeight: 2.66,
            textTransform: 'uppercase',
        },
    },
    spacing: 8,
    shape: {
        borderRadius: 8, // Rounded corners
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
        '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
        '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
        '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
        '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
        '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
        '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
        '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
        '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
        '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
        '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
        '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
        '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
        '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
        '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
        '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
        '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
        '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
        '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
    ],
    transitions: {
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
    zIndex: {
        mobileStepper: 1000,
        fab: 1050,
        speedDial: 1050,
        appBar: 1100,
        drawer: 1200,
        modal: 1300,
        snackbar: 1400,
        tooltip: 1500,
    },
};
// Component overrides
themeOptions.components = {
    // TextField overrides
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            size: 'medium',
            fullWidth: true,
        },
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                    },
                },
            },
        },
    },
    // Button overrides
    MuiButton: {
        defaultProps: {
            variant: 'contained',
            size: 'large',
            disableElevation: false,
        },
        styleOverrides: {
            root: {
                textTransform: 'none',
                borderRadius: 8,
                fontWeight: 500,
                padding: '10px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
            },
            contained: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                },
            },
            outlined: {
                borderWidth: 2,
                '&:hover': {
                    borderWidth: 2,
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
            },
        },
    },
    // Card overrides
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)',
                },
            },
        },
    },
    // CardContent overrides
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: '24px',
                '&:last-child': {
                    paddingBottom: '24px',
                },
            },
        },
    },
    // AppBar overrides
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            },
        },
    },
    // Chip overrides
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: 16,
                height: 28,
                fontSize: '0.75rem',
                fontWeight: 500,
            },
            colorSuccess: {
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
                '& .MuiChip-deleteIcon': {
                    color: '#2e7d32',
                },
            },
            colorWarning: {
                backgroundColor: '#fff3e0',
                color: '#ef6c00',
                '& .MuiChip-deleteIcon': {
                    color: '#ef6c00',
                },
            },
        },
    },
    // Alert overrides
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '& .MuiAlert-icon': {
                    fontSize: '1.25rem',
                },
            },
            standardSuccess: {
                backgroundColor: '#e8f5e9',
                border: '1px solid #4caf50',
                color: '#2e7d32',
            },
            standardError: {
                backgroundColor: '#ffebee',
                border: '1px solid #f44336',
                color: '#c62828',
            },
            standardWarning: {
                backgroundColor: '#fff3e0',
                border: '1px solid #ff9800',
                color: '#ef6c00',
            },
            standardInfo: {
                backgroundColor: '#e3f2fd',
                border: '1px solid #2196f3',
                color: '#1565c0',
            },
        },
    },
    // FormControl overrides
    MuiFormControl: {
        defaultProps: {
            fullWidth: true,
            margin: 'normal',
        },
    },
    // Select overrides
    MuiSelect: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
    // Checkbox overrides
    MuiCheckbox: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
            },
        },
    },
    // Radio overrides
    MuiRadio: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
            },
        },
    },
    // Paper overrides
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
            },
            elevation1: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
            elevation2: {
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            },
            elevation3: {
                boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
            },
        },
    },
    // CircularProgress overrides
    MuiCircularProgress: {
        styleOverrides: {
            root: {
                color: '#1976d2',
            },
        },
    },
};
// Create and export the theme
const muiTheme = createTheme(themeOptions);
// Helper function to create theme with mode support
export const createAppTheme = (mode = 'light') => {
    return createTheme({
        ...themeOptions,
        palette: {
            ...themeOptions.palette,
            mode,
            ...(mode === 'dark' && {
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                    disabled: 'rgba(255, 255, 255, 0.5)',
                },
            }),
        },
    });
};
export default muiTheme;
//# sourceMappingURL=muiTheme.js.map