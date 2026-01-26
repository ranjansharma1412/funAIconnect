import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        button: {
            backgroundColor: theme.colors.primary,
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
        },
        text: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: 'bold',
        },
    });
