import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import StoryItem from '../molecules/StoryItem';

// Dummy data interface
interface StoryData {
    id: string;
    name: string;
    image: string;
    isLive?: boolean;
}

interface StoriesRailProps {
    data: StoryData[];
    onPressItem: (id: string, index: number) => void;
}

const StoriesRail: React.FC<StoriesRailProps> = ({ data, onPressItem }) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {data.map((story, index) => (
                    <StoryItem
                        key={story.id}
                        name={story.name}
                        imageSource={{ uri: story.image }}
                        isLive={story.isLive}
                        onPress={() => onPressItem(story.id, index)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    scrollContent: {
        paddingHorizontal: 20,
    }
});

export default StoriesRail;
