// Example API Service demonstrating how to use the API client

import apiClient from './apiInterceptors';
import { ApiResponse } from '../types/api.types';

/**
 * Example: Fetch posts
 */
export const getPosts = async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/posts');
    return response.data;
};

/**
 * Example: Create a post
 */
export const createPost = async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/posts', data);
    return response.data;
};

/**
 * Example: Update a post
 */
export const updatePost = async (id: string, data: any) => {
    const response = await apiClient.put<ApiResponse<any>>(`/posts/${id}`, data);
    return response.data;
};

/**
 * Example: Delete a post
 */
export const deletePost = async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/posts/${id}`);
    return response.data;
};

// Add more API methods as needed
