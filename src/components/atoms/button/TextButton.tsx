import React from 'react';
import { TouchableOpacity, Text, StyleProp, TextStyle, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useTheme } from '../../../theme/ThemeContext';

interface TextButtonProps {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
}

const TextButton: React.FC<TextButtonProps> = ({ title, onPress, style, textStyle, disabled }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[{ padding: 8, justifyContent: 'center', alignItems: 'center' }, style]}
        >
            <MaskedView
                maskElement={
                    <Text style={[{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }, textStyle]}>
                        {title}
                    </Text>
                }
            >
                <LinearGradient
                    colors={theme.colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={[{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', opacity: 0 }, textStyle]}>
                        {title}
                    </Text>
                </LinearGradient>
            </MaskedView>
        </TouchableOpacity>
    );
};

export default TextButton;
