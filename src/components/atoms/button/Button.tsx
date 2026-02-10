import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle, StyleProp, View, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './ButtonStyles';

import LinearGradient from 'react-native-linear-gradient';

interface ButtonProps {
    title?: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    useGradient?: boolean;
    children?: ReactNode;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style, textStyle, useGradient = true, children, disabled }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const buttonContent = children ? children : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
    );

    if (useGradient) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={[
                    styles.button,
                    style,
                    { padding: 0, overflow: 'hidden', backgroundColor: 'transparent' } // Ensure gradient fills and no background conflict
                ]}
                disabled={disabled}
            >
                <LinearGradient
                    colors={theme.colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
                />
                {/* Content Container */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    {buttonContent}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} disabled={disabled}>
            {buttonContent}
        </TouchableOpacity>
    );
};

export default Button;
