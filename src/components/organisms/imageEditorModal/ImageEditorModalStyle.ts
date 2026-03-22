import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/theme';
const { width, height } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.black,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        zIndex: 10,
    },
    headerText: {
        color: theme.colors.textOnImage,
        fontSize: 16,
        fontWeight: '600',
    },
    applyText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.black,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    toolbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    toolButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    toolText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: 5,
    },
    toolTextActive: {
        color: theme.colors.primary,
        fontSize: 12,
        marginTop: 5,
        fontWeight: 'bold',
    }
});
