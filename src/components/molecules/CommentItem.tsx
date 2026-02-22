import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../atoms/Avatar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Comment } from '../../services/commentService';
import { formatDistanceToNow } from 'date-fns';
import { styles } from './CommentItemStyle';

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: number) => void;
    currentUserId?: number; // verify if we can get this from a store or context
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete, currentUserId }) => {
    const { theme } = useTheme();
    const isOwner = currentUserId === comment.userId;

    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
        <View style={styles.container}>
            <Avatar source={{ uri: comment.userImage }} size={32} />
            <View style={styles.contentContainer}>
                <View style={styles.header}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>
                        {comment.userName}
                    </Text>
                    <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                        {timeAgo}
                    </Text>
                </View>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    {comment.content}
                </Text>
            </View>
            {isOwner && (
                <TouchableOpacity onPress={() => onDelete(comment.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CommentItem;
