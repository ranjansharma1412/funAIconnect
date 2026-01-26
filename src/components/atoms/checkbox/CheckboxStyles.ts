import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        box: {
            height: 24,
            width: 24,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
            borderRadius: 4,
        },
        boxChecked: {
            backgroundColor: theme.colors.primary,
        },
        checkmark: {
            color: theme.colors.background,
            fontWeight: 'bold',
        },
        label: {
            color: theme.colors.text,
            fontSize: 16,
        },
    });
