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
import { useTheme } from '../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { createStyles } from './StatusViewerModalStyle';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Replaced with Text since vector icons might not be installed or configured

const { width, height } = Dimensions.get('window');

export interface StoryItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    duration?: number;
    date?: string;
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

    const currentUser = userStories[currentUserIndex];
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
                        <Text style={styles.timeAgo}>2h</Text>
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
                    <TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 24 }}>♡</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 15 }}>
                        <Text style={{ color: 'white', fontSize: 24 }}>➤</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </Modal>
    );
};

export default StatusViewerModal;
