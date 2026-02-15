import { apiClient } from './apiClient';
import { RegisterRequest, AuthResponse, LoginRequest } from '../types/auth.types';
import { parseApiError } from './errorHandler';

export const authService = {
    /**
     * Register a new user
     * @param data RegisterRequest data
     * @returns Promise<AuthResponse>
     */
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        try {
            console.log("===data==", data)
            const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
            return response.data;
        } catch (error: any) {
            console.log("===error==", error)
            throw parseApiError(error);
        }
    },

    /**
     * Login user
     * @param data LoginRequest data
     * @returns Promise<AuthResponse>
     */
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        try {
            const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
            return response.data;
        } catch (error: any) {
            throw parseApiError(error);
        }
    },

    /**
     * Update user profile
     * @param formData FormData object containing profile fields and image
     * @returns Promise<any>
     */
    updateProfile: async (formData: FormData): Promise<any> => {
        try {
            const response = await apiClient.put('/api/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Let browser/engine set boundary
                },
                transformRequest: (data) => data,
            });
            return response.data;
        } catch (error: any) {
            console.error('Update Profile Error:', error);
            throw parseApiError(error);
        }
    },

    /**
     * Check if a username is available
     * @param username - Username to check
     * @returns Promise<{ available: boolean }>
     */
    checkUsername: async (username: string): Promise<{ available: boolean }> => {
        try {
            const response = await apiClient.post<{ available: boolean }>('/api/auth/check-username', { username });
            return response.data;
        } catch (error: any) {
            throw parseApiError(error);
        }
    },
};
