import { apiClient } from './apiClient';
import { Asset } from 'react-native-image-picker';
import { Platform } from 'react-native';

export interface CreateStoryPayload {
    userName: string;
    userHandle: string;
    userImage?: string;
    description: string;
    hashtags: string;
    postImage?: Asset; // Using postImage for consistent generic form upload
    isVerified?: boolean;
}

export interface Story {
    id: number;
    userName: string;
    userHandle: string;
    userImage: string;
    description: string;
    hashtags: string;
    storyImage: string;
    isVerified: boolean;
    likesCount?: number;
    hasLiked?: boolean;
    createdAt: string;
}

export interface StoryLikeResponse {
    liked: boolean;
    likes: number;
    message: string;
}

export interface GetStoryLikesResponse {
    likes: any[];
    count: number;
}

export interface GetStoriesResponse {
    stories: Story[];
    has_next: boolean;
    has_prev: boolean;
    total: number;
    pages: number;
}

export interface StoryCommentResponse {
    comments: any[]; // Or reuse Comment interface from commentService if identical
    has_next: boolean;
    has_prev: boolean;
    total: number;
    pages: number;
    page: number;
}


export const storyService = {
    createStory: async (payload: CreateStoryPayload): Promise<Story> => {
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
            console.log('Story created successfully:', formData);
            const response = await apiClient.post('/api/stories', formData, {
                headers: {
                    'Content-Type': "multipart/form-data",
                },
            });
            console.log('Story created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating story:', error);
            throw error;
        }
    },

    getStories: async (page: number = 1, perPage: number = 10, userId?: string): Promise<GetStoriesResponse> => {
        try {
            const params: any = { page, per_page: perPage };
            if (userId) {
                params.user_id = userId;
            }
            const response = await apiClient.get('/api/stories/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching stories:', error);
            throw error;
        }
    },

    toggleStoryLike: async (storyId: number, userId: string): Promise<StoryLikeResponse> => {
        try {
            const response = await apiClient.post(`/api/stories/${storyId}/like`, { userId });
            return response.data;
        } catch (error) {
            console.error('Error toggling story like:', error);
            throw error;
        }
    },

    getStoryLikes: async (storyId: number): Promise<GetStoryLikesResponse> => {
        try {
            const response = await apiClient.get(`/api/stories/${storyId}/likes`);
            return response.data;
        } catch (error) {
            console.error('Error fetching story likes:', error);
            throw error;
        }
    },

    getStoryComments: async (storyId: number, page: number = 1, perPage: number = 20): Promise<StoryCommentResponse> => {
        try {
            const response = await apiClient.get(`/api/stories/${storyId}/comments`, {
                params: { page, per_page: perPage }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching story comments:', error);
            throw error;
        }
    },

    addStoryComment: async (storyId: number, content: string, userId: number): Promise<any> => {
        try {
            const response = await apiClient.post(`/api/stories/${storyId}/comments`, { content, userId });
            return response.data;
        } catch (error) {
            console.error('Error adding story comment:', error);
            throw error;
        }
    },

    deleteStoryComment: async (storyId: number, commentId: number): Promise<void> => {
        try {
            await apiClient.delete(`/api/stories/${storyId}/comments/${commentId}`);
        } catch (error) {
            console.error('Error deleting story comment:', error);
            throw error;
        }
    },
};
