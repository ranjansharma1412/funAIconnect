import React, { useState, useEffect, useCallback } from 'react';
import { View, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../theme/ThemeContext';
import DashboardHeader from '../../components/molecules/dashboardHeader/DashboardHeader';
import StoriesRail from '../../components/organisms/storiesRail/StoriesRail';
import PostCard from '../../components/organisms/postCard/PostCard';
import StatusViewerModal from '../../components/organisms/statusViewerModal/StatusViewerModal';
import CommentsModal from '../../components/organisms/commentsModal/CommentsModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './DashboardScreenStyle';
import { postService, Post } from '../../services/postService';
import { commentService } from '../../services/commentService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setDashboardPosts, appendDashboardPosts, updatePost, removePost } from '../../store/slices/postSlice';
import { sharePost } from '../../utils/shareUtils';
import EmptyPostsState from '../../components/molecules/emptyPostsState/EmptyPostsState';
import { storyService } from '../../services/storyService';

// Dummy Stories Data (Removed, using dynamic API)

import { useTranslation } from 'react-i18next';

// ... imports

const DashboardScreen: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch<AppDispatch>();
    const posts = useSelector((state: RootState) => state.posts.dashboardPosts);
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    // Status Viewer State
    const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
    const [selectedStatusUserIndex, setSelectedStatusUserIndex] = React.useState(0);

    // Comments Modal State
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const fetchDashboardData = useCallback(async () => {
        try {
            const currentUserId = user?.id ? String(user.id) : undefined;
            // Fetch posts and stories concurrently
            const [postsResponse, storiesResponse] = await Promise.all([
                postService.getPosts(1, 10, currentUserId),
                storyService.getStories(1, 10, currentUserId)
            ]);

            console.log('Posts:', postsResponse.posts);
            console.log('Stories:', storiesResponse.stories);

            dispatch(setDashboardPosts(postsResponse.posts));
            setStories(storiesResponse.stories);
            setPage(1);
            setHasNextPage(postsResponse.has_next);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Alert.alert(t('common.error'), t('dashboard.fetch_error'));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t, user?.id, dispatch]);

    const loadMorePosts = useCallback(async () => {
        if (!hasNextPage || isFetchingMore || isLoading || isRefreshing) return;

        try {
            setIsFetchingMore(true);
            const currentUserId = user?.id ? String(user.id) : undefined;
            const nextPage = page + 1;
            const postsResponse = await postService.getPosts(nextPage, 10, currentUserId);

            dispatch(appendDashboardPosts(postsResponse.posts));
            setPage(nextPage);
            setHasNextPage(postsResponse.has_next);
        } catch (error) {
            console.error('Failed to load more posts:', error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [hasNextPage, isFetchingMore, isLoading, isRefreshing, page, user?.id, dispatch]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchDashboardData();
    }, [fetchDashboardData]);

    const userStories = React.useMemo(() => {
        return stories.map((group) => {
            const u = user as any;
            const isCurrentUser = u && (u.username === group.id || u.handle === group.id);
            return {
                id: group.id,
                username: isCurrentUser ? t('dashboard.you') : group.name,
                avatar: group.image || 'https://via.placeholder.com/150',
                stories: group.stories.map((s: any) => ({
                    ...s,
                    date: s.createdAt // Assuming backend returns createdAt
                }))
            };
        });
    }, [stories, user, t]);

    const handleStoryPress = (id: string, index: number) => {
        setSelectedStatusUserIndex(index);
        setIsStatusModalVisible(true);
    };

    const handleCommentPress = (postId: number) => {
        setSelectedPostId(postId);
        setIsCommentsVisible(true);
    };

    const handleSharePress = async (post: Post) => {
        await sharePost({
            message: `${post.description}\n\nCheck out this post on BeeGather!`,
            url: post.postImage, // iOS supports url
            title: 'Share Post', // Android
        });
    };

    const handleLikePress = async (post: Post) => {
        if (!user || (!user.id && !user.token)) {
            // User needs to be logged in to like posts
            Alert.alert(t('common.error', 'Error'), t('auth.login_required', 'You must be logged in to like posts.'));
            return;
        }

        const currentUserId = String(user.id);

        // 1. Optimistic UI update
        const originalPost = posts.find(p => p.id === post.id);
        const isCurrentlyLiked = originalPost?.hasLiked || false;
        const newLikesCount = isCurrentlyLiked ? Math.max(0, (originalPost?.likes || 0) - 1) : (originalPost?.likes || 0) + 1;

        dispatch(updatePost({
            id: post.id,
            hasLiked: !isCurrentlyLiked,
            likes: newLikesCount
        }));

        // 2. Make API Call
        try {
            const response = await postService.toggleLike(post.id, currentUserId);

            // 3. Sync strictly with server response just in case
            dispatch(updatePost({
                id: post.id,
                hasLiked: response.liked,
                likes: response.likes
            }));
        } catch (error) {
            // 4. Revert UI on failure
            console.error('Failed to toggle like:', error);

            if (originalPost) {
                dispatch(updatePost({
                    id: post.id,
                    hasLiked: originalPost.hasLiked,
                    likes: originalPost.likes
                }));
            }

            Alert.alert(t('common.error', 'Error'), t('api.something_went_wrong', 'Could not process like action.'));
        }
    };

    const handleCommentAdded = useCallback((id: number, type: 'post' | 'story') => {
        if (type !== 'post') return;
        const post = posts.find(p => p.id === id);
        if (post) {
            dispatch(updatePost({
                id: id,
                commentsCount: (post.commentsCount || 0) + 1
            }));
        }
    }, [dispatch, posts]);

    const handleCommentDeleted = useCallback((id: number, type: 'post' | 'story') => {
        if (type !== 'post') return;
        const post = posts.find(p => p.id === id);
        if (post) {
            dispatch(updatePost({
                id: id,
                commentsCount: Math.max(0, (post.commentsCount || 0) - 1)
            }));
        }
    }, [dispatch, posts]);

    const handleDeletePost = useCallback((post: Post) => {
        Alert.alert(
            t('post.delete_title', 'Delete Post'),
            t('post.delete_confirm', 'Are you sure you want to delete this post?'),
            [
                { text: t('common.cancel', 'Cancel'), style: 'cancel' },
                {
                    text: t('common.delete', 'Delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await postService.deletePost(post.id);
                            dispatch(removePost(post.id));
                        } catch (error) {
                            Alert.alert(t('common.error', 'Error'), t('post.delete_failed', 'Failed to delete post'));
                        }
                    }
                }
            ]
        );
    }, [t, dispatch]);

    const localizedStoriesData = React.useMemo(() => {
        return stories.map(group => {
            const u = user as any;
            const isCurrentUser = u && (u.username === group.id || u.handle === group.id);
            return {
                id: group.id,
                name: isCurrentUser ? t('dashboard.you') : group.name,
                image: group.image || 'https://via.placeholder.com/150',
                isLive: group.isLive
            };
        });
    }, [stories, user, t]);

    const renderHeader = () => {
        if (!stories || stories.length === 0) {
            return null; // Return nothing if no stories
        }
        return (
            <StoriesRail data={localizedStoriesData} onPressItem={handleStoryPress} />
        );
    };

    // ... renderItem and return

    const renderItem = ({ item }: { item: Post }) => (
        <PostCard
            userName={item.userName}
            userHandle={item.userHandle}
            userImage={item.userImage}
            isVerified={item.isVerified}
            postImage={item.postImage}
            likes={item.likes}
            hasLiked={item.hasLiked}
            commentsCount={item.commentsCount}
            onLikePress={() => handleLikePress(item)}
            onCommentPress={() => handleCommentPress(item.id)}
            onSharePress={() => handleSharePress(item)}
            onDeletePress={
                user && ((user as any).username === item.userHandle || (user as any).handle === item.userHandle)
                    ? () => handleDeletePost(item)
                    : undefined
            }
        />
    );

    return (
        <View style={[styles.safeArea, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <DashboardHeader />

                {/* FlatList for optimize scrolling */}
                {isLoading && !isRefreshing ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
                ) : (
                    <FlashList
                        data={posts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        ListHeaderComponent={renderHeader}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                                tintColor={theme.colors.primary}
                                colors={[theme.colors.primary]}
                            />
                        }
                        ListEmptyComponent={<EmptyPostsState />}
                        onEndReached={loadMorePosts}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingMore ? (
                                <View style={{ padding: 16 }}>
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>

            {/* Status Viewer Modal */}
            <StatusViewerModal
                visible={isStatusModalVisible}
                userStories={userStories}
                initialUserIndex={selectedStatusUserIndex}
                onClose={() => setIsStatusModalVisible(false)}
                onStoryDeleted={() => {
                    // Refresh data after a story is deleted
                    fetchDashboardData();
                }}
            />

            {/* Comments Modal */}
            <CommentsModal
                visible={isCommentsVisible}
                onClose={() => setIsCommentsVisible(false)}
                postId={selectedPostId}
                currentUserId={user ? parseInt(user.id) : undefined}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
            />
        </View>
    );
};

export default DashboardScreen;
