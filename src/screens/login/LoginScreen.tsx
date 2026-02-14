
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
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // Validation
        if (!email || !password) {
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
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.login_title')}</Text>
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
                <Button title={t('auth.login_button')} onPress={handleLogin} />
            )}

            <Button
                title={t('auth.register_button')}
                onPress={() => navigation.navigate('Register')}
                style={{ marginTop: 10, backgroundColor: theme.colors.secondary }}
            />
        </View>
    );
};

export default LoginScreen;
