import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        outerCircle: {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        innerCircle: {
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: theme.colors.primary,
        },
        label: {
            color: theme.colors.text,
            fontSize: 16,
        },
    });
