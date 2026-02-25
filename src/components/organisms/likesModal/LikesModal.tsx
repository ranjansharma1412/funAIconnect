import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './LikesModalStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { postService } from '../../../services/postService';
import Avatar from '../../atoms/avatar/Avatar';

interface LikesModalProps {
    visible: boolean;
    onClose: () => void;
    postId: number | null;
}

const LikesModal: React.FC<LikesModalProps> = ({ visible, onClose, postId }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    const [likesArray, setLikesArray] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLikes = useCallback(async () => {
        if (!postId) return;

        setIsLoading(true);
        try {
            const response = await postService.getPostLikes(postId);
            setLikesArray(response.likes);
        } catch (error) {
            console.error('Failed to load likes', error);
        } finally {
            setIsLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        if (visible && postId) {
            fetchLikes();
        } else {
            setLikesArray([]);
        }
    }, [visible, postId, fetchLikes]);

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerIndicator} />
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                {t('post.likes_title', 'Likes')}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => {
        return (
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {t('post.no_likes_yet', 'No likes yet. Be the first!')}
            </Text>
        );
    }

    const renderItem = ({ item }: { item: any }) => {
        const displayName = item.fullName || item.username;
        const displayHandle = `@${item.username}`;
        const isValidImage = item.userImage || 'https://i.pravatar.cc/150';

        return (
            <View style={styles.userCard}>
                <Avatar source={{ uri: isValidImage }} size={40} />
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.colors.text }]} numberOfLines={1}>
                        {displayName}
                    </Text>
                    <Text style={[styles.userHandle, { color: theme.colors.textSecondary }]}>
                        {displayHandle}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background, paddingBottom: insets.bottom }]}>
                    {renderHeader()}

                    {isLoading ? (
                        <ActivityIndicator style={styles.loader} size="large" color={theme.colors.primary} />
                    ) : (
                        <FlatList
                            data={likesArray}
                            keyExtractor={(item) => item.username || Math.random().toString()}
                            renderItem={renderItem}
                            contentContainerStyle={styles.listContent}
                            ListEmptyComponent={renderEmptyState}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default LikesModal;
