import React, { useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStyles } from './PostDetailsScreenStyle';

import { Post, postService } from '../../services/postService';
import PostCard from '../../components/organisms/postCard/PostCard';
import CommentsModal from '../../components/organisms/commentsModal/CommentsModal';
import LikesModal from '../../components/organisms/likesModal/LikesModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const PostDetailsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();

    const { user } = useSelector((state: RootState) => state.auth);

    // Initial post passed from navigation params
    const initialPost = route.params?.post as Post;

    const [post, setPost] = useState<Post>(initialPost);

    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [isLikesVisible, setIsLikesVisible] = useState(false);

    if (!post) {
        return (
            <View style={[styles.safeArea, { paddingTop: insets.top, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.colors.text }}>Post not found.</Text>
            </View>
        );
    }

    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.replace('Main');
        }
    };

    const handleLikePress = async () => {
        if (!user || (!user.id && !user.token)) {
            Alert.alert(t('common.error', 'Error'), t('auth.login_required', 'You must be logged in to like posts.'));
            return;
        }

        const currentUserId = String(user.id);
        const isCurrentlyLiked = post.hasLiked;

        // 1. Optimistic UI update
        setPost(prev => ({
            ...prev,
            hasLiked: !isCurrentlyLiked,
            likes: isCurrentlyLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
        }));

        // 2. Make API Call
        try {
            const response = await postService.toggleLike(post.id, currentUserId);
            // 3. Sync strictly with server response just in case
            setPost(prev => ({
                ...prev,
                hasLiked: response.liked,
                likes: response.likes
            }));
        } catch (error) {
            // 4. Revert UI on failure
            console.error('Failed to toggle like:', error);
            setPost(prev => ({
                ...prev,
                hasLiked: isCurrentlyLiked,
                likes: isCurrentlyLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
            }));
            Alert.alert(t('common.error', 'Error'), t('api.something_went_wrong', 'Could not process like action.'));
        }
    };

    const handleCommentAdded = useCallback((postId: number) => {
        setPost(prev => ({
            ...prev,
            commentsCount: (prev.commentsCount || 0) + 1
        }));
    }, []);

    const handleCommentDeleted = useCallback((postId: number) => {
        setPost(prev => ({
            ...prev,
            commentsCount: Math.max(0, (prev.commentsCount || 0) - 1)
        }));
    }, []);

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('post.details_title', 'Post Details')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <View style={styles.postWrapper}>
                    <PostCard
                        userName={post.userName}
                        userHandle={post.userHandle}
                        userImage={post.userImage}
                        isVerified={post.isVerified}
                        postImage={post.postImage}
                        likes={post.likes}
                        hasLiked={post.hasLiked}
                        commentsCount={post.commentsCount}
                        onLikePress={handleLikePress}
                        onCommentPress={() => setIsCommentsVisible(true)}
                        onLikesCountPress={() => setIsLikesVisible(true)}
                        onSharePress={() => { }}
                        isShowHeaderView={false}
                        customMediaContainerStyle={styles.mediaContainer}
                    />
                </View>
            </ScrollView>

            <CommentsModal
                visible={isCommentsVisible}
                onClose={() => setIsCommentsVisible(false)}
                postId={post.id}
                currentUserId={user ? parseInt(user.id) : undefined}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
            />

            <LikesModal
                visible={isLikesVisible}
                onClose={() => setIsLikesVisible(false)}
                postId={post.id}
            />
        </View>
    );
};

export default PostDetailsScreen;
