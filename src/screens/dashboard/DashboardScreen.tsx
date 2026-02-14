import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import DashboardHeader from '../../components/molecules/DashboardHeader';
import StoriesRail from '../../components/organisms/StoriesRail';
import PostCard from '../../components/organisms/PostCard';
import StatusViewerModal from '../../components/organisms/StatusViewerModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './DashboardScreenStyle';
import { postService, Post } from '../../services/postService';

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

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Status Viewer State
    const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
    const [selectedStatusUserIndex, setSelectedStatusUserIndex] = React.useState(0);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await postService.getPosts();
            console.log('Posts:', response.posts);
            setPosts(response.posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            // Alert.alert(t('common.error'), t('dashboard.fetch_error'));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [t]);

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
        />
    );

    return (
        <View style={[styles.safeArea, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <DashboardHeader />

                {/* FlatList for optimize scrolling */}
                {isLoading && !isRefreshing ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
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
                        ListEmptyComponent={
                            <View style={{ padding: 20, alignItems: 'center' }}>
                                <ActivityIndicator size="small" color={theme.colors.textSecondary} />
                            </View>
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
            />
        </View>
    );
};

export default DashboardScreen;
