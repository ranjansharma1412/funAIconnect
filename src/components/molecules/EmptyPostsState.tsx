import React from 'react';
import { View, Text, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './EmptyPostsStateStyle';

const EmptyPostsState = () => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {/* A creative illustrative placeholder image */}
                <Image
                    source={{ uri: 'https://cdn3d.iconscout.com/3d/premium/thumb/empty-box-4860010-4050731.png' }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <Text style={[styles.title, { color: theme.colors.text }]}>
                No Posts Yet
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                It's quiet here. Be the first to share your thoughts, creative ideas, or beautiful moments!
            </Text>

            <View style={styles.iconRow}>
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.accentBlue]}
                    style={styles.iconCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="camera-outline" size={24} color="#FFF" />
                </LinearGradient>
                <View style={[styles.placeholderLine, { backgroundColor: theme.colors.border }]} />
                <LinearGradient
                    colors={[theme.colors.accentRed, '#FFB100']}
                    style={styles.iconCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="color-palette-outline" size={24} color="#FFF" />
                </LinearGradient>
                <View style={[styles.placeholderLine, { backgroundColor: theme.colors.border }]} />
                <LinearGradient
                    colors={[theme.colors.accentBlue, theme.colors.primary]}
                    style={styles.iconCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name="videocam-outline" size={24} color="#FFF" />
                </LinearGradient>
            </View>
        </View>
    );
};

export default EmptyPostsState;
