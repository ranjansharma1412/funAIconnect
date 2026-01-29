import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import CreativeScreen from '../screens/creative/CreativeScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import AccountScreen from '../screens/account/AccountScreen';
import CustomTabBar from '../components/molecules/customTabBar/CustomTabBar';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false, // hide labels as we are using icons
            }}
        >
            <Tab.Screen name="Feed" component={DashboardScreen} />
            <Tab.Screen name="Creative" component={CreativeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
