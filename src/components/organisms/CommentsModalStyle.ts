import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        height: '80%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 10,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider, // Should use theme border color potentially, but local style for now
        marginBottom: 10,
        position: 'relative',
    },
    headerIndicator: {
        width: 40,
        height: 4,
        backgroundColor: theme.colors.skeletonBackground,
        borderRadius: 2,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 10,
    },
    loader: {
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        minHeight: 40,
        maxHeight: 100,
        marginRight: 10,
        fontSize: 15,
    },
    sendButton: {
        padding: 5,
    },
});
