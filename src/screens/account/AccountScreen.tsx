import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    Platform,
    ActivityIndicator,
    Linking
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './AccountScreenStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, CameraOptions } from 'react-native-image-picker';
import { authService } from '../../services/authService';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';

const AccountScreen = () => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const { user } = useSelector((state: any) => state.auth);

    // Profile State
    const [avatar, setAvatar] = useState<string | null>(user?.userImage || user?.avatar || null);
    const [name, setName] = useState(user?.name || user?.userName || '');
    const [bio, setBio] = useState(user?.bio || '');

    // Personal Info State
    const [email, setEmail] = useState(user?.email || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [startDob, setDob] = useState(user?.dob || ''); // Renamed to avoid confusion if needed, or keep

    // Using dob from state directly

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    const handleProfileImagePick = () => {
        if (!isEditing) return;

        Alert.alert(t('account.update_profile_pic'), t('account.choose_option'), [
            {
                text: t('account.camera'),
                onPress: async () => {
                    const result = await launchCamera({ mediaType: 'photo', quality: 0.8 });
                    if (result.assets && result.assets.length > 0) {
                        setAvatar(result.assets[0].uri || null);
                    }
                },
            },
            {
                text: t('account.gallery'),
                onPress: async () => {
                    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8, selectionLimit: 1 });
                    if (result.assets && result.assets.length > 0) {
                        setAvatar(result.assets[0].uri || null);
                    }
                },
            },
            { text: t('common.cancel'), style: 'cancel' },
        ]);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            // formData.append('email', email);
            formData.append('mobile', mobile);
            formData.append('bio', bio);
            formData.append('dob', startDob);

            if (avatar && !avatar.startsWith('http')) {
                const imageFile = {
                    uri: Platform.OS === 'ios' ? avatar.replace('file://', '') : avatar,
                    type: 'image/jpeg',
                    name: 'profile.jpg',
                };
                formData.append('userImage', imageFile as any);
            }

            console.log('Updating profile...', formData);
            await authService.updateProfile(formData);

            Alert.alert(t('account.success'), t('account.profile_updated'));
            setIsEditing(false);
        } catch (error: any) {
            Alert.alert(t('common.error'), error.message || t('account.failed_update'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(t('account.logout_title'), t('account.logout_confirm'), [
            { text: t('common.cancel'), style: 'cancel' },
            {
                text: t('account.logout_button'),
                style: 'destructive',
                onPress: () => {
                    dispatch(logout());
                }
            }
        ]);
    };

    const renderSettingItem = (icon: string, title: string, onPress?: () => void) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={theme.colors.textSecondary} />
            </View>
            <Text style={styles.menuText}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header / Profile Section */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleProfileImagePick} style={styles.avatarContainer} disabled={!isEditing}>
                        <Image
                            source={{ uri: avatar || 'https://i.pravatar.cc/300' }}
                            style={styles.avatar}
                        />
                        {isEditing && (
                            <View style={styles.editIconBadge}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={styles.nameInput}
                        value={name}
                        onChangeText={setName}
                        placeholder={t('account.name_placeholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        editable={isEditing}
                    />
                    <TextInput
                        style={styles.bioInput}
                        value={bio}
                        onChangeText={setBio}
                        placeholder={t('account.bio_placeholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        editable={isEditing}
                    />
                </View>

                {/* Language Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('account.language')}</Text>
                    <View style={styles.languageSection}>
                        <TouchableOpacity
                            style={styles.languageOption}
                            onPress={() => changeLanguage('en')}
                        >
                            <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
                                {i18n.language === 'en' && <View style={[styles.radioButtonSelected, { backgroundColor: theme.colors.primary }]} />}
                            </View>
                            <Text style={[styles.languageText, { color: theme.colors.text }]}>{t('common.english')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.languageOption}
                            onPress={() => changeLanguage('hi')}
                        >
                            <View style={[styles.radioButton, { borderColor: theme.colors.primary }]}>
                                {i18n.language === 'hi' && <View style={[styles.radioButtonSelected, { backgroundColor: theme.colors.primary }]} />}
                            </View>
                            <Text style={[styles.languageText, { color: theme.colors.text }]}>{t('common.hindi')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('account.personal_info')}</Text>
                        {isLoading ? (
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                            >
                                <Ionicons
                                    name={isEditing ? "checkmark-circle" : "create-outline"}
                                    size={24}
                                    color={theme.colors.primary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t('account.email')}</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                placeholder={t('account.email_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t('account.mobile')}</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                                placeholder={t('account.mobile_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>{t('account.dob')}</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={startDob}
                                onChangeText={setDob}
                                placeholder={t('account.dob_placeholder')}
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                    </View>
                </View>

                {/* Settings & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('account.settings_privacy')}</Text>
                    {renderSettingItem('key-outline', t('account.change_password', 'Change Password'), () => navigation.navigate('ChangePassword'))}
                    {renderSettingItem('lock-closed-outline', t('account.privacy_settings', 'Privacy Policy'), () => Linking.openURL('https://funaiconnect.netlify.app/privacy'))}
                    {renderSettingItem('document-text-outline', t('account.terms_conditions', 'Terms & Conditions'), () => Linking.openURL('https://funaiconnect.netlify.app/terms'))}
                    {renderSettingItem('help-circle-outline', t('account.help_support', 'Contact Us'), () => Linking.openURL('https://funaiconnect.netlify.app/contact'))}
                </View>

                {/* Logout Action */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>{t('account.logout_button')}</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default AccountScreen;
