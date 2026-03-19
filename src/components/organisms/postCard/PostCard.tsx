import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, StyleProp, ViewStyle, Modal, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../../../theme/ThemeContext';
import Avatar from '../../atoms/avatar/Avatar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';
import { BlurView } from '@react-native-community/blur';
import { createStyles } from './PostCardStyle';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native';
import GradientHeartIcon from '../../atoms/gradientHeartIcon/GradientHeartIcon';

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
    const navigation = useNavigation<any>();

    const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
    const [headerLayout, setHeaderLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const heartBeatAnim = useRef(new Animated.Value(0)).current;
    const lastTap = useRef<number | null>(null);
    const headerWrapperRef = useRef<View>(null);

    // Default processing code...
    const validPostImage = postImage || 'https://via.placeholder.com/500?text=No+Image';
    const validUserImage = userImage || 'https://i.pravatar.cc/300';

    const triggerHeartBeat = () => {
        Animated.sequence([
            Animated.timing(heartBeatAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(heartBeatAnim, {
                toValue: 0,
                duration: 200,
                delay: 400,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
            triggerHeartBeat();
            if (!hasLiked && onLikePress) {
                onLikePress();
            }
        } else {
            lastTap.current = now;
        }
    };

    const handleLikeButtonPress = () => {
        if (!hasLiked) {
            triggerHeartBeat(); // Only animate if we are liking it, not unliking
        }
        if (onLikePress) {
            onLikePress();
        }
    };

    const openExpandedHeader = () => {
        if (headerWrapperRef.current) {
            headerWrapperRef.current.measure((fx, fy, width, height, px, py) => {
                setHeaderLayout({ x: px, y: py, width, height });
                setIsHeaderExpanded(true);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }
    };

    const closeExpandedHeader = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setIsHeaderExpanded(false));
    };

    const handleGlassHeaderClick = () => {
        closeExpandedHeader();
        navigation.navigate('FriendCircle', { initialTab: 1 });
    };

    const renderCollapsedHeader = () => (
        <View style={styles.collapsedHeaderContainer}>
            <TouchableOpacity style={styles.moreButton} onPress={openExpandedHeader}>
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );

    const renderExpandedHeader = () => {
        const headerContent = (
            <TouchableOpacity activeOpacity={0.9} onPress={handleGlassHeaderClick} style={styles.glassHeaderInner}>
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
                <TouchableOpacity style={styles.moreButton} onPress={closeExpandedHeader}>
                    <Ionicons name="ellipsis-vertical" size={20} color="white" />
                </TouchableOpacity>
            </TouchableOpacity>
        );

        let glassBackground;
        if (Platform.OS === 'ios' && isLiquidGlassSupported) {
            const LiquidGlassViewAny = LiquidGlassView as any;
            glassBackground = (
                <LiquidGlassViewAny
                    style={[styles.glassHeaderContainer, { width: headerLayout.width }]}
                    blurRadius={15}
                    glassColor="rgba(255, 255, 255, 0.2)"
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.3)"
                >
                    {headerContent}
                </LiquidGlassViewAny>
            );
        } else {
            glassBackground = (
                <View style={[styles.glassHeaderContainer, { width: headerLayout.width }]}>
                    <BlurView
                        blurType="light"
                        blurAmount={20}
                        reducedTransparencyFallbackColor="white"
                        overlayColor='transparent'
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.androidGlassOverlay} />
                    {headerContent}
                </View>
            );
        }

        return (
            <Modal transparent visible={isHeaderExpanded} animationType="none">
                <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
                    <BlurView
                        blurType="dark"
                        blurAmount={5}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <TouchableOpacity 
                        style={StyleSheet.absoluteFillObject} 
                        activeOpacity={1} 
                        onPress={closeExpandedHeader} 
                    />
                    <Animated.View style={[
                        styles.expandedHeaderWrapper,
                        {
                            top: headerLayout.y,
                            left: headerLayout.x,
                            width: headerLayout.width,
                            opacity: fadeAnim,
                            transform: [
                                { scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }
                            ]
                        }
                    ]}>
                        {glassBackground}
                    </Animated.View>
                </Animated.View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.mediaContainer, customMediaContainerStyle]}>
                <TouchableWithoutFeedback onPress={handleDoubleTap}>
                    <View>
                        <FastImage
                            source={{ uri: validPostImage }}
                            style={styles.postImage}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                </TouchableWithoutFeedback>

                <Animated.View style={[
                    StyleSheet.absoluteFillObject,
                    { justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 5 },
                    {
                        opacity: heartBeatAnim.interpolate({
                            inputRange: [0, 0.2, 1],
                            outputRange: [0, 1, 1]
                        }),
                        transform: [{
                            scale: heartBeatAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0, 1.2, 1]
                            })
                        }]
                    }
                ]}>
                    <GradientHeartIcon size={100} />
                </Animated.View>

                <View style={styles.headerWrapper} ref={headerWrapperRef}>
                    {isShowHeaderView ? renderCollapsedHeader() : null}
                </View>
                {isShowHeaderView && renderExpandedHeader()}

                <View style={styles.footerOverlay}>
                    <View style={styles.actionRow}>
                        {/* Split into two separate touchables wrapped in view */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15 }}>
                            <TouchableOpacity style={{ padding: 5 }} onPress={handleLikeButtonPress}>
                                {hasLiked ? (
                                    <GradientHeartIcon size={26} />
                                ) : (
                                    <Ionicons name="heart-outline" size={26} color="white" />
                                )}
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
