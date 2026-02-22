import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../theme/theme';

const { width, height } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    modal: {
        margin: 0,
        justifyContent: 'flex-start',
    },
    container: {
        flex: 1,
        width: width,
        height: height,
    },
    progressBarContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        flexDirection: 'row',
        height: 3,
        zIndex: 10,
        justifyContent: 'space-between',
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: theme.colors.glassBackground,
        borderRadius: 1.5,
        marginHorizontal: 2,
        height: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.white,
    },
    header: {
        position: 'absolute',
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.colors.white,
    },
    username: {
        color: theme.colors.white,
        fontWeight: '600',
        fontSize: 14,
        marginRight: 10,
    },
    timeAgo: {
        color: theme.colors.textOnImageSecondary,
        fontSize: 12,
    },
    closeButton: {
        padding: 5,
    },
    storyImage: {
        width: width,
        height: height,
        position: 'absolute', // To be behind everything
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    touchContainer: {
        ...StyleSheet.absoluteFillObject, // Covers the whole screen
        flexDirection: 'row',
        zIndex: 5,
    },
    touchAreaLeft: {
        flex: 0.3,
        // backgroundColor: 'rgba(255, 0, 0, 0.1)', // Debugging
    },
    touchAreaRight: {
        flex: 0.7,
        // backgroundColor: 'rgba(0, 255, 0, 0.1)', // Debugging
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        zIndex: 10,
    },
    replyInput: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: theme.colors.textOnImageSecondary,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginRight: 15,
    },
    replyPlaceholder: {
        color: theme.colors.white,
        fontSize: 14,
    }
});
