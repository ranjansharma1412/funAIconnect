import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FlashList } from '@shopify/flash-list';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FriendCircleScreenStyles';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../components/atoms/avatar/Avatar';
import TextButton from '../../components/atoms/button/TextButton';
import PostCard from '../../components/organisms/postCard/PostCard';
import GridPostCard from '../../components/organisms/gridPostCard/GridPostCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { setMyPosts, removePost } from '../../store/slices/postSlice';
import { friendService, FriendRequestDto } from '../../services/friendService';
import { postService, Post } from '../../services/postService';
import { storyService } from '../../services/storyService';
import StoriesRail from '../../components/organisms/storiesRail/StoriesRail';
import StatusViewerModal, { UserStory } from '../../components/organisms/statusViewerModal/StatusViewerModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ActivityIndicator, Alert } from 'react-native';
import { sharePost } from '../../utils/shareUtils';
const { width } = Dimensions.get('window');

const FriendCircleScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();

    // 0 = Discover, 1 = Friends, 2 = My Posts
    const initialTabFromRoute = route.params?.initialTab !== undefined ? route.params.initialTab : 0;
    const [activeTab, setActiveTab] = useState(initialTabFromRoute);

    useEffect(() => {
        if (route.params?.initialTab !== undefined) {
            setActiveTab(route.params.initialTab);
        }
    }, [route.params?.initialTab]);


    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id?.toString();

    const [requests, setRequests] = useState<FriendRequestDto[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
    const [myStories, setMyStories] = useState<UserStory[]>([]);
    const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
    const dispatch = useDispatch<AppDispatch>();
    const myPosts = useSelector((state: RootState) => state.posts.myPosts);
    const [loading, setLoading] = useState(false);

    const fetchDiscoverData = useCallback(async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const [fetchedRequests, fetchedSuggestions, fetchedFriends] = await Promise.all([
                friendService.getFriendRequests(currentUserId),
                friendService.getFriendSuggestions(currentUserId),
                friendService.getFriends(currentUserId)
            ]);
            setRequests(fetchedRequests);
            setSuggestions(fetchedSuggestions);
            setFriends(fetchedFriends);
        } catch (error) {
            console.error('Failed to fetch API data for Discover tab', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    const fetchFriendsData = useCallback(async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const fetchedFriends = await friendService.getFriends(currentUserId);
            setFriends(fetchedFriends);
        } catch (error) {
            console.error('Failed to fetch API data for Friends tab', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId]);

    const fetchMyPostsData = useCallback(async () => {
        if (!currentUserId) return;
        setLoading(true);
        try {
            const [response, storiesResponse] = await Promise.all([
                postService.getUserPosts(currentUserId, 1, 50, currentUserId),
                storyService.getStories(1, 10, currentUserId)
            ]);
            dispatch(setMyPosts(response.posts));
            
            const u = currentUser as any;
            const myHandle = u?.username || u?.handle;
            const myGroup = storiesResponse.stories.find(g => g.id === myHandle) as any;
            if (myGroup) {
                // Ensure date property maps to createdAt for timeAgo calculation
                myGroup.stories = myGroup.stories.map((s: any) => ({ ...s, date: s.createdAt }));
                setMyStories([myGroup]);
            } else {
                setMyStories([]);
            }
        } catch (error) {
            console.error('Failed to fetch API data for My Posts tab', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId, currentUser, dispatch]);

    useEffect(() => {
        if (activeTab === 0) {
            fetchDiscoverData();
        } else if (activeTab === 1) {
            fetchFriendsData();
        } else if (activeTab === 2) {
            fetchMyPostsData();
        }
    }, [activeTab, fetchDiscoverData, fetchFriendsData, fetchMyPostsData]);

    const handleAcceptRequest = async (requestId: number) => {
        if (!currentUserId) return;
        try {
            await friendService.acceptFriendRequest(currentUserId, requestId);
            // Optimistic UI update: remove from requests list
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Failed to accept request', error);
        }
    };

    const handleAddFriend = async (friendId: string | number) => {
        if (!currentUserId) return;
        try {
            await friendService.sendFriendRequest(currentUserId, friendId.toString());
            // Optimistic UI update: remove from suggestions list
            setSuggestions(prev => prev.filter(sug => sug.id !== friendId));
        } catch (error) {
            console.error('Failed to send request', error);
        }
    };

    const renderTabs = () => (
        <View style={styles.tabsContainer}>
            {['Discover', 'Friends', 'My Posts'].map((tab, index) => (
                <TouchableOpacity
                    key={tab}
                    style={[
                        styles.tabButton,
                        activeTab === index && { borderBottomColor: theme.colors.primary, borderBottomWidth: 3 }
                    ]}
                    onPress={() => setActiveTab(index)}
                >
                    <Text style={[
                        styles.tabText,
                        { color: activeTab === index ? theme.colors.primary : theme.colors.textSecondary },
                    ]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderDiscoverUser = ({ item, isRequest }: { item: any, isRequest: boolean }) => {
        // Backend maps sender's details for requests inside 'user'
        const displayUser = isRequest ? item.user : item;
        const displayName = displayUser.name || displayUser.username;
        const displayHandle = `@${displayUser.username}`;
        const isValidImage = displayUser.userImage || 'https://i.pravatar.cc/150';

        return (
            <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
                <FastImage source={{ uri: isValidImage }} style={styles.userAvatar as any} />
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>{displayName}</Text>
                    {item.mutualFriends ? (
                        <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>
                            {item.mutualFriends} mutual friends
                        </Text>
                    ) : (
                        <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>{displayHandle}</Text>
                    )}
                </View>
                {isRequest ? (
                    <View style={styles.actionButtons}>
                        <TextButton
                            title="Accept"
                            onPress={() => handleAcceptRequest(item.id)}
                            style={styles.smallButton}
                        />
                        <TouchableOpacity style={styles.closeButton}>
                            <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.actionButtons}>
                        <TextButton
                            title="Add Friend"
                            onPress={() => handleAddFriend(displayUser.id)}
                            style={styles.smallButton}
                        />
                    </View>
                )}
            </View>
        );
    };

    const renderDiscoverTab = () => {
        const data = [];
        if (requests.length > 0) {
            data.push({ type: 'header', title: 'Friend Requests' });
            data.push(...requests.map(req => ({ ...req, isRequestObj: true })));
        }
        if (suggestions.length > 0) {
            data.push({ type: 'header', title: 'Suggestions For You' });
            data.push(...suggestions.map(sug => ({ ...sug, isRequestObj: false })));
        }

        if (loading && data.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Loading...</Text>
                </View>
            );
        }

        if (!loading && data.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No new discoveries at the moment.</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={data}
                keyExtractor={(item, index) => item.id ? item.id.toString() : `header-${index}`}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    if (item.type === 'header') {
                        return <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{item.title}</Text>;
                    }
                    return renderDiscoverUser({ item, isRequest: item.isRequestObj });
                }}
            />
        );
    };

    const renderFriendsTab = () => {
        if (loading && friends.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Loading...</Text>
                </View>
            );
        }

        return (
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const displayName = item.name || item.username;
                    const displayHandle = `@${item.username}`;
                    const isValidImage = item.userImage || 'https://i.pravatar.cc/150';

                    return (
                        <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
                            <FastImage source={{ uri: isValidImage }} style={styles.userAvatar as any} />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>{displayName}</Text>
                                <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>{displayHandle}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.actionButtons}
                                onPress={() => navigation.navigate('Chat', {
                                    chatId: '', // Chat ID will be resolved implicitly
                                    userId: item.id.toString(),
                                    userName: displayName,
                                    userImage: isValidImage
                                })}
                            >
                                <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    );
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No friends yet.</Text>
                    </View>
                }
            />
        );
    };

    const handleMyStoryPress = (id: string, index: number) => {
        setSelectedStoryIndex(index);
        setIsStoryModalVisible(true);
    };

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

    const renderMyPostsTab = () => {
        if (loading && myPosts.length === 0 && myStories.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            );
        }

        const myGroup = myStories.length > 0 ? myStories[0] : null;
        const railData = myGroup ? myGroup.stories.map((s: any, idx: number) => ({
             id: s.id,
             name: `Story ${idx + 1}`,
             image: s.url,
             isLive: true
        })) : [];

        const renderHeader = () => {
             if (railData.length > 0) {
                 return (
                     <View style={{ marginBottom: 16 }}>
                         <Text style={[styles.sectionHeader, { color: theme.colors.text, paddingHorizontal: 16, marginBottom: 8 }]}>My Stories</Text>
                         <StoriesRail data={railData} onPressItem={handleMyStoryPress} />
                     </View>
                 );
             }
             return null;
        };

        return (
            <>
                <FlashList
                    data={myPosts}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 4, paddingTop: 16 }}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                        <GridPostCard
                            postImage={item.postImage}
                            likes={item.likes}
                            commentsCount={item.commentsCount}
                            description={item.description}
                            hasLiked={item.hasLiked}
                            onPress={() => navigation.navigate('PostDetails', { post: item })}
                            onSharePress={async () => {
                                await sharePost({
                                    message: `${item.description}\n\nCheck out this post on BeeGather!`,
                                    url: item.postImage,
                                    title: 'Share Post',
                                });
                            }}
                            onDeletePress={
                                currentUser && ((currentUser as any).username === item.userHandle || (currentUser as any).handle === item.userHandle)
                                    ? () => handleDeletePost(item)
                                    : undefined
                            }
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No posts found.</Text>
                        </View>
                    }
                />
                
                <StatusViewerModal
                    visible={isStoryModalVisible}
                    userStories={myStories}
                    initialUserIndex={0}
                    initialStoryIndex={selectedStoryIndex}
                    onClose={() => setIsStoryModalVisible(false)}
                    onStoryDeleted={() => {
                        fetchMyPostsData();
                    }}
                />
            </>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {t('navigation.friendCircle', 'Friend Circle')}
                </Text>
            </View>

            {renderTabs()}

            <View style={styles.contentContainer}>
                {activeTab === 0 && renderDiscoverTab()}
                {activeTab === 1 && renderFriendsTab()}
                {activeTab === 2 && renderMyPostsTab()}
            </View>
        </View>
    );
};

export default FriendCircleScreen;
