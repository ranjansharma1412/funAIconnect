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
    createdAt: string;
}

export interface GetStoriesResponse {
    stories: Story[];
    has_next: boolean;
    has_prev: boolean;
    total: number;
    pages: number;
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
};
