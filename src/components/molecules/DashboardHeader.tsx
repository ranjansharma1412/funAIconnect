import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Using generic shapes for icons since we might not have a specific icon library installed yet. 
// In a real app we'd use react-native-vector-icons or SVGs.

const DashboardHeader: React.FC = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Left: Menu Icon Placeholder */}
            <TouchableOpacity style={styles.iconButton}>
                <View style={styles.menuGrid}>
                    <View style={[styles.menuDot, { backgroundColor: theme.colors.text }]} />
                    <View style={[styles.menuDot, { backgroundColor: theme.colors.text }]} />
                    <View style={[styles.menuDot, { backgroundColor: theme.colors.text }]} />
                    <View style={[styles.menuDot, { backgroundColor: theme.colors.text }]} />
                </View>
            </TouchableOpacity>

            {/* Center: Brand Logo */}
            <Text style={[styles.logoText, { color: theme.colors.text }]}>Babagang</Text>

            {/* Right: Notification Icon Placeholder */}
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                <View style={[styles.notificationIcon, { borderColor: theme.colors.text }]}>
                    <View style={[styles.notificationDot, { backgroundColor: theme.colors.accentRed }]} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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

export default DashboardHeader;
