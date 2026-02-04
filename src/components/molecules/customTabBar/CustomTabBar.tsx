import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../../theme/ThemeContext';
import { styles } from './CustomTabBarStyles';

import { isLiquidGlassSupported, LiquidGlassView } from '@callstack/liquid-glass';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const { theme } = useTheme();

    if (Platform.OS === 'ios' && isLiquidGlassSupported) {
        return (
            <LiquidGlassView
                style={[styles.container, styles.glassEffect]}
                colorScheme="system"
                tintColor={'transparent'}
            >
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
                            iconName = isFocused ? 'home' : 'home-outline';
                        } else if (route.name === 'Creative') {
                            iconName = isFocused ? 'add-circle' : 'add-circle-outline';
                        } else if (route.name === 'History') {
                            iconName = isFocused ? 'time' : 'time-outline';
                        } else if (route.name === 'Account') {
                            iconName = isFocused ? 'person' : 'person-outline';
                        }

                        // Active color: Primary Text (Black), Inactive: Text Secondary (Gray)
                        // For Creative tab, we can make it stand out if needed, or keep consistent.
                        const iconColor = isFocused
                            ? theme.colors.text
                            : theme.colors.textSecondary;

                        return (
                            <TouchableOpacity
                                key={index}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}

                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.tabItem}
                            >
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={iconColor}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </LiquidGlassView>
        )
    }

    return (
        <View style={styles.container}>
            <BlurView
                style={styles.blurView}
                blurType="light"
                blurAmount={30}
                reducedTransparencyFallbackColor="transparent"
                blurRadius={2}
                overlayColor="transparent"
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
                        iconName = isFocused ? 'home' : 'home-outline';
                    } else if (route.name === 'Creative') {
                        iconName = isFocused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'History') {
                        iconName = isFocused ? 'time' : 'time-outline';
                    } else if (route.name === 'Account') {
                        iconName = isFocused ? 'person' : 'person-outline';
                    }

                    const isCreative = route.name === 'Creative';

                    // Active color: Primary Text (Black), Inactive: Text Secondary (Gray)
                    // For Creative tab, we can make it stand out if needed, or keep consistent.
                    const iconColor = isFocused
                        ? theme.colors.text
                        : theme.colors.textSecondary;

                    return (
                        <TouchableOpacity
                            key={index}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}

                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                        >
                            <Ionicons
                                name={iconName}
                                size={24}
                                color={iconColor}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default CustomTabBar;
