import { AxiosError } from 'axios';
import { ApiError, ErrorType } from '../types/api.types';

/**
 * Parse and categorize API errors
 * @param error - Axios error object
 * @returns ApiError - Formatted error object
 */
export const parseApiError = (error: AxiosError): ApiError => {
    // Network error (no response from server)
    if (!error.response) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            return {
                message: 'Request timeout. Please try again.',
                code: ErrorType.TIMEOUT_ERROR,
                statusCode: 0,
            };
        }
        return {
            message: 'Network error. Please check your internet connection.',
            code: ErrorType.NETWORK_ERROR,
            statusCode: 0,
        };
    }

    // Server responded with error
    const { status, data } = error.response;

    // Extract error message from response
    let errorMessage = 'Something went wrong. Please try again.';
    if (data && typeof data === 'object') {
        errorMessage =
            (data as any).message ||
            (data as any).error ||
            (data as any).msg ||
            errorMessage;
    }

    // Categorize by status code
    if (status >= 500) {
        return {
            message: 'Server error. Please try again later.',
            code: ErrorType.SERVER_ERROR,
            statusCode: status,
            details: data,
        };
    }

    if (status >= 400 && status < 500) {
        // Handle specific client errors
        switch (status) {
            case 400:
                return {
                    message: errorMessage || 'Invalid request.',
                    code: ErrorType.VALIDATION_ERROR,
                    statusCode: status,
                    details: data,
                };
            case 401:
                return {
                    message: 'Unauthorized. Please login again.',
                    code: ErrorType.CLIENT_ERROR,
                    statusCode: status,
                    details: data,
                };
            case 403:
                return {
                    message: 'Access forbidden.',
                    code: ErrorType.CLIENT_ERROR,
                    statusCode: status,
                    details: data,
                };
            case 404:
                return {
                    message: 'Resource not found.',
                    code: ErrorType.CLIENT_ERROR,
                    statusCode: status,
                    details: data,
                };
            case 422:
                return {
                    message: errorMessage || 'Validation failed.',
                    code: ErrorType.VALIDATION_ERROR,
                    statusCode: status,
                    details: data,
                };
            default:
                return {
                    message: errorMessage,
                    code: ErrorType.CLIENT_ERROR,
                    statusCode: status,
                    details: data,
                };
        }
    }

    // Unknown error
    return {
        message: errorMessage,
        code: ErrorType.UNKNOWN_ERROR,
        statusCode: status,
        details: data,
    };
};

/**
 * Get user-friendly error title based on error type
 * @param errorCode - Error type code
 * @returns string - Error title
 */
export const getErrorTitle = (errorCode?: string): string => {
    switch (errorCode) {
        case ErrorType.NETWORK_ERROR:
            return 'No Internet Connection';
        case ErrorType.TIMEOUT_ERROR:
            return 'Request Timeout';
        case ErrorType.SERVER_ERROR:
            return 'Server Error';
        case ErrorType.CLIENT_ERROR:
            return 'Error';
        case ErrorType.VALIDATION_ERROR:
            return 'Validation Error';
        default:
            return 'Oops!';
    }
};

/**
 * Get icon name for error type
 * @param errorCode - Error type code
 * @returns string - Icon name from react-native-vector-icons
 */
export const getErrorIcon = (errorCode?: string): string => {
    switch (errorCode) {
        case ErrorType.NETWORK_ERROR:
            return 'wifi-off';
        case ErrorType.TIMEOUT_ERROR:
            return 'clock-alert-outline';
        case ErrorType.SERVER_ERROR:
            return 'server-network-off';
        case ErrorType.CLIENT_ERROR:
            return 'alert-circle-outline';
        case ErrorType.VALIDATION_ERROR:
            return 'alert-outline';
        default:
            return 'alert-circle-outline';
    }
};
