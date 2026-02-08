import React from 'react';
import { View, StyleSheet, FlatList, StatusBar, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import DashboardHeader from '../../components/molecules/DashboardHeader';
import StoriesRail from '../../components/organisms/StoriesRail';
import PostCard from '../../components/organisms/PostCard';
import StatusViewerModal from '../../components/organisms/StatusViewerModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './DashboardScreenStyle';

// Dummy Data
const STORIES_DATA = [
    { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?u=1', isLive: false },
    { id: '2', name: 'Irma', image: 'https://i.pravatar.cc/150?u=2', isLive: true },
    { id: '3', name: 'Amanda', image: 'https://i.pravatar.cc/150?u=3', isLive: true },
    { id: '4', name: 'John', image: 'https://i.pravatar.cc/150?u=4', isLive: false },
    { id: '5', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=5', isLive: false },
];

const POSTS_DATA = [
    {
        id: '1',
        userName: 'Amanda Johnson',
        userHandle: '@mandaj',
        userImage: 'https://i.pravatar.cc/150?u=3',
        isVerified: true,
        postImage: 'https://picsum.photos/500/500?random=1',
        likes: 120,
    },
    {
        id: '2',
        userName: 'Irma Flores',
        userHandle: '@irma_f',
        userImage: 'https://i.pravatar.cc/150?u=2',
        isVerified: false,
        postImage: 'https://picsum.photos/500/500?random=2',
        likes: 85,
    },
    {
        id: '3',
        userName: 'John Doe',
        userHandle: '@johnd',
        userImage: 'https://i.pravatar.cc/150?u=4',
        isVerified: true,
        postImage: 'https://picsum.photos/500/500?random=3',
        likes: 342,
    },
];

const DashboardScreen: React.FC = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    // Status Viewer State
    const [isStatusModalVisible, setIsStatusModalVisible] = React.useState(false);
    const [selectedStatusUserIndex, setSelectedStatusUserIndex] = React.useState(0);

    // Prepare mock stories data
    const userStories = React.useMemo(() => {
        return STORIES_DATA.map((user, index) => ({
            id: user.id,
            username: user.name,
            avatar: user.image,
            stories: [
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
    }, []);

    const handleStoryPress = (id: string, index: number) => {
        setSelectedStatusUserIndex(index);
        setIsStatusModalVisible(true);
    };

    const renderHeader = () => (
        <StoriesRail data={STORIES_DATA} onPressItem={handleStoryPress} />
    );

    const renderItem = ({ item }: { item: typeof POSTS_DATA[0] }) => (
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
                <FlatList
                    data={POSTS_DATA}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                />
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
