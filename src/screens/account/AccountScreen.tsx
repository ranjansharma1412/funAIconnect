import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    Platform
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './AccountScreenStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const AccountScreen = () => {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    // Profile State
    const [avatar, setAvatar] = useState<string | null>(null);
    const [name, setName] = useState('John Doe');
    const [bio, setBio] = useState('Creative enthusiast | AI Lover');

    // Personal Info State
    const [email, setEmail] = useState('john.doe@example.com');
    const [mobile, setMobile] = useState('+1 234 567 8900');
    const [dob, setDob] = useState('01/01/1990');
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileImagePick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
            selectionLimit: 1,
        };

        const result = await launchImageLibrary(options);

        if (result.assets && result.assets.length > 0) {
            setAvatar(result.assets[0].uri || null);
        }
    };

    const handleSave = () => {
        // Mock save functionality
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => console.log('Logged out') }
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
                    <TouchableOpacity onPress={handleProfileImagePick} style={styles.avatarContainer}>
                        <Image
                            source={{ uri: avatar || 'https://i.pravatar.cc/300' }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIconBadge}>
                            <Ionicons name="camera" size={16} color="#FFF" />
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.nameInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your Name"
                        placeholderTextColor={theme.colors.textSecondary}
                        editable={isEditing}
                    />
                    <TextInput
                        style={styles.bioInput}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Add a bio..."
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        editable={isEditing}
                    />
                </View>

                {/* Personal Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
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
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                placeholder="Enter your email"
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Mobile</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="phone-pad"
                                placeholder="Enter mobile number"
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Date of Birth</Text>
                            <TextInput
                                style={[styles.input, !isEditing && styles.inputReadOnly]}
                                value={dob}
                                onChangeText={setDob}
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={isEditing}
                            />
                        </View>
                    </View>
                </View>

                {/* Settings & Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings & Privacy</Text>
                    {renderSettingItem('lock-closed-outline', 'Privacy Settings')}
                    {renderSettingItem('shield-checkmark-outline', 'Security')}
                    {renderSettingItem('notifications-outline', 'Notifications')}
                    {renderSettingItem('help-circle-outline', 'Help & Support')}
                </View>

                {/* Logout Action */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default AccountScreen;
