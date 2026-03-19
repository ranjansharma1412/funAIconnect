import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeContext';
// Reuse styling from general CommentsModal or similar if none exists
import { createStyles } from '../commentsModal/CommentsModalStyle'; // Reusing similar list style
import Ionicons from 'react-native-vector-icons/Ionicons';
import { storyService } from '../../../services/storyService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StoryLikesModalProps {
    visible: boolean;
    onClose: () => void;
    storyId: number | string | null;
}

const StoryLikesModal: React.FC<StoryLikesModalProps> = ({ visible, onClose, storyId }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();

    const [likes, setLikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible && storyId) {
            fetchLikes();
        } else {
            setLikes([]); // Clear when hidden
        }
    }, [visible, storyId]);

    const fetchLikes = async () => {
        if (!storyId) return;
        setLoading(true);
        try {
            // Need numeric ID for the API
            let numericId = storyId;
            if (typeof storyId === 'string' && storyId.startsWith('story-')) {
                numericId = parseInt(storyId.replace('story-', ''), 10);
            }
            const response = await storyService.getStoryLikes(Number(numericId));
            setLikes(response.likes || []);
        } catch (error) {
            console.error('Failed to fetch story likes:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const displayName = item.name || item.fullName || item.username;
        const displayHandle = `@${item.username}`;
        const isValidImage = item.userImage || 'https://i.pravatar.cc/150';

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                <FastImage source={{ uri: isValidImage }} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 } as any} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '600', color: theme.colors.text, fontSize: 16 }}>{displayName}</Text>
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 }}>{displayHandle}</Text>
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
                <View style={[styles.modalContainer, { paddingBottom: insets.bottom || 20, backgroundColor: theme.colors.background }]}>
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('story.likes', 'Likes')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                        </View>
                    ) : (
                        <FlatList
                            data={likes}
                            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                            ListEmptyComponent={
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
                                    <Text style={{ color: theme.colors.textSecondary }}>
                                        {t('story.no_likes_yet', 'No likes yet.')}
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default StoryLikesModal;
