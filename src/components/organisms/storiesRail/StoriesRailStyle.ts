import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
    }
});
