import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ImageBackground, Modal } from 'react-native';
import { launchCamera, launchImageLibrary, MediaType } from 'react-native-image-picker';
import Video from 'react-native-video';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './ChatScreenStyle';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatBubble, { MessageProps } from '../../components/organisms/chatBubble/ChatBubble';
import ChatInput from '../../components/organisms/chatInput/ChatInput';

type RootStackParamList = {
    Chat: { chatId: string; userId: string; userName: string; userImage: string };
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface Props {
    navigation: NativeStackNavigationProp<any>;
    route: ChatScreenRouteProp;
}

const INITIAL_MESSAGES: MessageProps[] = [
    {
        id: '1',
        text: 'Hey there! How have you been?',
        type: 'text',
        time: '14:20',
        isOwnMessage: false,
        status: 'read',
    },
    {
        id: '2',
        text: 'I am doing great, thanks for asking!',
        type: 'text',
        time: '14:22',
        isOwnMessage: true,
        status: 'read',
    },
    {
        id: '3',
        type: 'image',
        mediaUrl: 'https://picsum.photos/id/1015/400/300',
        time: '14:23',
        isOwnMessage: false,
        status: 'read',
    },
    {
        id: '4',
        text: 'Wow, that looks amazing! Did you take that video?',
        type: 'text',
        time: '14:25',
        isOwnMessage: true,
        status: 'read',
    },
    {
        id: '5',
        type: 'video',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        time: '14:26',
        isOwnMessage: false,
        status: 'read',
    },
    {
        id: '6',
        text: 'Yeah, I just recorded it. Want me to send the original file?',
        type: 'text',
        time: '14:27',
        isOwnMessage: false,
        status: 'delivered',
    },
];

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
    const { userName, userImage } = route.params || {
        userName: 'Alex Johnson',
        userImage: 'https://picsum.photos/id/1025/150/150'
    };

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [messages, setMessages] = useState<MessageProps[]>(INITIAL_MESSAGES);
    const [selectedMedia, setSelectedMedia] = useState<MessageProps | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState({ currentTime: 0, seekableDuration: 0 });
    const flatListRef = useRef<FlatList>(null);

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds < 0) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSend = (text: string) => {
        const newMessage: MessageProps = {
            id: Date.now().toString(),
            text,
            type: 'text',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwnMessage: true,
            status: 'sent', // Initially sent
        };

        setMessages((prev) => [...prev, newMessage]);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        // Mock delivery/read status updates
        setTimeout(() => {
            setMessages((prev) =>
                prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg)
            );
            setTimeout(() => {
                setMessages((prev) =>
                    prev.map(msg => msg.id === newMessage.id ? { ...msg, status: 'read' } : msg)
                );
            }, 2000);
        }, 1000);
    };

    const handleAttachCamera = async () => {
        try {
            const result = await launchCamera({ mediaType: 'mixed', cameraType: 'back' });
            if (result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                const newMessage: MessageProps = {
                    id: Date.now().toString(),
                    type: asset.type?.includes('video') ? 'video' : 'image',
                    mediaUrl: asset.uri,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwnMessage: true,
                    status: 'sent',
                };
                setMessages((prev) => [...prev, newMessage]);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
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
                const newMessage: MessageProps = {
                    id: Date.now().toString(),
                    type: asset.type?.includes('video') ? 'video' : 'image',
                    mediaUrl: asset.uri,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwnMessage: true,
                    status: 'sent',
                };
                setMessages((prev) => [...prev, newMessage]);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            }
        } catch (error) {
            console.log('Gallery Error: ', error);
        }
    };

    const handleAttachDocument = async () => {
        Alert.alert('Not Supported', 'Document picking is temporarily disabled due to library incompatibility.');
    };

    // Note: in older react-native, 3 minutes is 3 * 60 * 1000 = 180,000ms. 
    // For static demo purposes, any "own" message that is not already deleted can be deleted.
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
                    onPress: () => {
                        setMessages((prev) =>
                            prev.map(m => m.id === msg.id ? { ...m, status: 'deleted', text: undefined, mediaUrl: undefined } : m)
                        );
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
                <Image source={{ uri: userImage }} style={styles.avatar} />
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
        <SafeAreaView style={styles.safeArea}>
            {renderHeader()}

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ImageBackground
                    source={{ uri: 'https://user-images.githubusercontent.com/15071540/59552788-37227300-8fa1-11e9-89d5-db22bfcc37ac.png' }}
                    style={{ flex: 1 }}
                    imageStyle={{ opacity: theme.mode === 'dark' ? 0.15 : 0.4 }}
                    resizeMode="repeat"
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
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
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                        ListEmptyComponent={() => (
                            <View style={styles.emptyStateContainer}>
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
            </KeyboardAvoidingView>

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
                        <Image
                            source={{ uri: selectedMedia.mediaUrl }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
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
        </SafeAreaView>
    );
};

export default ChatScreen;
