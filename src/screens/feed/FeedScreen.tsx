import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FeedScreenStyles';

const FeedScreen = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <Text>Feed Screen</Text>
        </View>
    );
};

export default FeedScreen;
