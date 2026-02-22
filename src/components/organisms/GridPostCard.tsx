import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const GRID_SPACING = 12;
// Calculate size for 2 columns with spacing
const ITEM_WIDTH = (width - (GRID_SPACING * 3)) / 2;
// Taller aspect ratio for attractive posts
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

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

const styles = StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        marginHorizontal: GRID_SPACING / 2,
        marginBottom: GRID_SPACING,
        position: 'relative',
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        overflow: 'hidden',
        // Shadow for premium look
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        paddingTop: 30, // Gradients stretch up for smooth transition
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    descriptionText: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 12,
        lineHeight: 16,
    },
    shareButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        // Match the Share icon container from Dashboard more closely
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default GridPostCard;
