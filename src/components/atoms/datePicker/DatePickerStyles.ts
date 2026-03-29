import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            // No margin bottom, handled by parent's gap generally
        },
        inputWrapper: {
            position: 'relative',
            justifyContent: 'center',
        },
        inputContainer: {
            backgroundColor: theme.colors.card,
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            height: 50,
        },
        inputContainerDisabled: {
            backgroundColor: 'transparent',
            borderWidth: 0,
            paddingHorizontal: 0,
            height: 'auto',
            paddingVertical: 12, // Maintain height visually roughly
        },
        inputText: {
            color: theme.colors.text,
            fontSize: 16,
        },
        placeholderText: {
            color: theme.colors.textSecondary || theme.colors.border,
            fontSize: 16,
        },
        rightIconContainer: {
            position: 'absolute',
            right: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        label: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 5,
            marginLeft: 2,
        },
    });
