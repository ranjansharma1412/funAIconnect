import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
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
            <View style={[styles.container, { backgroundColor: 'black' }]}>
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

const styles = StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    progressBarContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        flexDirection: 'row',
        height: 3,
        zIndex: 10,
        justifyContent: 'space-between',
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 1.5,
        marginHorizontal: 2,
        height: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
    },
    header: {
        position: 'absolute',
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#FFF',
    },
    username: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 10,
    },
    timeAgo: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    closeButton: {
        padding: 5,
    },
    storyImage: {
        width: width,
        height: height,
        position: 'absolute', // To be behind everything
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    touchContainer: {
        ...StyleSheet.absoluteFillObject, // Covers the whole screen
        flexDirection: 'row',
        zIndex: 5,
    },
    touchAreaLeft: {
        flex: 0.3,
        // backgroundColor: 'rgba(255, 0, 0, 0.1)', // Debugging
    },
    touchAreaRight: {
        flex: 0.7,
        // backgroundColor: 'rgba(0, 255, 0, 0.1)', // Debugging
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        zIndex: 10,
    },
    replyInput: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginRight: 15,
    },
    replyPlaceholder: {
        color: '#FFF',
        fontSize: 14,
    }
});

export default StatusViewerModal;
