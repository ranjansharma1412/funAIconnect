import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../theme/theme';

const { height, width } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    safeArea: {
        flex: 1,
        // backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.colors.skeletonBackground,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    postWrapper: {
        height: height * 0.8, // Adjust as needed to look like full screen
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    mediaContainer: {
        height: width * 1.5, // Taller aspect ratio
    },
});
