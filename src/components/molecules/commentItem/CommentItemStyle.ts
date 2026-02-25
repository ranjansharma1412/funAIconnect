import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'flex-start',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    userName: {
        fontWeight: '600',
        fontSize: 14,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    deleteButton: {
        padding: 4,
        marginLeft: 8,
    },
});
