import { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { checkInternetConnection } from '../utils/networkUtils';
import { parseApiError, getErrorTitle, getErrorIcon } from './errorHandler';
import { store } from '../store';
import { showError, hideError } from '../store/slices/modalSlice';
import { updateTokens, logout } from '../store/slices/authSlice';
import axios from 'axios';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

/**
 * Request Interceptor - Check network connectivity & Inject Token
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

        // Inject Authorization Token
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (__DEV__) {
            console.log('API Request:', {
                url: config.url,
                method: config.method,
                data: config.data,
                headers: config.headers
            });
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

/**
 * Response Interceptor - Handle success, errors, and Token Refresh
 */
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        // Handle successful response
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 Unauthorized for Token Refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/api/auth/login') && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return apiClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const state = store.getState();
                const refreshToken = state.auth.refreshToken;

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint directly using axios to avoid circular interceptor loops
                const refreshResponse = await axios.post(`${apiClient.defaults.baseURL}/api/auth/refresh`, {
                    refreshToken: refreshToken
                });

                const newAccessToken = refreshResponse.data.token;
                const newRefreshToken = refreshResponse.data.refreshToken;

                // Update Redux and AsyncStorage
                store.dispatch(updateTokens({ token: newAccessToken, refreshToken: newRefreshToken }));

                processQueue(null, newAccessToken);
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;

                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Force logout if refresh fails
                store.dispatch(logout());
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        // Regular error handling
        const apiError = parseApiError(error);

        // Don't show modal for 401s handled by the app (like invalid credentials which handled locally, or refresh token failure which redirects)
        if (apiError.statusCode !== 401 || originalRequest?.url?.includes('/api/auth/login')) {
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
        }

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
