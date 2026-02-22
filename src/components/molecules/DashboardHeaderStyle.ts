import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800', // Extra bold for the brand
        letterSpacing: 0.5,
    },
    iconButton: {
        padding: 5,
    },
    // Menu Grid Icon Styles
    menuGrid: {
        width: 24,
        height: 24,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        padding: 2,
    },
    menuDot: {
        width: 8,
        height: 8,
        borderRadius: 2,
    },
    // Notification Icon Styles
    notificationIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#FFFFFF', // Should match background but hardcoded for now
    }
});
