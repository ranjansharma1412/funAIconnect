import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ImageBackground, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './ChatScreenStyle';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatBubble, { MessageProps } from '../../components/organisms/chatBubble/ChatBubble';
import ChatInput from '../../components/organisms/chatInput/ChatInput';
import socketService from '../../services/SocketService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { API_CONFIG } from '../../services/apiClient';

const API_URL = API_CONFIG.BASE_URL

type RootStackParamList = {
    Chat: { chatId: string; userId: string; userName: string; userImage: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
    navigation: NativeStackNavigationProp<any>;
    route: ChatScreenRouteProp;
}
const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
    const { userName, userImage } = route.params || {
        userName: 'Alex Johnson',
        userImage: 'https://picsum.photos/id/1025/150/150'
    };

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [messages, setMessages] = useState<MessageProps[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<MessageProps | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState({ currentTime: 0, seekableDuration: 0 });

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id?.toString();
    const flashListRef = useRef<any>(null);

    const friendId = route.params?.userId || '2'; // Ensure friend ID falls back if missing

    React.useEffect(() => {
        if (!currentUserId || !friendId) return;

        setPage(1);
        setHasMore(true);
        setMessages([]);

        socketService.connect(currentUserId);
        socketService.joinChat(currentUserId, friendId);

        const fetchInitialHistory = async () => {
            try {
                const res = await fetch(`${API_URL}/api/chat/${friendId}/messages?user_id=${currentUserId}&page=1&limit=20`);
                const data = await res.json();
                if (data.messages) {
                    const mapped = data.messages.map((m: any) => ({
                        id: String(m.id),
                        text: m.text,
                        type: m.mediaType || 'text',
                        time: m.time || '00:00',
                        isOwnMessage: String(m.senderId) === currentUserId,
                        status: m.status,
                        mediaUrl: m.mediaUrl
                    })).reverse();
                    
                    setMessages(mapped);
                    if (data.messages.length < 20) {
                        setHasMore(false);
                    }
                }
            } catch (e) {
                console.log('Error fetching history:', e);
            }
        };
        fetchInitialHistory();

        socketService.onReceiveMessage((m: any) => {
            const incomingMsg: MessageProps = {
                id: String(m.id),
                text: m.text,
                type: m.mediaType || 'text',
                time: m.time || 'Just now',
                isOwnMessage: String(m.senderId) === currentUserId,
                status: m.status,
                mediaUrl: m.mediaUrl
            };
            
            setMessages(prev => {
                 if (prev.some(p => p.id === String(m.id))) return prev;
                 return [incomingMsg, ...prev];
            });

            // Send read receipt if received msg isn't our own
            if (String(m.senderId) !== currentUserId) {
                socketService.readMessage({ messageId: m.id, userId: currentUserId, friendId });
            }
        });

        socketService.onMessageStatusUpdate((data: any) => {
            setMessages(prev => prev.map(msg => msg.id === data.messageId ? { ...msg, status: data.status as any } : msg));
        });

        return () => {
            socketService.leaveChat(currentUserId, friendId);
        };
    }, [currentUserId, friendId]);

    const loadMoreMessages = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        try {
            const nextPage = page + 1;
            const res = await fetch(`${API_URL}/api/chat/${friendId}/messages?user_id=${currentUserId}&page=${nextPage}&limit=20`);
            const data = await res.json();
            if (data.messages && data.messages.length > 0) {
                const mapped = data.messages.map((m: any) => ({
                    id: String(m.id),
                    text: m.text,
                    type: m.mediaType || 'text',
                    time: m.time || '00:00',
                    isOwnMessage: String(m.senderId) === currentUserId,
                    status: m.status,
                    mediaUrl: m.mediaUrl
                })).reverse();
                
                let uniqueCount = 0;
                setMessages(prev => {
                    const existingIds = new Set(prev.map(msg => msg.id));
                    const uniqueMapped = mapped.filter((msg: any) => !existingIds.has(msg.id));
                    uniqueCount = uniqueMapped.length;
                    return [...prev, ...uniqueMapped];
                });
                
                if (uniqueCount === 0 || data.messages.length < 20) {
                    setHasMore(false);
                } else {
                    setPage(nextPage);
                }
            } else {
                setHasMore(false);
            }
        } catch (e) {
            console.log('Error fetching more history:', e);
        } finally {
            setIsLoadingMore(false);
        }
    };

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSend = (text: string) => {
        console.log('Sending message:', text);
        socketService.sendMessage({
            userId: currentUserId || '',
            friendId: friendId,
            text,
            mediaType: 'text'
        });
    };

    const uploadMedia = async (uri: string, type: string) => {
        const formData = new FormData();
        formData.append('file', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            type: type || 'image/jpeg',
            name: `upload_${Date.now()}.${type?.includes('video') ? 'mp4' : 'jpg'}`
        } as any);

        const res = await fetch(`${API_URL}/api/chat/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const data = await res.json();
        if (data.url) return data.url;
        throw new Error('Upload failed');
    };

    const handleAttachCamera = async () => {
        try {
            const result = await launchCamera({ mediaType: 'mixed', cameraType: 'back' });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;

                const uploadedUrl = await uploadMedia(asset.uri, asset.type || 'image/jpeg');

                socketService.sendMessage({
                    userId: currentUserId || '',
                    friendId: friendId,
                    mediaUrl: uploadedUrl,
                    mediaType: asset.type?.includes('video') ? 'video' : 'image'
                });
            }
        } catch (error) {
            console.log('Camera Error: ', error);
        }
    };

    const handleAttachGallery = async () => {
        try {
            const result = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 1 });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;

                const uploadedUrl = await uploadMedia(asset.uri, asset.type || 'image/jpeg');

                socketService.sendMessage({
                    userId: currentUserId || '',
                    friendId: friendId,
                    mediaUrl: uploadedUrl,
                    mediaType: asset.type?.includes('video') ? 'video' : 'image'
                });
            }
        } catch (error) {
            console.log('Gallery Error: ', error);
        }
    };

    const handleAttachDocument = async () => {
        Alert.alert('Not Supported', 'Document picking is temporarily disabled due to library incompatibility.');
    };

    const handleLongPressMsg = (msg: MessageProps) => {
        if (!msg.isOwnMessage || msg.status === 'deleted') return;

        Alert.alert(
            'Delete Message',
            'Do you want to delete this message for everyone?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const res = await fetch(`${API_URL}/api/chat/messages/${msg.id}?user_id=${currentUserId}`, { method: 'DELETE' });
                            if (res.ok) {
                                setMessages((prev) =>
                                    prev.map(m => m.id === msg.id ? { ...m, status: 'deleted', text: undefined, mediaUrl: undefined } : m)
                                );
                            }
                        } catch (e) { console.log(e) }
                    }
                }
            ]
        );
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to clear all messages in this chat?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => setMessages([])
                }
            ]
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={28} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.headerProfile}>
                <FastImage source={{ uri: userImage }} style={styles.avatar as any} />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerName}>{userName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="call-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="videocam-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleClearHistory}>
                    <Icon name="trash-outline" size={24} color={theme.colors.accentRed} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={styles.safeArea}>
                {renderHeader()}

                <ImageBackground
                    source={{ uri: 'https://user-images.githubusercontent.com/15071540/59552788-37227300-8fa1-11e9-89d5-db22bfcc37ac.png' }}
                    style={{ flex: 1 }}
                    imageStyle={{ opacity: theme.mode === 'dark' ? 0.15 : 0.4 }}
                    resizeMode="repeat"
                >
                    <FlashList
                        ref={flashListRef}
                        data={messages}
                        inverted={true}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ChatBubble message={item} onLongPress={handleLongPressMsg} onPressMedia={(msg) => {
                                setSelectedMedia(msg);
                                if (msg.type === 'video') {
                                    setIsPlaying(true);
                                    setProgress({ currentTime: 0, seekableDuration: 0 });
                                }
                            }} />
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMoreMessages}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => isLoadingMore ? <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginVertical: 10 }} /> : null}
                        ListEmptyComponent={() => (
                            <View style={[styles.emptyStateContainer, { transform: [{ scaleY: -1 }] }]}>
                                <Text style={styles.emptyStateText}>Say hi to {userName}!</Text>
                            </View>
                        )}
                    />
                </ImageBackground>

                <ChatInput
                    onSend={handleSend}
                    onAttachCamera={handleAttachCamera}
                    onAttachGallery={handleAttachGallery}
                    onAttachDocument={handleAttachDocument}
                />
            </SafeAreaView>

            <Modal
                visible={!!selectedMedia}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedMedia(null)}
            >
                <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 }}
                        onPress={() => setSelectedMedia(null)}
                    >
                        <Icon name="close" size={32} color="#FFF" />
                    </TouchableOpacity>

                    {selectedMedia?.type === 'image' && (
                        <FastImage
                            source={{ uri: selectedMedia.mediaUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    )}
                    {selectedMedia?.type === 'video' && (
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
                            <Video
                                source={{ uri: selectedMedia.mediaUrl! }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="contain"
                                controls={false}
                                repeat={false}
                                paused={!isPlaying}
                                ignoreSilentSwitch="ignore"
                                onProgress={(data) => setProgress({ currentTime: data.currentTime, seekableDuration: data.seekableDuration })}
                                onEnd={() => setIsPlaying(false)}
                            />

                            {/* Custom Video Controls */}
                            <View style={{ position: 'absolute', bottom: Platform.OS === 'ios' ? 50 : 30, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.65)', padding: 15, borderRadius: 12 }}>
                                <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
                                    <Icon name={isPlaying ? "pause" : "play"} size={26} color="#FFF" />
                                </TouchableOpacity>

                                <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 15, borderRadius: 2 }}>
                                    <View style={{
                                        width: `${progress.seekableDuration > 0 ? (progress.currentTime / progress.seekableDuration) * 100 : 0}%`,
                                        height: '100%',
                                        backgroundColor: theme.colors.primary,
                                        borderRadius: 2
                                    }} />
                                </View>

                                <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600' }}>
                                    {formatTime(progress.currentTime)} / {formatTime(progress.seekableDuration)}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default ChatScreen;
