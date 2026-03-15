import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './ChatListScreenStyle';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/atoms/avatar/Avatar';
import socketService from '../../services/SocketService';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';

interface Props {
    navigation: NativeStackNavigationProp<any>;
}

interface ChatPreview {
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
}

const DUMMY_CHATS: ChatPreview[] = [
    {
        id: '1',
        userId: 'u1',
        userName: 'Alex Johnson',
        userImage: 'https://picsum.photos/id/1025/150/150',
        lastMessage: 'Hey! Are we still on for tomorrow?',
        time: '14:20',
        unreadCount: 2,
        isOnline: true,
    },
    {
        id: '2',
        userId: 'u2',
        userName: 'Maria Garcia',
        userImage: 'https://picsum.photos/id/1027/150/150',
        lastMessage: 'Sent an attachment',
        time: 'Yesterday',
        unreadCount: 0,
        isOnline: false,
    },
    {
        id: '3',
        userId: 'u3',
        userName: 'David Smith',
        userImage: 'https://picsum.photos/id/1011/150/150',
        lastMessage: 'Sounds good to me. See you then.',
        time: 'Mon',
        unreadCount: 0,
        isOnline: true,
    },
];

const ChatListScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id?.toString();

    React.useEffect(() => {
        if (!currentUserId) return;
        
        socketService.connect(currentUserId);
        
        const fetchConversations = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chat/conversations?user_id=${currentUserId}`);
                const data = await res.json();
                if (data.conversations) {
                    const formattedChats = data.conversations.map((conv: any) => {
                        // determine who the friend is
                        const friendStr = String(conv.user1.id) === currentUserId ? conv.user2 : conv.user1;
                        return {
                            id: String(conv.id),
                            userId: String(friendStr.id),
                            userName: friendStr.fullName || friendStr.username,
                            userImage: friendStr.userImage || 'https://picsum.photos/id/1025/150/150', // placeholder
                            lastMessage: conv.latestMessage?.text || (conv.latestMessage?.mediaType ? `Sent a ${conv.latestMessage.mediaType}` : 'No messages yet'),
                            time: conv.latestMessage?.time || 'Just now',
                            unreadCount: 0, // Compute if tracked
                            isOnline: false 
                        };
                    });
                    setChats(formattedChats);
                }
            } catch(e) {
                console.log('Error fetching convos', e);
            }
        };
        
        // Initial fetch
        fetchConversations();
        
        // Real-time update listener
        socketService.onChatListUpdate((conv: any) => {
             const friendStr = String(conv.user1.id) === currentUserId ? conv.user2 : conv.user1;
             const updatedChat = {
                 id: String(conv.id),
                 userId: String(friendStr.id),
                 userName: friendStr.fullName || friendStr.username,
                 userImage: friendStr.userImage || 'https://picsum.photos/id/1025/150/150',
                 lastMessage: conv.latestMessage?.text || (conv.latestMessage?.mediaType ? `Sent a ${conv.latestMessage.mediaType}` : 'No messages yet'),
                 time: conv.latestMessage?.time || 'Just now',
                 unreadCount: 0,
                 isOnline: false 
             };
             
             setChats(prev => {
                 const exists = prev.find(c => c.id === updatedChat.id);
                 if (exists) {
                     return prev.map(c => c.id === updatedChat.id ? {...c, lastMessage: updatedChat.lastMessage, time: updatedChat.time} : c);
                 }
                 return [updatedChat, ...prev];
             });
        });

    }, [currentUserId]);

    const filteredChats = chats.filter(chat =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatPress = (chat: ChatPreview) => {
        navigation.navigate('Chat', {
            chatId: chat.id,
            userId: chat.userId,
            userName: chat.userName,
            userImage: chat.userImage
        });
    };

    const renderItem = ({ item }: { item: ChatPreview }) => (
        <TouchableOpacity
            style={styles.chatItemContainer}
            onPress={() => handleChatPress(item)}
            activeOpacity={0.7}
        >
            <View>
                <Avatar source={{ uri: item.userImage }} size={56} style={styles.avatar} />
                {item.isOnline && (
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 8,
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: '#4CAF50',
                        borderWidth: 2,
                        borderColor: theme.colors.background,
                    }} />
                )}
            </View>
            <View style={styles.chatInfoContainer}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.userName}</Text>
                    <Text style={[styles.chatTime, item.unreadCount > 0 && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                        {item.time}
                    </Text>
                </View>
                <View style={styles.chatMessageRow}>
                    <Text style={[styles.chatMessage, item.unreadCount > 0 && { color: theme.colors.text, fontWeight: '500' }]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back" size={28} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chats</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="create-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search messages..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredChats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.emptyStateText}>No conversations found.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

export default ChatListScreen;
