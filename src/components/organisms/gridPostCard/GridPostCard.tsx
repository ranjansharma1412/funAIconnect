import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { createStyles } from './GridPostCardStyle';
import { useTheme } from '../../../theme/ThemeContext';
import GradientHeartIcon from '../../atoms/gradientHeartIcon/GradientHeartIcon';

interface GridPostCardProps {
    postImage: string;
    likes?: number;
    commentsCount?: number;
    description?: string;
    hasLiked?: boolean;
    onPress?: () => void;
    onSharePress?: () => void;
    onDeletePress?: () => void;
}

const GridPostCard: React.FC<GridPostCardProps> = ({
    postImage,
    likes = 0,
    commentsCount = 0,
    description,
    hasLiked = false,
    onPress,
    onSharePress,
    onDeletePress
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const validPostImage = postImage || 'https://via.placeholder.com/500?text=No+Image';

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <FastImage
                source={{ uri: validPostImage }}
                style={styles.postImage as any}
                resizeMode={FastImage.resizeMode.cover}
            />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomOverlay}
            >
                <View style={styles.actionRow}>
                    <View style={styles.actionItem}>
                        {hasLiked ? (
                            <GradientHeartIcon size={18} />
                        ) : (
                            <Ionicons name="heart-outline" size={18} color="white" />
                        )}
                        <Text style={styles.actionText}>{likes}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Ionicons name="chatbubble-outline" size={16} color="white" />
                        <Text style={styles.actionText}>{commentsCount}</Text>
                    </View>
                </View>
                {description && (
                    <Text style={styles.descriptionText} numberOfLines={1} ellipsizeMode='tail'>
                        {description}
                    </Text>
                )}
            </LinearGradient>

            {/* Top Right Share Button matching Dashboard PostCard */}
            <View style={{ position: 'absolute', top: 12, right: 12, flexDirection: 'row' }}>
                {onDeletePress && (
                    <TouchableOpacity
                        style={[styles.shareButton, { position: 'relative', top: 0, right: 0, marginRight: 8 }]}
                        onPress={onDeletePress}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ff4444" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.shareButton, { position: 'relative', top: 0, right: 0 }]}
                    onPress={onSharePress}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="share-outline" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default GridPostCard;
