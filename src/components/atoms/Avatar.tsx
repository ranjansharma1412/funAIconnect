import React from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './AvatarStyle';

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
    const styles = createStyles(theme);

    // Ensure we handle null/undefined uri gracefully
    const validSource = (typeof source === 'object' && source !== null && 'uri' in source && !source.uri)
        ? { uri: 'https://i.pravatar.cc/300' } // Fallback URI
        : source;

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Image
                source={validSource}
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

export default Avatar;
