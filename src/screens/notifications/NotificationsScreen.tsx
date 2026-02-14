import React, { useMemo } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import Button from '../../components/atoms/button/Button';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './NotificationsStyle';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Mock data
const NOTIFICATIONS_DATA = [
    {
        id: '1',
        type: 'follow',
        user: {
            name: 'Sarah Connor',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        message: 'started following you.',
        time: '2m ago',
        read: false,
    },
    {
        id: '2',
        type: 'like',
        user: {
            name: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        message: 'liked your post.',
        time: '15m ago',
        read: true,
        postImage: 'https://picsum.photos/200',
    },
    {
        id: '3',
        type: 'message',
        user: {
            name: 'Emily Blunt',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        },
        message: 'sent you a message: "Hey, check this out!"',
        time: '1h ago',
        read: false,
    },
    {
        id: '4',
        type: 'follow',
        user: {
            name: 'Michael Scott',
            avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
        },
        message: 'requested to follow you.',
        time: '2h ago',
        read: true,
        isRequest: true,
    },
    {
        id: '5',
        type: 'like',
        user: {
            name: 'Dwight Schrute',
            avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
        },
        message: 'liked your comment: "False. This is incorrect."',
        time: '3h ago',
        read: true,
    },
];

const NotificationsScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation();

    // Memoized localized data
    const notificationsData = useMemo(() => {
        return NOTIFICATIONS_DATA.map(item => {
            let message = item.message;
            if (item.type === 'follow' && !item.isRequest) message = t('notifications.followed_you');
            else if (item.type === 'like' && !item.message.includes('comment')) message = t('notifications.liked_post');
            else if (item.type === 'message') message = `${t('notifications.sent_message')} "..."`;
            else if (item.type === 'follow' && item.isRequest) message = t('notifications.requested_follow');
            else if (item.type === 'like' && item.message.includes('comment')) message = `${t('notifications.liked_comment')} "..."`;

            return { ...item, message };
        });
    }, [t]);

    const renderItem = ({ item }: { item: any }) => {
        const handlePress = () => {
            // Logic to handle item press, e.g., navigate to profile or post details
            console.log(`Pressed notification ${item.id}`);
            if (item.type === 'message') {
                // Navigate to chat
                console.log('Navigate to Chat');
            }
        };

        const handlePrimaryAction = () => {
            console.log(`Primary action for ${item.id}`);
        };

        const handleSecondaryAction = () => {
            console.log(`Secondary action for ${item.id}`);
        };

        return (
            <TouchableOpacity style={styles.notificationItem} onPress={handlePress} activeOpacity={0.7}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.topRow}>
                        <Text style={styles.messageText}>
                            <Text style={styles.boldText}>{item.user.name}</Text> {item.message}
                        </Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>

                    {/* Contextual Actions */}
                    {item.type === 'follow' && item.isRequest && (
                        <View style={styles.actionsContainer}>
                            <Button
                                title={t('notifications.confirm')}
                                onPress={handlePrimaryAction}
                                useGradient={false}
                                style={[styles.actionButton, styles.primaryButton]}
                                textStyle={styles.primaryButtonText}
                            />
                            <TouchableOpacity
                                style={[styles.actionButton, styles.secondaryButton]}
                                onPress={handleSecondaryAction}
                            >
                                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>{t('notifications.delete')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {item.type === 'follow' && !item.isRequest && (
                        <View style={styles.actionsContainer}>
                            <Button
                                title={t('notifications.follow_back')}
                                onPress={() => console.log('Follow back')}
                                useGradient={false}
                                style={[styles.actionButton, styles.primaryButton]}
                                textStyle={styles.primaryButtonText}
                            />
                        </View>
                    )}


                    {item.type === 'message' && (
                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.secondaryButton]}
                                onPress={() => console.log('Reply')}
                            >
                                <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>{t('notifications.reply')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {!item.read && <View style={styles.unreadIndicator} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} />
            <View style={styles.header}>
                <Text style={styles.title}>{t('notifications.title')}</Text>
            </View>
            <FlatList
                data={notificationsData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default NotificationsScreen;
