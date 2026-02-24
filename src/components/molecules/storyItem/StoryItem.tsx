import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import Avatar from '../../atoms/avatar/Avatar';
import { createStyles } from './StoryItemStyle';

interface StoryItemProps {
    name: string;
    imageSource: { uri: string } | number;
    isLive?: boolean;
    onPress?: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ name, imageSource, isLive = false, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

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

export default StoryItem;
