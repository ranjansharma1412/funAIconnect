import { apiClient, API_CONFIG } from './apiClient';
import { Asset } from 'react-native-image-picker';
import { Platform } from 'react-native';

export interface CreatePostPayload {
    userName: string;
    userHandle: string;
    userImage?: string;
    description: string;
    hashtags: string;
    postImage?: Asset;
    isVerified?: boolean;
}

export interface Post {
    id: number;
    userName: string;
    userHandle: string;
    userImage: string;
    description: string;
    hashtags: string;
    postImage: string;
    isVerified: boolean;
    likes: number;
    hasLiked?: boolean;
    createdAt: string;
    commentsCount?: number;
}

export interface GetPostsResponse {
    posts: Post[];
    has_next: boolean;
    has_prev: boolean;
    total: number;
    pages: number;
}

export const postService = {
    createPost: async (payload: CreatePostPayload): Promise<Post> => {
        const formData = new FormData();

        formData.append('userName', payload.userName);
        formData.append('userHandle', payload.userHandle);
        formData.append('description', payload.description);
        formData.append('hashtags', payload.hashtags);
        if (payload.userImage) {
            formData.append('userImage', payload.userImage);
        }
        if (payload.isVerified !== undefined) {
            formData.append('isVerified', String(payload.isVerified));
        }


        if (payload.postImage && payload.postImage.uri) {
            const imageFile = {
                uri: Platform.OS === 'ios' ? payload.postImage.uri.replace('file://', '') : payload.postImage.uri,
                type: payload.postImage.type || 'image/jpeg',
                name: payload.postImage.fileName || 'upload.jpg',
            };
            formData.append('postImage', imageFile as any);
        }

        try {
            console.log('Post created successfully:', formData);
            const response = await apiClient.post('/api/posts', formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
                // transformRequest: (data) => data,
            });
            console.log('Post created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    getPosts: async (page: number = 1, perPage: number = 10, userId?: string): Promise<GetPostsResponse> => {
        try {
            const params: any = { page, per_page: perPage };
            if (userId) {
                params.user_id = userId;
            }
            const response = await apiClient.get('/api/posts/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    toggleLike: async (postId: number, userId: string): Promise<{ liked: boolean; likes: number }> => {
        try {
            const response = await apiClient.post(`/api/posts/${postId}/like`, { userId });
            return response.data;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    getUserPosts: async (targetUserId: string, page: number = 1, perPage: number = 10, currentUserId?: string): Promise<GetPostsResponse> => {
        try {
            const params: any = { page, per_page: perPage };
            if (currentUserId) {
                params.current_user_id = currentUserId;
            }
            const response = await apiClient.get(`/api/posts/user/${targetUserId}`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw error;
        }
    },

    getPostLikes: async (postId: number): Promise<{ likes: any[]; count: number }> => {
        try {
            const response = await apiClient.get(`/api/posts/${postId}/likes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching post likes:', error);
            throw error;
        }
    }
};
