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
import { ImagesAssets } from '../../assets/images';
import { timeAgo } from '../../utils/dateUtils';

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
    const [friendStatus, setFriendStatus] = useState({ isOnline: false, lastSeen: null as string | null });

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

        socketService.onUserStatusUpdate((data) => {
            if (String(data.userId) === String(friendId)) {
                setFriendStatus({ isOnline: data.isOnline, lastSeen: data.lastSeen });
            }
        });

        socketService.checkOnlineStatus(friendId);

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
            const actualId = m.id ? String(m.id) : `sock_${Date.now()}_${Math.random()}`;
            const incomingMsg: MessageProps = {
                id: actualId,
                text: m.text,
                type: m.mediaType || 'text',
                time: m.time || 'Just now',
                isOwnMessage: String(m.senderId) === currentUserId,
                status: m.status || 'delivered',
                mediaUrl: m.mediaUrl
            };

            setMessages(prev => {
                if (incomingMsg.isOwnMessage) {
                    if (incomingMsg.type === 'text') {
                        const tempMessages = prev.filter(p => p.id.startsWith('temp_text_') && p.text === incomingMsg.text);
                        if (tempMessages.length > 0) {
                            const targetTempId = tempMessages[tempMessages.length - 1].id;
                            const newPrev = prev.filter(p => p.id !== targetTempId);

                            const existingIdx = newPrev.findIndex(p => p.id === actualId);
                            if (existingIdx !== -1) {
                                const copy = [...newPrev];
                                copy[existingIdx] = incomingMsg;
                                return copy;
                            }
                            return [incomingMsg, ...newPrev];
                        }
                    } else if (incomingMsg.type === 'image' || incomingMsg.type === 'video') {
                        const tempMessages = prev.filter(p => p.id.startsWith('temp_') && p.type === incomingMsg.type);
                        if (tempMessages.length > 0) {
                            const targetTempId = tempMessages[tempMessages.length - 1].id;
                            const newPrev = prev.filter(p => p.id !== targetTempId);

                            const existingIdx = newPrev.findIndex(p => p.id === actualId);
                            if (existingIdx !== -1) {
                                const copy = [...newPrev];
                                copy[existingIdx] = incomingMsg;
                                return copy;
                            }
                            return [incomingMsg, ...newPrev];
                        }
                    }
                }

                // Standard echo update or prepend
                const existingIndex = prev.findIndex(p => p.id === actualId);
                if (existingIndex !== -1) {
                    const copy = [...prev];
                    copy[existingIndex] = incomingMsg;
                    return copy;
                }

                return [incomingMsg, ...prev];
            });

            // Always scroll to end whenever ANY new message arrives
            setTimeout(() => flashListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);

            if (String(m.senderId) !== currentUserId) {
                // Send read receipt if received msg isn't our own
                socketService.readMessage({ messageId: m.id, userId: currentUserId, friendId });
            }
        });

        socketService.onMessageStatusUpdate((data: any) => {
            setMessages(prev => prev.map(msg => String(msg.id) === String(data.messageId) ? { ...msg, status: data.status as any } : msg));
        });

        // Add wildcard listener for 'message_deleted' just in case the backend uses a dedicated event
        if ((socketService as any).socket) {
            (socketService as any).socket.off('message_deleted');
            (socketService as any).socket.on('message_deleted', (data: any) => {
                setMessages(prev => prev.map(msg => String(msg.id) === String(data.messageId) ? { ...msg, status: 'deleted', text: undefined, mediaUrl: undefined } : msg));
            });
        }

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
        if (!text.trim()) return;

        const tempId = 'temp_text_' + Date.now();
        const now = new Date();
        const formattedTime = `${now.getHours() < 10 ? '0' : ''}${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

        const tempMsg: MessageProps = {
            id: tempId,
            text,
            type: 'text',
            time: formattedTime,
            isOwnMessage: true,
            status: 'sent',
            mediaUrl: undefined
        };

        setMessages(prev => [tempMsg, ...prev]);

        console.log('Sending message:', text);
        socketService.sendMessage({
            userId: currentUserId || '',
            friendId: friendId,
            text,
            mediaType: 'text'
        });
        setTimeout(() => flashListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);
    };

    const uploadMedia = async (uri: string, type: string | undefined, isVideo: boolean) => {
        const formData = new FormData();
        const fileType = type || (isVideo ? 'video/mp4' : 'image/jpeg');
        const extension = isVideo ? 'mp4' : 'jpg';

        formData.append('file', {
            uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
            type: fileType,
            name: `upload_${Date.now()}.${extension}`
        } as any);

        const res = await fetch(`${API_URL}/api/chat/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        const data = await res.json();
        let finalUrl = data.url;
        if (finalUrl && finalUrl.startsWith('http://')) {
            finalUrl = finalUrl.replace('http://', 'https://');
        }
        if (finalUrl) return finalUrl;
        throw new Error('Upload failed');
    };

    const processMediaUpload = async (asset: any) => {
        const isVideo = asset.type?.includes('video') || asset.uri?.endsWith('.mp4') || asset.uri?.endsWith('.mov');
        const mediaType = isVideo ? 'video' : 'image';
        const tempId = 'temp_' + Date.now();

        const tempMsg: MessageProps = {
            id: tempId,
            type: mediaType,
            time: 'Sending...',
            isOwnMessage: true,
            status: 'sending',
            mediaUrl: asset.uri
        };

        setMessages(prev => [tempMsg, ...prev]);
        setTimeout(() => flashListRef.current?.scrollToOffset({ offset: 0, animated: true }), 100);

        try {
            const uploadedUrl = await uploadMedia(asset.uri, asset.type, isVideo);

            const now = new Date();
            const formattedTime = `${now.getHours() < 10 ? '0' : ''}${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;

            // Update temp message with resulting URL and mark sent instantly
            setMessages(prev => prev.map(m => m.id === tempId ? {
                ...m,
                mediaUrl: uploadedUrl,
                status: 'sent',
                time: formattedTime
            } : m));

            socketService.sendMessage({
                userId: currentUserId || '',
                friendId: friendId,
                mediaUrl: uploadedUrl,
                mediaType: mediaType
            });
        } catch (error) {
            console.log('Upload/Send Error: ', error);
            setMessages(prev => prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m));
        }
    };

    const handleAttachCamera = async () => {
        try {
            const result = await launchCamera({
                mediaType: 'photo',
                cameraType: 'back',
                quality: 0.7,
                maxWidth: 1280,
                maxHeight: 1280
            });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;
                if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
                    Alert.alert('File Too Large', 'The selected file exceeds the 2MB limit after compression. Please choose a smaller file.');
                    return;
                }
                await processMediaUpload(asset);
            }
        } catch (error) {
            console.log('Camera Error: ', error);
        }
    };

    const handleAttachGallery = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'mixed',
                selectionLimit: 1,
                quality: 0.7,
                maxWidth: 1280,
                maxHeight: 1280,
                videoQuality: 'low'
            });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (!asset.uri) return;
                if (asset.fileSize && asset.fileSize > 2 * 1024 * 1024) {
                    Alert.alert('File Too Large', 'The selected file exceeds the 2MB limit after compression. Please choose a smaller file.');
                    return;
                }
                await processMediaUpload(asset);
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
                                // Attempt to force socket sync of deletion to the friend's side
                                if ((socketService as any).socket) {
                                    (socketService as any).socket.emit('message_status_update', { messageId: msg.id, status: 'deleted', friendId });
                                    (socketService as any).socket.emit('delete_message', { messageId: msg.id, userId: currentUserId, friendId });
                                }
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
            'Are you sure you want to clear all messages in this chat? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear locally immediately for responsive UI
                            setMessages([]);
                            // Hit backend to clear permanently
                            await fetch(`${API_URL}/api/chat/${friendId}/messages?user_id=${currentUserId}`, { method: 'DELETE' });
                        } catch (e) {
                            console.log('Error clearing history:', e);
                        }
                    }
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
                    <Text style={styles.headerName} numberOfLines={1} ellipsizeMode='tail'>{userName}</Text>
                    <Text style={styles.headerStatus}>
                        {friendStatus.isOnline ? 'Online' : (friendStatus.lastSeen ? `Last seen ${timeAgo(friendStatus.lastSeen)}` : 'Offline')}
                    </Text>
                </View>
            </View>

            <View style={styles.headerActions}>
                {/* Audio/Video Call features disabled for future implementation
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="call-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="videocam-outline" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
                */}
                <TouchableOpacity style={styles.actionButton} onPress={handleClearHistory}>
                    <Icon name="trash-outline" size={24} color={theme.colors.accentRed} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            <SafeAreaView style={styles.safeArea}>
                {renderHeader()}

                <ImageBackground
                    source={ImagesAssets.chat_image_bg_dark}
                    style={{ flex: 1 }}
                    imageStyle={{ opacity: theme.mode === 'dark' ? 0.15 : 0.4 }}
                // resizeMode="repeat"
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
