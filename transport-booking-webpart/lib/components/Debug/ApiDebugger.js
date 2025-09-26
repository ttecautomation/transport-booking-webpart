import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Button, Alert, Accordion, AccordionSummary, AccordionDetails, Chip, Divider, LinearProgress } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, BugReport as BugIcon, Refresh as RefreshIcon, CheckCircle as SuccessIcon, Error as ErrorIcon } from '@mui/icons-material';
import transportService from '../../services/transportService';
import { logger } from '../../config/environment';
export const ApiDebugger = ({ userEmail, context, onEmployeeDataReceived }) => {
    var _a;
    const [debugResults, setDebugResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const runDiagnostics = async () => {
        setIsLoading(true);
        setError(null);
        setDebugResults(null);
        const startTime = Date.now();
        const results = {
            timestamp: new Date().toISOString(),
            email: userEmail,
            steps: []
        };
        try {
            // Step 1: Test basic API connectivity
            results.steps.push({
                step: 1,
                name: 'API Connectivity Test',
                status: 'running',
                details: 'Testing basic API connection...'
            });
            // Step 2: Raw API call
            logger.log('🔧 DEBUG: Making raw API call...');
            results.steps.push({
                step: 2,
                name: 'Raw API Call',
                status: 'running',
                details: `Calling /Transport/employee with email: ${userEmail}`
            });
            const rawResponse = await fetch(`${process.env.REACT_APP_API_URL || 'https://app-mti-api-prod.azurewebsites.net/api'}/Transport/employee`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailAddress: userEmail })
            });
            results.steps[1].status = rawResponse.ok ? 'success' : 'error';
            results.steps[1].details = `HTTP ${rawResponse.status} - ${rawResponse.statusText}`;
            results.steps[1].rawStatus = rawResponse.status;
            results.steps[1].rawStatusText = rawResponse.statusText;
            const rawData = await rawResponse.text();
            let parsedData;
            try {
                parsedData = JSON.parse(rawData);
            }
            catch (parseError) {
                parsedData = rawData;
            }
            results.steps[1].rawResponse = parsedData;
            results.rawResponseSize = rawData.length;
            // Step 3: Service method call
            results.steps.push({
                step: 3,
                name: 'Transport Service Call',
                status: 'running',
                details: 'Calling transportService.getEmployeeByEmail...'
            });
            const serviceResponse = await transportService.getEmployeeByEmail(userEmail, context);
            results.steps[2].status = serviceResponse ? 'success' : 'warning';
            results.steps[2].details = serviceResponse ? 'Service returned employee data' : 'Service returned null';
            results.steps[2].serviceResponse = serviceResponse;
            // Step 4: Data validation
            results.steps.push({
                step: 4,
                name: 'Data Validation',
                status: 'running',
                details: 'Validating employee data structure...'
            });
            if (serviceResponse) {
                const validation = {
                    hasOracleId: !!serviceResponse.ORACLEID,
                    hasEmail: !!serviceResponse.EMAILID,
                    hasFullName: !!serviceResponse.FULL_NAME,
                    hasDesignation: !!serviceResponse.DESIGNATION,
                    hasSiteCode: !!serviceResponse.SITE_CODE,
                    dataType: typeof serviceResponse,
                    keys: Object.keys(serviceResponse)
                };
                const isValid = validation.hasOracleId && validation.hasEmail && validation.hasFullName;
                results.steps[3].status = isValid ? 'success' : 'warning';
                results.steps[3].details = isValid ? 'All required fields present' : 'Missing required fields';
                results.steps[3].validation = validation;
                // Trigger callback if data is valid
                if (isValid && onEmployeeDataReceived) {
                    onEmployeeDataReceived(serviceResponse);
                }
            }
            else {
                results.steps[3].status = 'error';
                results.steps[3].details = 'No employee data to validate';
            }
            const endTime = Date.now();
            results.totalTime = endTime - startTime;
            results.status = 'completed';
            setDebugResults(results);
        }
        catch (debugError) {
            const endTime = Date.now();
            results.totalTime = endTime - startTime;
            results.status = 'error';
            results.error = debugError instanceof Error ? debugError.message : String(debugError);
            setDebugResults(results);
            setError(results.error);
            logger.error('🔧 DEBUG: Diagnostic failed:', debugError);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Auto-run diagnostics on mount
    useEffect(() => {
        if (userEmail) {
            runDiagnostics();
        }
    }, [userEmail]);
    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return React.createElement(SuccessIcon, { sx: { color: 'success.main', fontSize: 16 } });
            case 'error':
                return React.createElement(ErrorIcon, { sx: { color: 'error.main', fontSize: 16 } });
            case 'warning':
                return React.createElement(ErrorIcon, { sx: { color: 'warning.main', fontSize: 16 } });
            default:
                return React.createElement(LinearProgress, { sx: { width: 20, height: 4 } });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'success';
            case 'error': return 'error';
            case 'warning': return 'warning';
            default: return 'info';
        }
    };
    return (React.createElement(Card, { sx: { mb: 3, border: '2px solid #ff9800' } },
        React.createElement(CardContent, null,
            React.createElement(Box, { display: "flex", alignItems: "center", gap: 1, mb: 2 },
                React.createElement(BugIcon, { color: "warning" }),
                React.createElement(Typography, { variant: "h6", color: "warning.main" }, "API Diagnostics Tool"),
                React.createElement(Chip, { label: "DEBUG MODE", color: "warning", size: "small" }),
                React.createElement(Box, { sx: { flexGrow: 1 } }),
                React.createElement(Button, { startIcon: React.createElement(RefreshIcon, null), onClick: runDiagnostics, disabled: isLoading, size: "small", color: "warning" }, "Re-run")),
            isLoading && (React.createElement(Box, { mb: 2 },
                React.createElement(LinearProgress, { color: "warning" }),
                React.createElement(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 1 } }, "Running diagnostics..."))),
            error && (React.createElement(Alert, { severity: "error", sx: { mb: 2 } },
                React.createElement(Typography, { variant: "body2" },
                    React.createElement("strong", null, "Diagnostic Error:"),
                    " ",
                    error))),
            debugResults && (React.createElement(Accordion, { expanded: expanded, onChange: () => setExpanded(!expanded), sx: { boxShadow: 1 } },
                React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMoreIcon, null) },
                    React.createElement(Box, { display: "flex", alignItems: "center", gap: 2, width: "100%" },
                        React.createElement(Typography, { variant: "subtitle1" }, "Diagnostic Results"),
                        React.createElement(Chip, { label: `${debugResults.totalTime}ms`, size: "small", color: "info" }),
                        React.createElement(Chip, { label: debugResults.status.toUpperCase(), size: "small", color: getStatusColor(debugResults.status) }))),
                React.createElement(AccordionDetails, null,
                    React.createElement(Box, null,
                        React.createElement(Alert, { severity: "info", sx: { mb: 2 } },
                            React.createElement(Typography, { variant: "body2" },
                                React.createElement("strong", null, "Email:"),
                                " ",
                                debugResults.email,
                                React.createElement("br", null),
                                React.createElement("strong", null, "Time:"),
                                " ",
                                debugResults.timestamp,
                                React.createElement("br", null),
                                React.createElement("strong", null, "Duration:"),
                                " ",
                                debugResults.totalTime,
                                "ms")), (_a = debugResults.steps) === null || _a === void 0 ? void 0 :
                        _a.map((step, index) => (React.createElement(Box, { key: index, mb: 2 },
                            React.createElement(Box, { display: "flex", alignItems: "center", gap: 1, mb: 1 },
                                getStatusIcon(step.status),
                                React.createElement(Typography, { variant: "subtitle2" },
                                    "Step ",
                                    step.step,
                                    ": ",
                                    step.name),
                                React.createElement(Chip, { label: step.status.toUpperCase(), size: "small", color: getStatusColor(step.status) })),
                            React.createElement(Typography, { variant: "body2", color: "text.secondary", gutterBottom: true }, step.details),
                            step.rawResponse && (React.createElement(Box, { sx: { bgcolor: 'grey.50', p: 2, borderRadius: 1, mt: 1 } },
                                React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                                    "Raw Response (",
                                    step.rawStatus,
                                    " ",
                                    step.rawStatusText,
                                    "):"),
                                React.createElement("pre", { style: {
                                        fontSize: '12px',
                                        margin: '8px 0',
                                        overflow: 'auto',
                                        maxHeight: '200px'
                                    } }, JSON.stringify(step.rawResponse, null, 2)))),
                            step.serviceResponse && (React.createElement(Box, { sx: { bgcolor: 'success.50', p: 2, borderRadius: 1, mt: 1 } },
                                React.createElement(Typography, { variant: "caption", color: "success.dark" }, "Service Response:"),
                                React.createElement("pre", { style: {
                                        fontSize: '12px',
                                        margin: '8px 0',
                                        overflow: 'auto',
                                        maxHeight: '200px'
                                    } }, JSON.stringify(step.serviceResponse, null, 2)))),
                            step.validation && (React.createElement(Box, { sx: { bgcolor: 'info.50', p: 2, borderRadius: 1, mt: 1 } },
                                React.createElement(Typography, { variant: "caption", color: "info.dark" }, "Validation Results:"),
                                React.createElement(Box, { sx: { mt: 1 } }, Object.entries(step.validation).map(([key, value]) => (React.createElement(Chip, { key: key, label: `${key}: ${String(value)}`, size: "small", color: value === true ? 'success' : value === false ? 'error' : 'default', sx: { mr: 1, mb: 1 } })))))),
                            React.createElement(Divider, { sx: { mt: 1 } })))),
                        debugResults.error && (React.createElement(Alert, { severity: "error", sx: { mt: 2 } },
                            React.createElement(Typography, { variant: "body2" },
                                React.createElement("strong", null, "Error Details:")),
                            React.createElement("pre", { style: { fontSize: '12px', margin: '8px 0' } }, debugResults.error))))))),
            React.createElement(Alert, { severity: "warning", sx: { mt: 2 } },
                React.createElement(Typography, { variant: "caption" }, "\uD83D\uDD27 This debug tool is for development only. Remove before production deployment. The tool shows exactly what your API is returning vs. what your service expects.")))));
};
//# sourceMappingURL=ApiDebugger.js.map