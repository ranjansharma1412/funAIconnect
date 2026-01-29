import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../atoms/Avatar';

const { width } = Dimensions.get('window');

interface PostCardProps {
    userImage: string;
    userName: string;
    userHandle: string;
    isVerified?: boolean;
    postImage: string;
    likes?: number; // Optional statistic for display
}

const PostCard: React.FC<PostCardProps> = ({
    userImage,
    userName,
    userHandle,
    isVerified = false,
    postImage
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar source={{ uri: userImage }} size={40} />
                    <View style={styles.textContainer}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.name, { color: theme.colors.text }]}>
                                {userName}
                            </Text>
                            {isVerified && (
                                <View style={styles.verifiedBadge}>
                                    <View style={[styles.verifiedCheck, { backgroundColor: theme.colors.accentBlue }]} />
                                </View>
                            )}
                        </View>
                        <Text style={[styles.handle, { color: theme.colors.textSecondary }]}>
                            {userHandle}
                        </Text>
                    </View>
                </View>
                {/* More Options Icon Placeholder */}
                <View style={styles.moreIcon}>
                    <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
                    <View style={[styles.dot, { backgroundColor: theme.colors.textSecondary }]} />
                </View>
            </View>

            {/* Media Content */}
            <View style={styles.mediaContainer}>
                <Image
                    source={{ uri: postImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            </View>

            {/* Actions / Footer (Simplified for design focus) */}
            <View style={styles.footer}>
                {/* Glassmorphism-like overlay effect would be here, implementing simple icons for now */}
                <View style={styles.actionRow}>
                    {/* Like Heart */}
                    <View style={[styles.actionIcon, { borderColor: theme.colors.text }]} />
                    {/* Comment Bubble */}
                    <View style={[styles.actionIcon, { borderColor: theme.colors.text, marginLeft: 15 }]} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        marginHorizontal: 16, // Inset cards
        borderRadius: 24,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 4,
    },
    verifiedBadge: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedCheck: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    handle: {
        fontSize: 13,
        marginTop: 2,
    },
    moreIcon: {
        flexDirection: 'row', // Horizontal dots
        width: 20,
        justifyContent: 'space-between',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    mediaContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
        aspectRatio: 1, // Square posts for clean look
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    footer: {
        marginTop: 15,
    },
    actionRow: {
        flexDirection: 'row',
    },
    actionIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
    }
});

export default PostCard;
