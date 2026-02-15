
import React, { useState } from 'react';
import { Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './LoginScreenStyles';
import { loginUser } from '../../store/slices/authSlice';
import { showError } from '../../store/slices/modalSlice';
import { AppDispatch, RootState } from '../../store';
import { useTranslation } from 'react-i18next';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const LoginScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [identifierError, setIdentifierError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validate = (): boolean => {
        let valid = true;
        const trimmedIdentifier = identifier.trim();

        // Reset errors
        setIdentifierError('');
        setPasswordError('');

        // Email or Username: required
        if (!trimmedIdentifier) {
            setIdentifierError(t('auth.all_fields_required'));
            valid = false;
        } else if (/\s/.test(trimmedIdentifier)) {
            // If it contains spaces, it's neither a valid email nor username
            setIdentifierError(t('auth.invalid_email_or_username'));
            valid = false;
        } else if (!EMAIL_REGEX.test(trimmedIdentifier) && trimmedIdentifier.includes('@')) {
            // Looks like an email attempt but invalid format
            setIdentifierError(t('auth.invalid_email'));
            valid = false;
        }

        // Password: required + min 6 chars
        if (!password) {
            setPasswordError(t('auth.all_fields_required'));
            valid = false;
        } else if (password.length < 6) {
            setPasswordError(t('auth.password_min_length'));
            valid = false;
        }

        return valid;
    };

    const handleLogin = async () => {
        if (!validate()) {
            return;
        }

        const trimmedIdentifier = identifier.trim();
        const isEmail = EMAIL_REGEX.test(trimmedIdentifier);

        // Build payload based on whether input is email or username
        const payload = isEmail
            ? { email: trimmedIdentifier, password }
            : { username: trimmedIdentifier, password };

        try {
            console.log('Logging in with:', { isEmail, identifier: trimmedIdentifier });
            const resultAction = await dispatch(loginUser(payload));
            if (loginUser.fulfilled.match(resultAction)) {
                navigation.navigate('Main');
            }
        } catch (err) {
            // Error managed by slice/middleware
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.login_title')}</Text>

            <TextInput
                label={t('auth.email_or_username_label')}
                placeholder={t('auth.email_or_username_placeholder')}
                value={identifier}
                onChangeText={(text) => {
                    setIdentifier(text);
                    if (identifierError) { setIdentifierError(''); }
                }}
                autoCapitalize="none"
            />
            {identifierError ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{identifierError}</Text>
            ) : null}

            <TextInput
                label={t('auth.password_label')}
                placeholder={t('auth.password_placeholder')}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) { setPasswordError(''); }
                }}
                rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color={theme.colors.border} />
                    </TouchableOpacity>
                }
            />
            {passwordError ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{passwordError}</Text>
            ) : null}

            <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={{ alignSelf: 'flex-end', marginTop: 10, marginBottom: 20 }}
            >
                <Text style={{ color: theme.colors.primary }}>{t('auth.forgot_password', 'Forgot Password?')}</Text>
            </TouchableOpacity>

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
        </ScrollView>
    );
};

export default LoginScreen;
