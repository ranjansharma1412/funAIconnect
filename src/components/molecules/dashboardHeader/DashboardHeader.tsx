import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
// Using generic shapes for icons since we might not have a specific icon library installed yet. 
// In a real app we'd use react-native-vector-icons or SVGs.
import Icon from 'react-native-vector-icons/Ionicons';

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
            {/* Left: Chat Icon linking to ChatList */}
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChatList')}>
                <Icon name="chatbubble-ellipses-outline" size={26} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Center: Brand Logo */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaskedView
                    maskElement={
                        <Text style={[styles.logoText, { backgroundColor: 'transparent' }]}>Bee</Text>
                    }
                >
                    <LinearGradient
                        colors={['#FFD700', '#FF8C00']} // Bold yellow orange gradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={[styles.logoText, { opacity: 0 }]}>Bee</Text>
                    </LinearGradient>
                </MaskedView>
                <Text style={[styles.logoText, { color: theme.colors.text, fontWeight: 'normal' }]}>Gather</Text>
            </View>

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
