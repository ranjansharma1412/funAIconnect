import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { checkInternetConnection } from '../utils/networkUtils';
import { parseApiError, getErrorTitle, getErrorIcon } from './errorHandler';
import modalStore from './modalStore';

/**
 * Request Interceptor - Check network connectivity
 */
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        // Check internet connectivity before making request
        const isConnected = await checkInternetConnection();

        if (!isConnected) {
            // Show no internet error modal
            modalStore.showError({
                title: 'No Internet Connection',
                message: 'Please check your internet connection and try again.',
                icon: 'wifi-off',
                iconColor: '#FF6B6B',
            });

            // Cancel the request
            return Promise.reject({
                message: 'No internet connection',
                code: 'NETWORK_ERROR',
            });
        }

        // Add authentication token if available
        // Uncomment and modify based on your auth implementation
        // const token = await AsyncStorage.getItem('authToken');
        // if (token && config.headers) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

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
        modalStore.showError({
            title: errorTitle,
            message: apiError.message,
            icon: errorIcon,
            iconColor: '#FF6B6B',
            showCloseButton: true,
            buttonText: 'Okay',
            onClose: () => modalStore.hideError(),
            onButtonPress: () => modalStore.hideError(),
        });

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
