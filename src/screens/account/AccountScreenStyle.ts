import { StyleSheet } from 'react-native';
import { Theme } from '../../theme/theme';

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 100, // Space for bottom tab bar
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.card,
        borderWidth: 2,
        borderColor: theme.colors.primary,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    nameInput: {
        fontSize: 22,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: 'center',
        minWidth: 150,
        borderBottomWidth: 1,
        borderBottomColor: 'transparent', // Make it look like text unless focused? Or just simpler input.
    },
    bioInput: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 5,
        minWidth: 200,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 20,
    },
    iconButton: {
        padding: 5,
    },
    inputGroup: {
        gap: 15,
    },
    inputContainer: {
        // marginBottom: 15, // Handled by gap
    },
    label: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 5,
        marginLeft: 2,
    },
    input: {
        backgroundColor: theme.colors.card,
        color: theme.colors.text,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16,
    },
    inputReadOnly: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingHorizontal: 0,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    menuIconContainer: {
        width: 40,
        alignItems: 'center',
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButtonText: {
        color: theme.colors.buttonTextPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: 'transparent',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.error,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: theme.colors.error,
        fontSize: 16,
        fontWeight: '600',
    },
    // Language Selection Styles
    languageSection: {
        marginBottom: 20,
    },
    languageOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    radioButtonSelected: {
        height: 10,
        width: 10,
        borderRadius: 5,
    },
    languageText: {
        fontSize: 16,
    },
});
