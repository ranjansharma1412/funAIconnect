import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        inputWrapper: {
            position: 'relative',
            justifyContent: 'center',
        },
        input: {
            height: 48,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 8,
            paddingHorizontal: 16,
            color: theme.colors.text,
            backgroundColor: theme.colors.background,
        },
        label: {
            marginBottom: 8,
            color: theme.colors.text,
            fontSize: 14,
            fontWeight: '600',
        },
        rightIconContainer: {
            position: 'absolute',
            right: 12,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
