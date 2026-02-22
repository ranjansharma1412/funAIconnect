import { apiClient } from './apiClient';
import { UserProfile } from '../screens/friendCircle/mockData';

export interface FriendRequestDto {
    id: number;
    userId: number;
    friendId: number;
    status: 'pending' | 'accepted';
    createdAt: string;
    user: {
        id: number;
        username: string; // The backend uses username
        name: string; // Or name depending on your User model
        userImage?: string;
    };
    friend_user?: any;
}

export const friendService = {
    getFriendRequests: async (userId: string): Promise<FriendRequestDto[]> => {
        try {
            const response = await apiClient.get('/api/friends/requests', { params: { user_id: userId } });
            return response.data.requests || [];
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            throw error;
        }
    },

    getFriendSuggestions: async (userId: string): Promise<any[]> => {
        try {
            const response = await apiClient.get('/api/friends/suggestions', { params: { user_id: userId } });
            return response.data.suggestions || [];
        } catch (error) {
            console.error('Error fetching friend suggestions:', error);
            throw error;
        }
    },

    sendFriendRequest: async (userId: string, friendId: string): Promise<any> => {
        try {
            const response = await apiClient.post('/api/friends/request', { userId, friendId });
            return response.data;
        } catch (error) {
            console.error('Error sending friend request:', error);
            throw error;
        }
    },

    acceptFriendRequest: async (userId: string, requestId: string | number): Promise<any> => {
        try {
            const response = await apiClient.post('/api/friends/accept', { userId, requestId });
            return response.data;
        } catch (error) {
            console.error('Error accepting friend request:', error);
            throw error;
        }
    },

    getFriends: async (userId: string): Promise<any[]> => {
        try {
            const response = await apiClient.get('/api/friends', { params: { user_id: userId } });
            return response.data.friends || [];
        } catch (error) {
            console.error('Error fetching friends list:', error);
            throw error;
        }
    }
};
