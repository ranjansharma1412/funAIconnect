import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    StatusBar,
    TouchableWithoutFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { createStyles } from './StatusViewerModalStyle';
import { timeAgo } from '../../../utils/dateUtils';
import StoryLikesModal from '../storyLikesModal/StoryLikesModal';
import { storyService } from '../../../services/storyService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export interface StoryItem {
    id: string;
    raw_id?: number | string; // ID for API Calls
    url: string;
    type: 'image' | 'video';
    duration?: number;
    date?: string;
    hasLiked?: boolean;
    likesCount?: number;
}

export interface UserStory {
    id: string;
    username: string;
    avatar: string;
    stories: StoryItem[];
}

interface StatusViewerModalProps {
    visible: boolean;
    userStories: UserStory[];
    initialUserIndex?: number;
    onClose: () => void;
}

const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
    visible,
    userStories,
    initialUserIndex = 0,
    onClose,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress] = useState(new Animated.Value(0));

    // Story Like State
    const [isLikesVisible, setIsLikesVisible] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);
    const [localStories, setLocalStories] = useState<UserStory[]>([]);

    // Sync external props
    useEffect(() => {
        setLocalStories(userStories);
    }, [userStories]);

    const currentUser = localStories[currentUserIndex];
    const currentStory = currentUser?.stories[currentStoryIndex];

    const progressAnim = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (visible) {
            setCurrentUserIndex(initialUserIndex);
            setCurrentStoryIndex(0);
        } else {
            progress.setValue(0);
            setCurrentStoryIndex(0);
        }
    }, [visible, initialUserIndex]);

    useEffect(() => {
        if (visible && currentUser && currentStory) {
            startProgress();
        }
        return () => {
            if (progressAnim.current) {
                progressAnim.current.stop();
            }
        };
    }, [currentUserIndex, currentStoryIndex, visible]);

    const startProgress = () => {
        progress.setValue(0);

        // Default duration 3000ms for images, but can be overridden
        const duration = currentStory?.duration || 3000;

        progressAnim.current = Animated.timing(progress, {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
        });

        progressAnim.current.start(({ finished }) => {
            if (finished) {
                goToNextStory();
            }
        });
    };

    const goToNextStory = () => {
        if (!currentUser) return;

        if (currentStoryIndex < currentUser.stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
        } else {
            // Move to next user if available
            if (currentUserIndex < userStories.length - 1) {
                setCurrentUserIndex(currentUserIndex + 1);
                setCurrentStoryIndex(0);
            } else {
                onClose();
            }
        }
    };

    const goToPrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(currentStoryIndex - 1);
        } else {
            // Move to prev user if available
            if (currentUserIndex > 0) {
                setCurrentUserIndex(currentUserIndex - 1);
                // Start from the first story of previous user? Or last? Usually first.
                setCurrentStoryIndex(0);
            } else {
                onClose();
            }
        }
    };

    const isCurrentUserStory = () => {
        if (!user || !currentUser) return false;
        const u = user as any;
        return String(currentUser.id) === String(u.username) || String(currentUser.id) === String(u.handle);
    };

    const handleHeartPress = async () => {
        if (!currentStory?.raw_id || !user?.id) return;

        if (isCurrentUserStory()) {
            // Owner opens modal to see who liked it
            if (progressAnim.current) {
                // Pause auto-play
                progressAnim.current.stop();
            }
            setIsLikesVisible(true);
            return;
        }

        // Toggle Like logic for other users
        if (isLiking) return;
        setIsLiking(true);

        const isCurrentlyLiked = currentStory.hasLiked;
        const currentUserId = String(user.id);
        const storyIdRaw = Number(currentStory.raw_id);

        try {
            // Optimistic Update
            setLocalStories(prev => {
                const newStories = [...prev];
                const userGroup = { ...newStories[currentUserIndex] };
                const storiesList = [...userGroup.stories];

                storiesList[currentStoryIndex] = {
                    ...storiesList[currentStoryIndex],
                    hasLiked: !isCurrentlyLiked,
                    likesCount: isCurrentlyLiked
                        ? Math.max(0, (storiesList[currentStoryIndex].likesCount || 0) - 1)
                        : (storiesList[currentStoryIndex].likesCount || 0) + 1
                };

                userGroup.stories = storiesList;
                newStories[currentUserIndex] = userGroup;
                return newStories;
            });

            // API Call
            await storyService.toggleStoryLike(storyIdRaw, currentUserId);
        } catch (error) {
            console.error("Failed to like story:", error);
            // Revert on failure
            setLocalStories(prev => {
                const newStories = [...prev];
                const userGroup = { ...newStories[currentUserIndex] };
                const storiesList = [...userGroup.stories];

                storiesList[currentStoryIndex] = {
                    ...storiesList[currentStoryIndex],
                    hasLiked: isCurrentlyLiked,
                    likesCount: isCurrentlyLiked
                        ? (storiesList[currentStoryIndex].likesCount || 0) + 1
                        : Math.max(0, (storiesList[currentStoryIndex].likesCount || 0) - 1)
                };

                userGroup.stories = storiesList;
                newStories[currentUserIndex] = userGroup;
                return newStories;
            });
        } finally {
            setIsLiking(false);
        }
    };

    if (!currentUser || !currentStory) return null;

    return (
        <Modal
            isVisible={visible}
            style={styles.modal}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={1}
            onSwipeComplete={onClose}
            swipeDirection="down"
            propagateSwipe
            statusBarTranslucent
        >
            <View style={[styles.container, { backgroundColor: theme.colors.black }]}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

                {/* Progress Bars */}
                <View style={[styles.progressBarContainer, { top: insets.top + 10 }]}>
                    {currentUser.stories.map((story, index) => {
                        return (
                            <View key={story.id} style={styles.progressBarBackground}>
                                {index === currentStoryIndex ? (
                                    <Animated.View
                                        style={[
                                            styles.progressBarFill,
                                            {
                                                width: progress.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%']
                                                })
                                            }
                                        ]}
                                    />
                                ) : (
                                    <View
                                        style={[
                                            styles.progressBarFill,
                                            { width: index < currentStoryIndex ? '100%' : '0%' }
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* Header */}
                <View style={[styles.header, { top: insets.top + 25 }]}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                        <Text style={styles.username}>{currentUser.username}</Text>
                        <Text style={styles.timeAgo}>{currentStory.date ? timeAgo(currentStory.date) : ''}</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={{ color: 'white', fontSize: 20 }}>X</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Image */}
                <Image
                    source={{ uri: currentStory.url }}
                    style={styles.storyImage}
                    resizeMode="cover"
                />

                {/* Navigation Touch Areas */}
                <View style={styles.touchContainer}>
                    <TouchableWithoutFeedback onPress={goToPrevStory}>
                        <View style={styles.touchAreaLeft} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={goToNextStory}>
                        <View style={styles.touchAreaRight} />
                    </TouchableWithoutFeedback>
                </View>

                {/* Footer / Reply (Visual only for now) */}
                <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                    <View style={styles.replyInput}>
                        <Text style={styles.replyPlaceholder}>{t('dashboard.send_message')}</Text>
                    </View>

                    <TouchableOpacity onPress={handleHeartPress}>
                        {isCurrentUserStory() ? (
                            <Ionicons
                                name={currentStory.likesCount && currentStory.likesCount > 0 ? "heart" : "heart-outline"}
                                size={30}
                                color={currentStory.likesCount && currentStory.likesCount > 0 ? theme.colors.primary : 'white'}
                            />
                        ) : (
                            <Ionicons
                                name={currentStory.hasLiked ? "heart" : "heart-outline"}
                                size={30}
                                color={currentStory.hasLiked ? theme.colors.primary : 'white'}
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 15 }}>
                        <Ionicons name="paper-plane-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>

            </View>

            <StoryLikesModal
                visible={isLikesVisible}
                storyId={currentStory.raw_id ? currentStory.raw_id : null}
                onClose={() => {
                    setIsLikesVisible(false);
                    startProgress(); // Resume auto-play
                }}
            />
        </Modal>
    );
};

export default StatusViewerModal;
