import React from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface AvatarProps {
    source: { uri: string } | number;
    size?: number;
    showStatus?: boolean;
    isLive?: boolean;
    style?: ViewStyle;
}

const Avatar: React.FC<AvatarProps> = ({
    source,
    size = 50,
    showStatus = false,
    isLive = false,
    style
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Image
                source={source}
                style={[
                    styles.image,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: showStatus ? 2 : 0,
                        borderColor: isLive ? theme.colors.accentRed : theme.colors.accentBlue
                    }
                ]}
            />
            {isLive && (
                <View style={[styles.liveBadge, { backgroundColor: theme.colors.accentRed }]}>
                    <View style={styles.liveDot} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        backgroundColor: '#E1E1E1',
    },
    liveBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    liveDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
    }
});

export default Avatar;
