import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Theme } from '../../../theme/theme';

interface Styles {
    container: ViewStyle;
    messageContainer: ViewStyle;
    ownMessage: ViewStyle;
    otherMessage: ViewStyle;
    text: TextStyle;
    ownText: TextStyle;
    otherText: TextStyle;
    timeText: TextStyle;
    timeContainer: ViewStyle;
    deletedContainer: ViewStyle;
    deletedText: TextStyle;
    image: ImageStyle;
    videoContainer: ViewStyle;
    playButton: ViewStyle;
    statusIcon: ViewStyle;
    mediaSkeleton: ViewStyle;
    skeletonOverlay: ViewStyle;
}

export const createStyles = (theme: Theme): Styles => StyleSheet.create<Styles>({
    container: {
        width: '100%',
        marginVertical: 4,
        paddingHorizontal: 16,
    },
    messageContainer: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 20,
        position: 'relative',
    },
    ownMessage: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.lighterOrange,
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.lighterBlack,
        borderBottomLeftRadius: 4,
    },
    text: {
        fontSize: 16,
        lineHeight: 22,
    },
    ownText: {
        color: theme.colors.primary,
    },
    otherText: {
        color: theme.colors.text,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
    },
    timeText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
        marginRight: 4,
    },
    deletedContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
    },
    deletedText: {
        color: theme.colors.textSecondary,
        fontStyle: 'italic',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 4,
    },
    videoContainer: {
        width: 200,
        height: 200,
        borderRadius: 12,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        position: 'relative',
    },
    playButton: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIcon: {
        marginLeft: 2,
    },
    mediaSkeleton: {
        width: 200,
        height: 200,
        borderRadius: 12,
        marginBottom: 4,
        position: 'relative',
        overflow: 'hidden',
    },
    skeletonOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    }
});
