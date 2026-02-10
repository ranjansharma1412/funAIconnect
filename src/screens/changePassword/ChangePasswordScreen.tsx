import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './ChangePasswordScreenStyles';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{t('auth.change_password_title')}</Text>
            <TextInput
                label={t('auth.old_password_label')}
                placeholder={t('auth.old_password_placeholder')}
                secureTextEntry
            />
            <TextInput
                label={t('auth.new_password_label')}
                placeholder={t('auth.new_password_placeholder')}
                secureTextEntry
            />
            <Button
                title={t('auth.update_password_button')}
                onPress={() => navigation.goBack()}
            />
        </View>
    );
};

export default ChangePasswordScreen;
