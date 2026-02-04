import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ErrorModalConfig } from '../../types/api.types';

const { width } = Dimensions.get('window');

interface ErrorModalProps extends Partial<ErrorModalConfig> {
    visible: boolean;
    title: string;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    visible = false,
    title,
    message,
    icon = 'alert-circle-outline',
    iconColor = '#FF6B6B',
    showCloseButton = true,
    buttonText = 'Okay',
    onClose,
    onButtonPress,
}) => {
    const handleButtonPress = () => {
        if (onButtonPress) {
            onButtonPress();
        } else if (onClose) {
            onClose();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={handleClose}
            onBackButtonPress={handleClose}
            animationIn="zoomIn"
            animationOut="zoomOut"
            backdropOpacity={0.5}
            useNativeDriver
            hideModalContentWhileAnimating>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close Button */}
                    {showCloseButton && (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.7}>
                            <Icon name="close" size={24} color="#8E8E93" />
                        </TouchableOpacity>
                    )}

                    {/* Icon */}
                    {icon && (
                        <View style={styles.iconContainer}>
                            <Icon name={icon} size={64} color={iconColor} />
                        </View>
                    )}

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Action Button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleButtonPress}
                        activeOpacity={0.8}>
                        <Text style={styles.buttonText}>{buttonText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: '#F5F5F7',
    },
    iconContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111111',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ErrorModal;
