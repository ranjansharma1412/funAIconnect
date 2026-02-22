import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FriendCircleScreenStyles';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../../components/atoms/Avatar';
import TextButton from '../../components/atoms/button/TextButton';
import PostCard from '../../components/organisms/PostCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    mockFriendRequests,
    mockFriendSuggestions,
    mockFriends,
    mockMyPosts,
    UserProfile,
    FriendRequest
} from './mockData';

const { width } = Dimensions.get('window');

const FriendCircleScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    // 0 = Discover, 1 = Friends, 2 = My Posts
    const [activeTab, setActiveTab] = useState(0);

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

    const renderDiscoverUser = ({ item, isRequest }: { item: UserProfile | FriendRequest, isRequest: boolean }) => (
        <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
            <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
                {item.mutualFriends ? (
                    <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>
                        {item.mutualFriends} mutual friends
                    </Text>
                ) : (
                    <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>{item.handle}</Text>
                )}
            </View>
            {isRequest ? (
                <View style={styles.actionButtons}>
                    <TextButton
                        title="Accept"
                        onPress={() => { }}
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
                        onPress={() => { }}
                        style={styles.smallButton}
                    />
                </View>
            )}
        </View>
    );

    const renderDiscoverTab = () => {
        const data = [
            { type: 'header', title: 'Friend Requests' },
            ...mockFriendRequests,
            { type: 'header', title: 'Suggestions For You' },
            ...mockFriendSuggestions
        ];

        return (
            <FlatList
                data={data}
                keyExtractor={(item, index) => (item as any).id ? (item as any).id.toString() : `header-${index}`}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    if ((item as any).type === 'header') {
                        return <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{(item as any).title}</Text>;
                    }
                    const isReq = (item as any).status === 'pending';
                    return renderDiscoverUser({ item: item as any, isRequest: isReq });
                }}
            />
        );
    };

    const renderFriendsTab = () => (
        <FlatList
            data={mockFriends}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
                <View style={[styles.userCard, { backgroundColor: theme.colors.card }]}>
                    <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>{item.handle}</Text>
                    </View>
                    <TouchableOpacity style={styles.actionButtons}>
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            )}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No friends yet.</Text>
                </View>
            }
        />
    );

    const renderMyPostsTab = () => (
        <FlatList
            data={mockMyPosts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.postsListContent}
            renderItem={({ item }) => (
                <PostCard
                    userName={item.userName}
                    userHandle={item.userHandle}
                    userImage={item.userImage}
                    isVerified={item.isVerified}
                    postImage={item.postImage}
                    likes={item.likes}
                    hasLiked={item.hasLiked}
                    commentsCount={item.commentsCount}
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
