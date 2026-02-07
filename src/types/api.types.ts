// API Types and Interfaces

export interface ApiError {
    message: string;
    statusCode?: number;
    code?: string;
    details?: any;
}

export interface ErrorModalConfig {
    visible: boolean;
    title: string;
    message: string;
    icon?: string;
    iconColor?: string;
    showCloseButton?: boolean;
    buttonText?: string;
    onClose?: () => void;
    onButtonPress?: () => void;
}

export interface NetworkState {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string | null;
}

export enum ErrorType {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT_ERROR = 'TIMEOUT_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    CLIENT_ERROR = 'CLIENT_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}
