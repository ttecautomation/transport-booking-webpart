import React from 'react';
interface ApiDebuggerProps {
    userEmail: string;
    context?: any;
    onEmployeeDataReceived?: (employee: any) => void;
}
export declare const ApiDebugger: React.FC<ApiDebuggerProps>;
export {};
