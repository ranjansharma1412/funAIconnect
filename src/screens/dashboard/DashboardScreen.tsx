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

// Dummy Stories Data (Keep for now)
const STORIES_DATA = [
    { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?u=1', isLive: false },
    { id: '2', name: 'Irma', image: 'https://i.pravatar.cc/150?u=2', isLive: true },
    { id: '3', name: 'Amanda', image: 'https://i.pravatar.cc/150?u=3', isLive: true },
    { id: '4', name: 'John', image: 'https://i.pravatar.cc/150?u=4', isLive: false },
    { id: '5', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=5', isLive: false },
];

import { useTranslation } from 'react-i18next';

// ... imports

const DashboardScreen: React.FC = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { user } = useSelector((state: RootState) => state.auth);

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Status Viewer State
    const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
    const [selectedStatusUserIndex, setSelectedStatusUserIndex] = React.useState(0);

    // Comments Modal State
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    const fetchPosts = useCallback(async () => {
        try {
            const currentUserId = user?.id ? String(user.id) : undefined;
            const response = await postService.getPosts(1, 10, currentUserId);
            console.log('Posts:', response.posts);

            // Fetch comment counts for each post
            const postsWithComments = await Promise.all(
                response.posts.map(async (post) => {
                    try {
                        const commentsResponse = await commentService.getComments(post.id, 1, 1);
                        return { ...post, commentsCount: commentsResponse.total };
                    } catch (error) {
                        console.error(`Failed to fetch comments for post ${post.id}`, error);
                        return { ...post, commentsCount: 0 };
                    }
                })
            );

            setPosts(postsWithComments);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            // Alert.alert(t('common.error'), t('dashboard.fetch_error'));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t, user?.id]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchPosts();
    }, [fetchPosts]);

    // Prepare mock stories data
    const userStories = React.useMemo(() => {
        return STORIES_DATA.map((user, index) => ({
            id: user.id,
            username: user.name === 'You' ? t('dashboard.you') : user.name,
            avatar: user.image,
            stories: [
                // ... same stories structure
                {
                    id: `story-${user.id}-1`,
                    url: `https://picsum.photos/seed/${user.id}1/500/900`,
                    type: 'image' as const,
                    duration: 3000
                },
                {
                    id: `story-${user.id}-2`,
                    url: `https://picsum.photos/seed/${user.id}2/500/900`,
                    type: 'image' as const,
                    duration: 3000
                },
                {
                    id: `story-${user.id}-3`,
                    url: `https://picsum.photos/seed/${user.id}3/500/900`,
                    type: 'image' as const,
                    duration: 3000
                },
            ]
        }));
    }, [t]);

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

    // Need to pass localized data to StoriesRail too
    const localizedStoriesData = React.useMemo(() => {
        return STORIES_DATA.map(user => ({
            ...user,
            name: user.name === 'You' ? t('dashboard.you') : user.name,
        }));
    }, [t]);

    const renderHeader = () => (
        <StoriesRail data={localizedStoriesData} onPressItem={handleStoryPress} />
    );

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
            />
        </View>
    );
};

export default DashboardScreen;
