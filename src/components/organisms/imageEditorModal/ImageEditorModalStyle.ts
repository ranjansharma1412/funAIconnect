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
    },
    textInputOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
    },
    textInput: {
        color: 'white',
        fontSize: 32,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        minWidth: 200,
        textAlign: 'center',
        padding: 10,
    },
    textStylingToolbar: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    styleRowScroll: {
        flexDirection: 'row',
        marginBottom: 15,
        maxHeight: 40,
    },
    styleRow: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'center',
        width: '100%',
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    colorSwatchSelected: {
        borderColor: 'white',
    },
    fontPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 5,
        justifyContent: 'center',
    },
    fontPillSelected: {
        backgroundColor: theme.colors.primary,
    },
    fontPillText: {
        color: 'white',
        fontSize: 14,
    },
    styleToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    styleToggleSelected: {
        backgroundColor: theme.colors.primary,
    },
    styleToggleText: {
        color: 'white',
        fontSize: 18,
    }
});
