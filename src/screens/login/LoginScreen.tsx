
import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './LoginScreenStyles';
import { loginUser } from '../../store/slices/authSlice';
import { showError } from '../../store/slices/modalSlice';
import { AppDispatch, RootState } from '../../store';

const LoginScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        navigation.navigate('Main');
        return
        // Validation
        if (!email || !password) {
            dispatch(showError({
                title: 'Validation Error',
                message: 'All fields are required.',
                icon: 'alert-outline'
            }));
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            dispatch(showError({
                title: 'Validation Error',
                message: 'Please enter a valid email address.',
                icon: 'alert-outline'
            }));
            return;
        }

        // API Call
        try {
            console.log('Logging in with:', { email });
            const resultAction = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(resultAction)) {
                // Success - navigate to Main
                navigation.navigate('Main');
            }
        } catch (err) {
            // Error managed by slice/middleware
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Login Screen</Text>
            <TextInput
                label="Email"
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                placeholder="Enter password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary || '#0000ff'} style={{ marginTop: 20 }} />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}

            <Button
                title="Register"
                onPress={() => navigation.navigate('Register')}
                style={{ marginTop: 10, backgroundColor: theme.colors.secondary }}
            />
        </View>
    );
};

export default LoginScreen;
