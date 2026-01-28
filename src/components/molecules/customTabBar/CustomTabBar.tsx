import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './CustomTabBarStyles';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <BlurView
                style={styles.blurView}
                blurType="light"
                blurAmount={10}
                reducedTransparencyFallbackColor="white"
                blurRadius={20}
            />
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    let iconName = '';
                    if (route.name === 'Feed') {
                        iconName = isFocused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Creative') {
                        iconName = 'add-circle';
                    } else if (route.name === 'History') {
                        iconName = isFocused ? 'time' : 'time-outline';
                    } else if (route.name === 'Account') {
                        iconName = isFocused ? 'person' : 'person-outline';
                    }

                    const isCreative = route.name === 'Creative';

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}

                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[
                                styles.tabItem,
                                isCreative && styles.creativeTabItem, // Special styling for creative tab
                            ]}
                        >
                            <Ionicons
                                name={iconName}
                                size={isCreative ? 40 : 24}
                                color={isFocused || isCreative ? theme.colors.primary : theme.colors.text}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default CustomTabBar;
