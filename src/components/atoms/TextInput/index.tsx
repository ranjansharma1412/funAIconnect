import React from 'react';
import { TextInput as RNTextInput, View, Text, TextInputProps } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './styles';

interface CustomTextInputProps extends TextInputProps {
    label?: string;
}

const TextInput: React.FC<CustomTextInputProps> = ({ label, style, ...props }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <RNTextInput
                style={[styles.input, style]}
                placeholderTextColor={theme.colors.border}
                {...props}
            />
        </View>
    );
};

export default TextInput;
