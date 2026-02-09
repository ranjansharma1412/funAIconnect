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
    createdAt: string;
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

    getPosts: async (page: number = 1, perPage: number = 10): Promise<GetPostsResponse> => {
        try {
            const response = await apiClient.get('/api/posts/', {
                params: {
                    page,
                    per_page: perPage,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },
};
