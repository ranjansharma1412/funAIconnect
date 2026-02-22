import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Using generic shapes for icons since we might not have a specific icon library installed yet. 
// In a real app we'd use react-native-vector-icons or SVGs.

import { useTranslation } from 'react-i18next';
import { createStyles } from './DashboardHeaderStyle';

// ... imports

const DashboardHeader: React.FC = () => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { t } = useTranslation();
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
            <Text style={[styles.logoText, { color: theme.colors.text }]}>{t('dashboard.brand_name')}</Text>

            {/* Right: Notification Icon Placeholder */}
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
                <View style={[styles.notificationIcon, { borderColor: theme.colors.text }]}>
                    <View style={[styles.notificationDot, { backgroundColor: theme.colors.accentRed }]} />
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default DashboardHeader;
