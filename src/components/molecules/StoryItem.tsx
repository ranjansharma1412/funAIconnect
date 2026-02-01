import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Avatar from '../atoms/Avatar';

interface StoryItemProps {
    name: string;
    imageSource: { uri: string } | number;
    isLive?: boolean;
    onPress?: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ name, imageSource, isLive = false, onPress }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Avatar
                source={imageSource}
                size={64}
                showStatus={true}
                isLive={isLive}
            />
            <Text
                numberOfLines={1}
                style={[
                    styles.name,
                    { color: theme.colors.text }
                ]}
            >
                {name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        maxWidth: 72,
    },
    name: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '500',
    }
});

export default StoryItem;
