import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/login/LoginScreen';
import RegisterScreen from '../screens/register/RegisterScreen';
import ChangePasswordScreen from '../screens/changePassword/ChangePasswordScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import PostDetailsScreen from '../screens/postDetails/PostDetailsScreen';
import { useTheme } from '../theme/ThemeContext';

import ForgotPasswordScreen from '../screens/login/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/login/ResetPasswordScreen';
import { LinkingOptions } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ['funai://'],
    config: {
        screens: {
            Login: 'login',
            Register: 'register',
            ForgotPassword: 'forgot-password',
            ResetPassword: 'reset-password/:token',
            Main: {
                screens: {
                    Home: 'home',
                    // Add other nested screens if needed
                },
            },
        },
    },
};

const AppNavigator = () => {
    const { theme } = useTheme();
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer linking={linking}>
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
                        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} options={{ title: 'Reset Password' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
