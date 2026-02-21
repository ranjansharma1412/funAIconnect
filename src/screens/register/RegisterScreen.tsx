import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './RegisterScreenStyles';
import { registerUser } from '../../store/slices/authSlice';
import { showError } from '../../store/slices/modalSlice';
import { AppDispatch, RootState } from '../../store';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

const RegisterScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading } = useSelector((state: RootState) => state.auth);

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Username availability states
    const [usernameError, setUsernameError] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

    // Ref to track the latest request and prevent race conditions
    const latestRequestId = useRef(0);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    // Debounced username availability check
    useEffect(() => {
        // Reset states on every change
        setUsernameError('');
        setIsUsernameAvailable(false);
        setIsCheckingUsername(false);

        // Clear previous debounce
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // If empty, clear all and return
        if (!username) {
            return;
        }

        // If has spaces, show inline error
        if (/\s/.test(username)) {
            setUsernameError(t('auth.username_no_spaces'));
            return;
        }

        // If less than 8 characters, show inline error
        if (username.length < 8) {
            setUsernameError(t('auth.username_min_length'));
            return;
        }

        // Debounce the API call (500ms)
        const requestId = ++latestRequestId.current;
        setIsCheckingUsername(true);

        debounceTimer.current = setTimeout(async () => {
            try {
                const result = await authService.checkUsername(username);

                // Only update state if this is still the latest request
                if (requestId !== latestRequestId.current) { return; }

                if (result.available) {
                    setIsUsernameAvailable(true);
                    setUsernameError('');
                } else {
                    setIsUsernameAvailable(false);
                    setUsernameError(t('auth.username_taken'));
                }
            } catch (error: any) {
                if (requestId !== latestRequestId.current) { return; }
                setUsernameError(error.message || t('common.error'));
            } finally {
                if (requestId === latestRequestId.current) {
                    setIsCheckingUsername(false);
                }
            }
        }, 500);
    }, [username, t]);

    // Render the right icon for username input
    const renderUsernameRightIcon = useCallback(() => {
        if (isCheckingUsername) {
            return <ActivityIndicator size="small" color={theme.colors.accentBlue} />;
        }
        if (isUsernameAvailable) {
            return <Icon name="check-circle" size={22} color={theme.colors.accentBlue} />;
        }
        return undefined;
    }, [isCheckingUsername, isUsernameAvailable, theme.colors.accentBlue]);

    const handleRegister = async () => {
        // Validation: all fields required
        if (!fullName || !username || !email || !password) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.all_fields_required'),
                icon: 'alert-outline',
            }));
            return;
        }

        // Validation: username must not contain spaces
        if (/\s/.test(username)) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.username_no_spaces'),
                icon: 'alert-outline',
            }));
            return;
        }

        // Validation: username minimum 8 characters
        if (username.length < 8) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.username_min_length'),
                icon: 'alert-outline',
            }));
            return;
        }

        // Block if still checking or username not available
        if (isCheckingUsername) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('common.loading'),
                icon: 'alert-outline',
            }));
            return;
        }

        if (!isUsernameAvailable) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: usernameError || t('auth.username_taken'),
                icon: 'alert-outline',
            }));
            return;
        }

        // Validation: valid email format
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.invalid_email'),
                icon: 'alert-outline',
            }));
            return;
        }

        // Validation: password minimum 8 characters
        if (password.length < 8) {
            dispatch(showError({
                title: t('auth.Validation_error'),
                message: t('auth.password_min_length'),
                icon: 'alert-outline',
            }));
            return;
        }

        // API Call
        try {
            console.log('Registering with data:', { name: fullName, username, email, password });
            const resultAction = await dispatch(registerUser({ name: fullName, username, email, password }));
            if (registerUser.fulfilled.match(resultAction)) {
                navigation.navigate('Login');
            }
        } catch (err) {
            // Error is handled by slice/middleware
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.register_title')}</Text>

            <TextInput
                label={t('auth.fullname_label')}
                placeholder={t('auth.fullname_placeholder')}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
            />
            <TextInput
                label={t('auth.username_label')}
                placeholder={t('auth.username_placeholder')}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                rightIcon={renderUsernameRightIcon()}
            />
            {usernameError ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{usernameError}</Text>
            ) : null}
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
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                rightIcon={
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        disabled={password.length === 0}
                    >
                        <Icon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={22}
                            color={password.length > 0 ? theme.colors.text : theme.colors.border}
                        />
                    </TouchableOpacity>
                }
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
        </ScrollView>
    );
};

export default RegisterScreen;
