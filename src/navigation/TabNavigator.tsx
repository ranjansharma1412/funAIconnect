import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AIScreen from '../screens/ai/AIScreen';
import CreativeScreen from '../screens/creative/CreativeScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import AccountScreen from '../screens/account/AccountScreen';
import CustomTabBar from '../components/molecules/customTabBar/CustomTabBar';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { t } = useTranslation();

    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // hide labels as we are using icons
            }}
        >
            <Tab.Screen
                name="Feed"
                component={DashboardScreen}
                options={{ tabBarAccessibilityLabel: t('navigation.feed') }}
            />
            <Tab.Screen
                name="AI"
                component={AIScreen}
                options={{ tabBarAccessibilityLabel: t('navigation.ai') }}
            />
            <Tab.Screen
                name="Creative"
                component={CreativeScreen}
                options={{ tabBarAccessibilityLabel: t('navigation.creative') }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{ tabBarAccessibilityLabel: t('navigation.history') }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{ tabBarAccessibilityLabel: t('navigation.account') }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
