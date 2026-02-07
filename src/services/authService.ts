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
};
