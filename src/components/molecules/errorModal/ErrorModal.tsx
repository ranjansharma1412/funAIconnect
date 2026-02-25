import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ErrorModalConfig } from '../../../types/api.types';
import { useTranslation } from 'react-i18next';
import { createStyles } from './ErrorModalStyle';
import { useTheme } from '../../../theme/ThemeContext';

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
    iconColor,
    showCloseButton = true,
    buttonText: propButtonText,
    onClose,
    onButtonPress,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();
    const buttonText = propButtonText || t('common.okay');
    const defaultIconColor = iconColor || theme.colors.error;

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
                            <Icon name={icon} size={64} color={defaultIconColor} />
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

export default ErrorModal;
