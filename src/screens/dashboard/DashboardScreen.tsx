import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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

    const [posts, setPosts] = useState<Post[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

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

            setPosts(postsResponse.posts);
            setStories(storiesResponse.stories);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Alert.alert(t('common.error'), t('dashboard.fetch_error'));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t, user?.id]);

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
            message: `${post.description}\n\nCheck out this post on FunAIconnect!`,
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
        const originalPosts = [...posts];
        setPosts(prevPosts => prevPosts.map(p => {
            if (p.id === post.id) {
                const isCurrentlyLiked = p.hasLiked;
                return {
                    ...p,
                    hasLiked: !isCurrentlyLiked,
                    likes: isCurrentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1
                };
            }
            return p;
        }));

        // 2. Make API Call
        try {
            const response = await postService.toggleLike(post.id, currentUserId);

            // 3. Sync strictly with server response just in case
            setPosts(prevPosts => prevPosts.map(p => {
                if (p.id === post.id) {
                    return {
                        ...p,
                        hasLiked: response.liked,
                        likes: response.likes
                    };
                }
                return p;
            }));
        } catch (error) {
            // 4. Revert UI on failure
            console.error('Failed to toggle like:', error);
            setPosts(originalPosts);
            Alert.alert(t('common.error', 'Error'), t('api.something_went_wrong', 'Could not process like action.'));
        }
    };

    const handleCommentAdded = useCallback((postId: number) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId
                ? { ...post, commentsCount: (post.commentsCount || 0) + 1 }
                : post
        ));
    }, []);

    const handleCommentDeleted = useCallback((postId: number) => {
        setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId
                ? { ...post, commentsCount: Math.max(0, (post.commentsCount || 0) - 1) }
                : post
        ));
    }, []);

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
                    <FlatList
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
                    />
                )}
            </View>

            {/* Status Viewer Modal */}
            <StatusViewerModal
                visible={isStatusModalVisible}
                userStories={userStories}
                initialUserIndex={selectedStatusUserIndex}
                onClose={() => setIsStatusModalVisible(false)}
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
