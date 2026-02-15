import React, { useState } from 'react';
import { Text, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './ForgotPasswordScreenStyles';
import { showError } from '../../store/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

const EMAIL_REGEX = /\S+@\S+\.\S+/;

const ForgotPasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validate = (): boolean => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setEmailError(t('auth.all_fields_required'));
            return false;
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setEmailError(t('auth.invalid_email'));
            return false;
        }

        setEmailError('');
        return true;
    };

    const handleForgotPassword = async () => {
        if (!validate()) {
            return;
        }

        setIsLoading(true);
        try {
            const trimmedEmail = email.trim();
            await authService.forgotPassword(trimmedEmail);
            dispatch(showError({
                title: t('auth.forgot_password_success_title'),
                message: t('auth.forgot_password_success_message'),
                icon: 'email-check-outline',
                iconColor: '#4CAF50',
            }));
            navigation.goBack();
        } catch (error: any) {
            dispatch(showError({
                title: t('auth.forgot_password_title'),
                message: error.message || t('common.error'),
                icon: 'alert-outline',
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={[styles.title, { color: theme.colors.text }]}>
                {t('auth.forgot_password_title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary || theme.colors.border }]}>
                {t('auth.forgot_password_subtitle')}
            </Text>

            <TextInput
                label={t('auth.email_label')}
                placeholder={t('auth.email_placeholder')}
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) { setEmailError(''); }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            {emailError ? (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>{emailError}</Text>
            ) : null}

            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary || '#0000ff'} style={{ marginTop: 20 }} />
            ) : (
                <Button title={t('auth.forgot_password_button')} onPress={handleForgotPassword} />
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

export default ForgotPasswordScreen;
