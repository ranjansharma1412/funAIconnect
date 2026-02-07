import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './RegisterScreenStyles';
import { registerUser } from '../../store/slices/authSlice';
import { showError } from '../../store/slices/modalSlice';
import { AppDispatch, RootState } from '../../store';

const RegisterScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        // Validation
        if (!username || !email || !password) {
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
            console.log('Registering with data:', { name: username, email, password });
            const resultAction = await dispatch(registerUser({ name: username, email, password }));
            if (registerUser.fulfilled.match(resultAction)) {
                // Success - navigate to Login or Main
                navigation.navigate('Login');
            }
        } catch (err) {
            // Error is handled by slice/middleware usually, but unwrap/match helps here
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Register Screen</Text>
            <TextInput
                label="Username"
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
            />
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
                <Button title="sign up" onPress={handleRegister} />
            )}

            <Button
                title="Back to Login"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 10, backgroundColor: 'transparent' }}
                textStyle={{ color: theme.colors.text }}
            />
        </View>
    );
};

export default RegisterScreen;
