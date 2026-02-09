import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../atoms/Avatar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';
import { BlurView } from '@react-native-community/blur';

const { width } = Dimensions.get('window');

interface PostCardProps {
    userImage: string;
    userName: string;
    userHandle: string;
    isVerified?: boolean;
    postImage: string;
    likes?: number; // Optional statistic for display
}

const PostCard: React.FC<PostCardProps> = ({
    userImage,
    userName,
    userHandle,
    isVerified = false,
    postImage
}) => {
    const { theme } = useTheme();
    // Fallback for null/undefined postImage to prevent crash and show placeholder
    const validPostImage = postImage || 'https://via.placeholder.com/500?text=No+Image';

    const renderGlassHeader = () => {
        const headerContent = (
            <View style={styles.glassHeaderInner}>
                <View style={styles.userInfo}>
                    <Avatar source={{ uri: userImage }} size={40} />
                    <View style={styles.textContainer}>
                        <View style={styles.nameRow}>
                            <Text style={styles.glassName}>
                                {userName}
                            </Text>
                            {isVerified && (
                                <Ionicons name="checkmark-circle" size={16} color={theme.colors.accentBlue} style={styles.verifiedIcon} />
                            )}
                        </View>
                        <Text style={styles.glassHandle}>
                            {userHandle}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="white" />
                </TouchableOpacity>
            </View>
        );

        if (Platform.OS === 'ios' && isLiquidGlassSupported) {
            return (
                <LiquidGlassView
                    style={styles.glassHeaderContainer}
                    blurRadius={15}
                    glassColor="rgba(255, 255, 255, 0.2)"
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.3)"
                >
                    {headerContent}
                </LiquidGlassView>
            );
        }

        return (
            <View style={styles.glassHeaderContainer}>
                <BlurView
                    // style={StyleSheet.absoluteFill}
                    blurType="light"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="white"
                    overlayColor='transparent'
                />
                {/* Semi-transparent background for Android fallback/overlay effect */}
                <View style={styles.androidGlassOverlay} />
                {headerContent}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.mediaContainer}>
                <Image
                    source={{ uri: validPostImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                {/* Floating Glass Header */}
                <View style={styles.headerWrapper}>
                    {renderGlassHeader()}
                </View>

                {/* Bottom Actions & Caption */}
                <View style={styles.footerOverlay}>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="heart-outline" size={26} color="white" />
                            <Text style={styles.actionText}>1.2k</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="chatbubble-outline" size={24} color="white" />
                            <Text style={styles.actionText}>342</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="share-outline" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.caption} numberOfLines={2}>
                        <Text style={styles.captionName}>{userName} </Text>
                        Exploring the beautiful streets of downtown! 📸 #citylife #photography
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
        borderRadius: 32, // High border radius from design
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        backgroundColor: 'transparent', // Let image define shape
    },
    mediaContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: width * 1.2, // Taller aspect ratio
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    headerWrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    glassHeaderContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        // Common styles for both implementations
        ...(Platform.OS === 'android' && {
            backgroundColor: 'rgba(255,255,255,0.15)', // Fallback tint
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
        })
    },
    androidGlassOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    glassHeaderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    glassName: {
        fontWeight: '700',
        fontSize: 16,
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    verifiedIcon: {
        marginLeft: 4,
    },
    glassHandle: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    moreButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    footerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 24,
        zIndex: 10,
        // Gradient simulation since we replaced the gradient package text
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 15,
    },
    caption: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 14,
        lineHeight: 20,
    },
    captionName: {
        fontWeight: 'bold',
        color: 'white',
    }
});

export default PostCard;
