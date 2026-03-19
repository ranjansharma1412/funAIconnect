import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createStyles } from './ChatBubbleStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme/ThemeContext';
import Video from 'react-native-video';

export type MessageType = 'text' | 'image' | 'video';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'deleted';

export interface MessageProps {
    id: string;
    text?: string;
    type: MessageType;
    mediaUrl?: string;
    time: string;
    isOwnMessage: boolean;
    status: MessageStatus;
}

interface ChatBubbleProps {
    message: MessageProps;
    onLongPress?: (msg: MessageProps) => void;
    onPressMedia?: (msg: MessageProps) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onLongPress, onPressMedia }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [isLoading, setIsLoading] = useState(true);

    const isDeleted = message.status === 'deleted';

    const getStatusIcon = () => {
        if (!message.isOwnMessage || isDeleted) return null;
        switch (message.status) {
            case 'sent':
                return <Icon name="checkmark" size={14} color="rgba(255, 255, 255, 0.7)" style={styles.statusIcon} />;
            case 'delivered':
                return <Icon name="checkmark-done" size={14} color="rgba(255, 255, 255, 0.7)" style={styles.statusIcon} />;
            case 'read':
                return <Icon name="checkmark-done" size={14} color={theme.colors.primaryGradient[1]} style={styles.statusIcon} />;
            default:
                return null;
        }
    };

    const renderDeletedPlaceholder = () => (
        <View style={[styles.messageContainer, message.isOwnMessage ? styles.ownMessage : styles.otherMessage, styles.deletedContainer]}>
            <Text style={[styles.text, styles.deletedText]}>
                <Icon name="ban-outline" size={14} /> This message was deleted.
            </Text>
        </View>
    );

    const renderMedia = () => {
        if (!message.mediaUrl) return null;

        if (message.type === 'image') {
            return (
                <TouchableOpacity activeOpacity={0.9} onPress={() => onPressMedia?.(message)} style={styles.mediaSkeleton}>
                    {isLoading && (
                        <View style={[styles.skeletonOverlay, { backgroundColor: theme.colors.skeletonBackground }]}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    )}
                    <FastImage 
                        source={{ uri: message.mediaUrl }} 
                        style={styles.image as any} 
                        resizeMode={FastImage.resizeMode.cover} 
                        onLoadStart={() => setIsLoading(true)}
                        onLoadEnd={() => setIsLoading(false)}
                    />
                </TouchableOpacity>
            );
        }

        if (message.type === 'video') {
            return (
                <TouchableOpacity activeOpacity={0.9} onPress={() => onPressMedia?.(message)} style={[styles.videoContainer, isLoading && { backgroundColor: theme.colors.skeletonBackground }]}>
                    {isLoading && (
                        <View style={styles.skeletonOverlay}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    )}
                    <View pointerEvents="none" style={[styles.image, { overflow: 'hidden', borderRadius: 16 }]}>
                        <Video 
                            source={{ uri: message.mediaUrl! }} 
                            style={styles.image} 
                            resizeMode="cover"
                            paused={true}
                            muted={true}
                            onLoadStart={() => setIsLoading(true)}
                            onReadyForDisplay={() => setIsLoading(false)}
                            onLoad={() => setIsLoading(false)}
                            onError={() => setIsLoading(false)}
                        />
                    </View>
                    <View style={styles.playButton}>
                        <Icon name="play" size={24} color="#FFF" style={{ marginLeft: 4 }} />
                    </View>
                </TouchableOpacity>
            );
        }

        return null;
    };

    if (isDeleted) {
        return (
            <View style={styles.container}>
                {renderDeletedPlaceholder()}
            </View>
        );
    }

    const containerStyle: ViewStyle[] = [
        styles.messageContainer,
        message.isOwnMessage ? styles.ownMessage : styles.otherMessage
    ];

    const textStyle = [
        styles.text,
        message.isOwnMessage ? styles.ownText : styles.otherText
    ];

    const timeStyle = [
        styles.timeText,
        !message.isOwnMessage && { color: theme.colors.textSecondary }
    ];

    return (
        <TouchableOpacity
            style={styles.container}
            onLongPress={() => onLongPress && onLongPress(message)}
            delayLongPress={300}
            activeOpacity={0.8}
        >
            <View style={containerStyle as any}>
                {renderMedia()}
                {message.text ? <Text style={textStyle}>{message.text}</Text> : null}
                <View style={styles.timeContainer}>
                    <Text style={timeStyle}>{message.time}</Text>
                    {getStatusIcon()}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ChatBubble;
