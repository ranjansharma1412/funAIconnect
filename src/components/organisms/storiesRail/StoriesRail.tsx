import React from 'react';
import { ScrollView, View } from 'react-native';
import StoryItem from '../../molecules/storyItem/StoryItem';
import { createStyles } from './StoriesRailStyle';
import { useTheme } from '../../../theme/ThemeContext';

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
    const { theme } = useTheme();
    const styles = createStyles(theme);
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

export default StoriesRail;
