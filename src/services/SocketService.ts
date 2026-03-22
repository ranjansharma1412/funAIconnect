import { io, Socket } from 'socket.io-client';

// Use your computer's local IP Address mapped to the Flask port, example: 'http://192.168.1.x:5001'
// Since testing on Emulator, 10.0.2.2 usually maps to localhost on Android, and 'localhost' for iOS
import { Platform } from 'react-native';
import { API_CONFIG } from './apiClient';

const SOCKET_URL = API_CONFIG.BASE_URL

class SocketService {
    private socket: Socket | null = null;

    connect(userId: string) {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                query: { user_id: userId },
                transports: ['websocket'],
                autoConnect: true,
            });

            this.socket.on('connect', () => {
                console.log('Connected to Chat WebSocket:', this.socket?.id);
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from Chat WebSocket');
            });

            this.socket.on('error', (error) => {
                console.error('Socket Error:', error);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    joinChat(userId: string, friendId: string) {
        if (this.socket) {
            this.socket.emit('join_chat', { userId, friendId });
        }
    }

    leaveChat(userId: string, friendId: string) {
        if (this.socket) {
            this.socket.emit('leave_chat', { userId, friendId });
        }
    }

    sendMessage(data: { userId: string, friendId: string, text?: string, mediaUrl?: string, mediaType?: string }) {
        if (this.socket) {
            this.socket.emit('send_message', data);
        }
    }

    readMessage(data: { messageId: string, userId: string, friendId: string }) {
        if (this.socket) {
            this.socket.emit('read_message', data);
        }
    }

    onReceiveMessage(callback: (message: any) => void) {
        if (this.socket) {
            this.socket.off('receive_message'); // Prevent duplicate listeners
            this.socket.on('receive_message', callback);
        }
    }

    onMessageStatusUpdate(callback: (data: { messageId: string, status: string }) => void) {
        if (this.socket) {
            this.socket.off('message_status_update');
            this.socket.on('message_status_update', callback);
        }
    }

    onChatListUpdate(callback: (conversation: any) => void) {
        if (this.socket) {
            this.socket.off('chat_list_update');
            this.socket.on('chat_list_update', callback);
        }
    }

    checkOnlineStatus(friendId: string) {
        if (this.socket) {
            this.socket.emit('check_online_status', { friendId });
        }
    }

    onUserStatusUpdate(callback: (data: { userId: string, isOnline: boolean, lastSeen: string | null }) => void) {
        if (this.socket) {
            this.socket.off('user_status_update');
            this.socket.on('user_status_update', callback);
        }
    }
}

const socketService = new SocketService();
export default socketService;
