import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Platform, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import Avatar from '../../atoms/avatar/Avatar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';
import { BlurView } from '@react-native-community/blur';
import { createStyles } from './PostCardStyle';

const { width } = Dimensions.get('window');

interface PostCardProps {
    userImage: string;
    userName: string;
    userHandle: string;
    isVerified?: boolean;
    postImage: string;
    likes?: number;
    hasLiked?: boolean;
    commentsCount?: number;
    onCommentPress?: () => void;
    onSharePress?: () => void;
    onLikePress?: () => void;
    onLikesCountPress?: () => void;
    isShowHeaderView?: boolean;
    customMediaContainerStyle?: StyleProp<ViewStyle>;
}

const PostCard: React.FC<PostCardProps> = ({
    userImage,
    userName,
    userHandle,
    isVerified = false,
    postImage,
    likes = 0,
    hasLiked = false,
    onCommentPress,
    onSharePress,
    onLikePress,
    onLikesCountPress,
    commentsCount = 0,
    isShowHeaderView = true,
    customMediaContainerStyle
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    // Default processing code...
    const validPostImage = postImage || 'https://via.placeholder.com/500?text=No+Image';
    const validUserImage = userImage || 'https://i.pravatar.cc/300';

    const renderGlassHeader = () => {
        const headerContent = (
            <View style={styles.glassHeaderInner}>
                <View style={styles.userInfo}>
                    <Avatar source={{ uri: validUserImage }} size={40} />
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
            const LiquidGlassViewAny = LiquidGlassView as any;
            return (
                <LiquidGlassViewAny
                    style={styles.glassHeaderContainer}
                    blurRadius={15}
                    glassColor="rgba(255, 255, 255, 0.2)"
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.3)"
                >
                    {headerContent}
                </LiquidGlassViewAny>
            );
        }

        return (
            <View style={styles.glassHeaderContainer}>
                <BlurView
                    blurType="light"
                    blurAmount={20}
                    reducedTransparencyFallbackColor="white"
                    overlayColor='transparent'
                />
                <View style={styles.androidGlassOverlay} />
                {headerContent}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.mediaContainer, customMediaContainerStyle]}>
                <Image
                    source={{ uri: validPostImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                <View style={styles.headerWrapper}>
                    {isShowHeaderView ? renderGlassHeader() : null}
                </View>

                <View style={styles.footerOverlay}>
                    <View style={styles.actionRow}>
                        {/* Split into two separate touchables wrapped in view */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <TouchableOpacity style={{ padding: 5 }} onPress={onLikePress}>
                                <Ionicons
                                    name={hasLiked ? "heart" : "heart-outline"}
                                    size={26}
                                    color={hasLiked ? theme.colors.error : "white"}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingVertical: 5, paddingHorizontal: 2 }} onPress={onLikesCountPress}>
                                <Text style={styles.actionText}>{likes}</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={[styles.actionButton, { marginRight: 15 }]} onPress={onCommentPress}>
                            <Ionicons name="chatbubble-outline" size={24} color="white" />
                            {commentsCount > 0 && <Text style={styles.actionText}>{commentsCount}</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={onSharePress}>
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

export default PostCard;
