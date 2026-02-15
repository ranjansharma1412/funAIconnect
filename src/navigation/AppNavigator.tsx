import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import ForgotPasswordScreen from '../screens/forgotPassword/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/changePassword/ChangePasswordScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { theme } = useTheme();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                }}
            >
                {isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={TabNavigator}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
