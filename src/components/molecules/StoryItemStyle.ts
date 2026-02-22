import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        maxWidth: 72,
    },
    name: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    }
});
