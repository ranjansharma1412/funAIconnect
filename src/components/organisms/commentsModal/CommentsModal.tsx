import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { commentService, Comment } from '../../../services/commentService';
import { storyService } from '../../../services/storyService';
import CommentItem from '../../molecules/commentItem/CommentItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from './CommentsModalStyle';

interface CommentsModalProps {
    visible: boolean;
    onClose: () => void;
    postId?: number | null;
    storyId?: number | null;
    currentUserId?: number; // Pass this if available
    onCommentAdded?: (id: number, type: 'post' | 'story') => void;
    onCommentDeleted?: (id: number, type: 'post' | 'story') => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ visible, onClose, postId, storyId, currentUserId, onCommentAdded, onCommentDeleted }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const insets = useSafeAreaInsets();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchComments = useCallback(async (reset = false) => {
        if (!postId && !storyId) return;

        if (reset) {
            setIsLoading(true);
            setPage(1);
        }

        try {
            const currentPage = reset ? 1 : page;
            let response;
            
            if (postId) {
                response = await commentService.getComments(postId, currentPage);
            } else if (storyId) {
                response = await storyService.getStoryComments(storyId, currentPage);
            }

            if (!response) return;

            if (reset) {
                setComments(response.comments);
            } else {
                setComments(prev => [...prev, ...response.comments]);
            }

            setHasMore(response.has_next);
            if (!reset) {
                setPage(prev => prev + 1);
            } else {
                setPage(2);
            }

        } catch (error) {
            console.error('Failed to load comments', error);
            // Optionally show error toast
        } finally {
            setIsLoading(false);
        }
    }, [postId, storyId, page]);

    useEffect(() => {
        if (visible && (postId || storyId)) {
            fetchComments(true);
        } else {
            setComments([]);
            setNewComment('');
        }
    }, [visible, postId, storyId]);

    const handleAddComment = async () => {
        if (!newComment.trim() || (!postId && !storyId)) return;

        if (!currentUserId) {
            Alert.alert('Error', 'You must be logged in to comment.');
            return;
        }

        setIsPosting(true);
        try {
            let addedComment;
            if (postId) {
                addedComment = await commentService.addComment(postId, newComment.trim(), currentUserId);
                if (onCommentAdded) onCommentAdded(postId, 'post');
            } else if (storyId) {
                addedComment = await storyService.addStoryComment(storyId, newComment.trim(), currentUserId);
                if (onCommentAdded) onCommentAdded(storyId, 'story');
            }
            
            if (addedComment) {
                setComments(prev => [addedComment, ...prev]);
                setNewComment('');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to post comment. Please try again.');
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!postId && !storyId) return;

        Alert.alert(
            'Delete Comment',
            'Are you sure you want to delete this comment?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (postId) {
                                await commentService.deleteComment(postId, commentId);
                                if (onCommentDeleted) onCommentDeleted(postId, 'post');
                            } else if (storyId) {
                                await storyService.deleteStoryComment(storyId, commentId);
                                if (onCommentDeleted) onCommentDeleted(storyId, 'story');
                            }
                            setComments(prev => prev.filter(c => c.id !== commentId));
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete comment.');
                        }
                    },
                },
            ]
        );
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            fetchComments();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerIndicator} />
                        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Comments</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Comments List */}
                    {isLoading && comments.length === 0 ? (
                        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
                    ) : (
                        <FlatList
                            data={comments}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <CommentItem
                                    comment={item}
                                    onDelete={handleDeleteComment}
                                    currentUserId={currentUserId}
                                />
                            )}
                            onEndReached={loadMore}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            ListEmptyComponent={
                                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            }
                        />
                    )}

                    {/* Input Area */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                    >
                        <View style={[styles.inputContainer, { borderTopColor: theme.colors.border, paddingBottom: Math.max(insets.bottom, 10) }]}>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.colors.card,
                                        color: theme.colors.text,
                                    }
                                ]}
                                placeholder="Add a comment..."
                                placeholderTextColor={theme.colors.textSecondary}
                                value={newComment}
                                onChangeText={setNewComment}
                                multiline
                            />
                            <TouchableOpacity
                                onPress={handleAddComment}
                                disabled={!newComment.trim() || isPosting}
                                style={[styles.sendButton, { opacity: !newComment.trim() || isPosting ? 0.5 : 1 }]}
                            >
                                {isPosting ? (
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                ) : (
                                    <Ionicons name="send" size={24} color={theme.colors.primary} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </Modal>
    );
};

export default CommentsModal;
