import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './CreativeScreenStyles';

const CreativeScreen = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.text, { color: theme.colors.text }]}>Creative Screen</Text>
        </View>
    );
};

export default CreativeScreen;
