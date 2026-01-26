import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './ChangePasswordScreenStyles';

const ChangePasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Change Password Screen</Text>
            <TextInput label="Old Password" placeholder="Enter old password" secureTextEntry />
            <TextInput label="New Password" placeholder="Enter new password" secureTextEntry />
            <Button title="Update Password" onPress={() => navigation.goBack()} />
        </View>
    );
};

export default ChangePasswordScreen;
