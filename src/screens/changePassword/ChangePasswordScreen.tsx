import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './ChangePasswordScreenStyles';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';

const ChangePasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            Alert.alert(t('common.error', 'Error'), t('auth.empty_fields_error', 'Please fill in all fields.'));
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert(t('common.error', 'Error'), t('auth.password_length_error', 'New password must be at least 6 characters long.'));
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
            });
            Alert.alert(t('common.success', 'Success'), t('auth.password_changed', 'Your password has been successfully updated.'));
            navigation.goBack();
        } catch (error: any) {
            Alert.alert(t('common.error', 'Error'), error.message || t('auth.password_change_failed', 'Failed to change password. Please check your old password.'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.change_password_title', 'Change Password')}</Text>
            <TextInput
                label={t('auth.old_password_label', 'Old Password')}
                placeholder={t('auth.old_password_placeholder', 'Enter old password')}
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
            />
            <TextInput
                label={t('auth.new_password_label', 'New Password')}
                placeholder={t('auth.new_password_placeholder', 'Enter new password')}
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <Button
                    title={t('auth.update_password_button', 'Update Password')}
                    onPress={handleChangePassword}
                />
            )}
        </View>
    );
};

export default ChangePasswordScreen;
