import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FriendCircleScreenStyles';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../components/atoms/Avatar';
import TextButton from '../../components/atoms/button/TextButton';
import PostCard from '../../components/organisms/PostCard';
import GridPostCard from '../../components/organisms/GridPostCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { friendService, FriendRequestDto } from '../../services/friendService';
import { mockMyPosts } from './mockData';

const { width } = Dimensions.get('window');

const FriendCircleScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // 0 = Discover, 1 = Friends, 2 = My Posts
    const [activeTab, setActiveTab] = useState(0);

    const currentUser = useSelector((state: RootState) => state.auth.user);
    const currentUserId = currentUser?.id?.toString();

    const [requests, setRequests] = useState<FriendRequestDto[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [friends, setFriends] = useState<any[]>([]);
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

    useEffect(() => {
        if (activeTab === 0) {
            fetchDiscoverData();
        } else if (activeTab === 1) {
            fetchFriendsData();
        }
    }, [activeTab, fetchDiscoverData, fetchFriendsData]);

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
                <Image source={{ uri: isValidImage }} style={styles.userAvatar} />
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
                            <Image source={{ uri: isValidImage }} style={styles.userAvatar} />
                            <View style={styles.userInfo}>
                                <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>{displayName}</Text>
                                <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>{displayHandle}</Text>
                            </View>
                            <TouchableOpacity style={styles.actionButtons}>
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

    const renderMyPostsTab = () => (
        <FlatList
            data={mockMyPosts}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 4, paddingTop: 16 }}
            renderItem={({ item }) => (
                <GridPostCard
                    postImage={item.postImage}
                    likes={item.likes}
                    commentsCount={item.commentsCount}
                    description={item.description}
                    hasLiked={item.hasLiked}
                    onPress={() => { }}
                    onSharePress={() => { }}
                />
            )}
        />
    );

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
