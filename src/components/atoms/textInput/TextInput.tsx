import React from 'react';
import { TextInput as RNTextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './TextInputStyles';

interface CustomTextInputProps extends TextInputProps {
    label?: string;
    rightIcon?: React.ReactNode;
}

const TextInput: React.FC<CustomTextInputProps> = ({ label, style, rightIcon, ...props }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <RNTextInput
                    style={[styles.input, rightIcon ? { paddingRight: 44 } : undefined, style]}
                    placeholderTextColor={theme.colors.border}
                    {...props}
                />
                {rightIcon && (
                    <View style={styles.rightIconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
        </View>
    );
};

export default TextInput;

