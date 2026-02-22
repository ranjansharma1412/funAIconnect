import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { createStyles } from './GridPostCardStyle';
import { useTheme } from '../../theme/ThemeContext';

interface GridPostCardProps {
    postImage: string;
    likes?: number;
    commentsCount?: number;
    description?: string;
    hasLiked?: boolean;
    onPress?: () => void;
    onSharePress?: () => void;
}

const GridPostCard: React.FC<GridPostCardProps> = ({
    postImage,
    likes = 0,
    commentsCount = 0,
    description,
    hasLiked = false,
    onPress,
    onSharePress
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
            <Image
                source={{ uri: validPostImage }}
                style={styles.postImage}
                resizeMode="cover"
            />

            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomOverlay}
            >
                <View style={styles.actionRow}>
                    <View style={styles.actionItem}>
                        <Ionicons
                            name={hasLiked ? "heart" : "heart-outline"}
                            size={18}
                            color={hasLiked ? "#ff4040" : "white"}
                        />
                        <Text style={styles.actionText}>{likes}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Ionicons name="chatbubble-outline" size={16} color="white" />
                        <Text style={styles.actionText}>{commentsCount}</Text>
                    </View>
                </View>
                {description && (
                    <Text style={styles.descriptionText} numberOfLines={2}>
                        {description}
                    </Text>
                )}
            </LinearGradient>

            {/* Top Right Share Button matching Dashboard PostCard */}
            <TouchableOpacity
                style={styles.shareButton}
                onPress={onSharePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="share-outline" size={20} color="white" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default GridPostCard;
