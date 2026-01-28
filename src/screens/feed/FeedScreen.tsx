import React from 'react';
import { View, Text, ImageBackground, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FeedScreenStyles';

const FeedScreen = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
            <ImageBackground style={{ flex: 1, width: '100%', height: '100%' }}
                resizeMode='cover'
                imageStyle={{ flex: 1, width: '100%', height: '100%' }}
                source={{ uri: "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            >
                <FlatList
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]}
                    renderItem={({ item, index }) => (
                        <View style={{ height: 200, backgroundColor: index % 2 === 0 ? 'black' : 'white', marginVertical: 10, marginTop: 60 }}>
                            <Text>Feed Screen</Text>
                        </View>
                    )}
                />
            </ImageBackground>
        </View>
    );
};

export default FeedScreen;
