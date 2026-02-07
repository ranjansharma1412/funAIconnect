import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: 80, // Space for bottom tab bar and buttons
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.colors.text,
    },
    imagePreview: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        backgroundColor: theme.colors.card, // OR a specific placeholder color
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    placeholderText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    fullImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: theme.colors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        color: theme.colors.text,
        backgroundColor: theme.colors.card,
    },
    hashtagsInput: {
        minHeight: 50,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.card,
    },
    actionButtonText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    postButton: {
        backgroundColor: theme.colors.primary,
        padding: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    postButtonText: {
        color: '#fff', // White usually looks best on primary buttons
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    captureButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: '#ccc',
    },
    closeCameraButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    closeCameraText: {
        color: 'white',
        fontWeight: 'bold',
    },
    permissionText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: theme.colors.error,
    },
    errorText: {
        color: theme.colors.text,
    },
    linkText: {
        color: theme.colors.primary,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    }
});
