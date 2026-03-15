import { StyleSheet } from 'react-native';
import { Theme } from '../../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: theme.colors.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border,
    },
    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 24,
        marginHorizontal: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        minHeight: 40,
        maxHeight: 120,
    },
    input: {
        flex: 1,
        color: theme.colors.text,
        fontSize: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sendButton: {
        backgroundColor: theme.colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: theme.colors.surface,
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    bottomSheet: {
        backgroundColor: theme.colors.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: theme.colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 24,
    },
    attachmentOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    attachmentOptionBtn: {
        alignItems: 'center',
    },
    attachmentIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    attachmentOptionText: {
        fontSize: 14,
        fontWeight: '500',
    }
});
