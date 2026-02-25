import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/theme';

const { width } = Dimensions.get('window');
const GRID_SPACING = 12;
// Calculate size for 2 columns with spacing
const ITEM_WIDTH = (width - (GRID_SPACING * 3)) / 2;
// Taller aspect ratio for attractive posts
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        marginHorizontal: GRID_SPACING / 2,
        marginBottom: GRID_SPACING,
        position: 'relative',
        backgroundColor: theme.colors.card,
        borderRadius: 20,
        overflow: 'hidden',
        // Shadow for premium look
        shadowColor: theme.colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        paddingTop: 30, // Gradients stretch up for smooth transition
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    actionText: {
        color: theme.colors.textOnImage,
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 4,
    },
    descriptionText: {
        color: theme.colors.textOnImageSecondary,
        fontSize: 12,
        lineHeight: 16,
    },
    shareButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        // Match the Share icon container from Dashboard more closely
        backgroundColor: theme.colors.overlayLight,
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
