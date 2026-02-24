import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../../theme/theme';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: theme.colors.card,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: theme.colors.shadow,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        backgroundColor: theme.colors.background,
    },
    iconContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        fontWeight: '400',
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    button: {
        width: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.buttonTextPrimary,
    },
});
