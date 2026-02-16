import { apiClient } from './apiClient';

export interface Comment {
    id: number;
    postId: number;
    userId: number;
    userName: string;
    userHandle: string;
    userImage: string;
    content: string;
    createdAt: string;
}

export interface GetCommentsResponse {
    comments: Comment[];
    has_next: boolean;
    has_prev: boolean;
    total: number;
    pages: number;
}

export const commentService = {
    getComments: async (postId: number, page: number = 1, perPage: number = 20): Promise<GetCommentsResponse> => {
        try {
            const response = await apiClient.get(`/api/posts/${postId}/comments`, {
                params: {
                    page,
                    per_page: perPage,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    },

    addComment: async (postId: number, content: string, userId: number): Promise<Comment> => {
        try {
            const response = await apiClient.post(`/api/posts/${postId}/comments`, { content, userId });
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    deleteComment: async (postId: number, commentId: number): Promise<void> => {
        try {
            await apiClient.delete(`/api/posts/${postId}/comments/${commentId}`);
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    },
};
