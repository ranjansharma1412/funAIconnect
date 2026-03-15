import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './ChatListScreenStyle';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../../components/atoms/avatar/Avatar';

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

    const filteredChats = DUMMY_CHATS.filter(chat =>
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
