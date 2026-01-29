import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaViewBase, StatusBar, Platform } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import DashboardHeader from '../../components/molecules/DashboardHeader';
import StoriesRail from '../../components/organisms/StoriesRail';
import PostCard from '../../components/organisms/PostCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

    return (
        <View style={[styles.safeArea, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {/* Header */}
                <DashboardHeader />

                {/* Scrollable Content */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Stories */}
                    <StoriesRail data={STORIES_DATA} />

                    {/* Posts */}
                    <View style={styles.feedContainer}>
                        {POSTS_DATA.map((post) => (
                            <PostCard
                                key={post.id}
                                userName={post.userName}
                                userHandle={post.userHandle}
                                userImage={post.userImage}
                                isVerified={post.isVerified}
                                postImage={post.postImage}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80, // Space for Bottom Tab Bar
    },
    feedContainer: {
        marginTop: 10,
    },
});

export default DashboardScreen;
