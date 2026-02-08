import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.colors.border, // Placeholder color
    },
    contentContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
        color: theme.colors.text,
        flex: 1,
        marginRight: 10,
    },
    boldText: {
        fontWeight: 'bold',
    },
    timeText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    actionsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        gap: 10,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
    },
    secondaryButton: {
        backgroundColor: theme.colors.background,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    primaryButtonText: {
        color: '#FFFFFF',
    },
    secondaryButtonText: {
        color: theme.colors.text,
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
        marginLeft: 10,
    },
});
