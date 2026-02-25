import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Theme } from '../../../theme/theme';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
        borderRadius: 32, // High border radius from design
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        backgroundColor: theme.colors.transparent, // Let image define shape
    },
    mediaContainer: {
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        height: width * 1.2, // Taller aspect ratio
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    headerWrapper: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 10,
    },
    glassHeaderContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        // Common styles for both implementations
        ...(Platform.OS === 'android' && {
            backgroundColor: theme.colors.glassBackground, // Fallback tint
            borderColor: theme.colors.glassBorder,
            borderWidth: 1,
        })
    },
    androidGlassOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.glassOverlay,
    },
    glassHeaderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        marginLeft: 12,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    glassName: {
        fontWeight: '700',
        fontSize: 16,
        color: theme.colors.textOnImage,
        textShadowColor: theme.colors.textShadow,
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    verifiedIcon: {
        marginLeft: 4,
    },
    glassHandle: {
        fontSize: 13,
        color: theme.colors.textOnImageSecondary,
        marginTop: 2,
    },
    moreButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: theme.colors.overlayLighter,
    },
    footerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 24,
        zIndex: 10,
        // Gradient simulation since we replaced the gradient package text
        backgroundColor: theme.colors.overlayLight,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        color: theme.colors.textOnImage,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 15,
    },
    caption: {
        color: theme.colors.textOnImage,
        fontSize: 14,
        lineHeight: 20,
    },
    captionName: {
        fontWeight: 'bold',
        color: theme.colors.textOnImage,
    }
});
