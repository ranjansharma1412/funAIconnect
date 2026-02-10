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
import { useTranslation } from 'react-i18next';

const RegisterScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        // Validation
        if (!username || !email || !password) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.all_fields_required'),
                icon: 'alert-outline'
            }));
            return;
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.invalid_email'),
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
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.register_title')}</Text>
            <TextInput
                label={t('auth.username_label')}
                placeholder={t('auth.username_placeholder')}
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                label={t('auth.email_label')}
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                label={t('auth.password_label')}
                placeholder={t('auth.password_placeholder')}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary || '#0000ff'} style={{ marginTop: 20 }} />
            ) : (
                <Button title={t('auth.signup_button')} onPress={handleRegister} />
            )}

            <Button
                title={t('auth.back_to_login')}
                onPress={() => navigation.goBack()}
                style={{ marginTop: 10, backgroundColor: 'transparent' }}
                textStyle={{ color: theme.colors.text }}
            />
        </View>
    );
};

export default RegisterScreen;
