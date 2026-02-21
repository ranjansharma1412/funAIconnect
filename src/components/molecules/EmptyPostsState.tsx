import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 30,
    },
    imageContainer: {
        width: width * 0.6,
        height: width * 0.5,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        opacity: 0.9,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 32,
        maxWidth: '90%',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    placeholderLine: {
        width: 30,
        height: 2,
        marginHorizontal: 10,
        borderRadius: 1,
    }
});

export default EmptyPostsState;
