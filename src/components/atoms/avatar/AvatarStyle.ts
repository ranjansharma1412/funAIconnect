import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        backgroundColor: theme.colors.disabled,
    },
    liveBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.white,
    }
});
