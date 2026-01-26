import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/feed/FeedScreen';
import CreativeScreen from '../screens/creative/CreativeScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import AccountScreen from '../screens/account/AccountScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.text,
            }}
        >
            <Tab.Screen name="Feed" component={FeedScreen} />
            <Tab.Screen name="Creative" component={CreativeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
