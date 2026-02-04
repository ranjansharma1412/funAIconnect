import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { checkInternetConnection } from '../utils/networkUtils';
import { parseApiError, getErrorTitle, getErrorIcon } from './errorHandler';
import { store } from '../store';
import { showError, hideError } from '../store/slices/modalSlice';

/**
 * Request Interceptor - Check network connectivity
 */
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Check internet connectivity before making request
        const isConnected = await checkInternetConnection();

        if (!isConnected) {
            // Show no internet error modal
            store.dispatch(showError({
                title: 'No Internet Connection',
                message: 'Please check your internet connection and try again.',
                icon: 'wifi-off',
                iconColor: '#FF6B6B',
            }));

            // Cancel the request
            return Promise.reject({
                message: 'No internet connection',
                code: 'NETWORK_ERROR',
            });
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

/**
 * Response Interceptor - Handle success and errors
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Handle successful response
        return response;
    },
    (error: AxiosError) => {
        // Parse the error
        const apiError = parseApiError(error);

        // Get error title and icon
        const errorTitle = getErrorTitle(apiError.code);
        const errorIcon = getErrorIcon(apiError.code);

        // Show error modal
        store.dispatch(showError({
            title: errorTitle,
            message: apiError.message,
            icon: errorIcon,
            iconColor: '#FF6B6B',
            showCloseButton: true,
            buttonText: 'Okay',
        }));

        // Log error for debugging
        if (__DEV__) {
            console.error('API Error:', {
                url: error.config?.url,
                method: error.config?.method,
                status: apiError.statusCode,
                message: apiError.message,
                details: apiError.details,
            });
        }

        return Promise.reject(apiError);
    },
);

export default apiClient;
