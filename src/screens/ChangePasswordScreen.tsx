import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/atoms/Button';
import TextInput from '../components/atoms/TextInput';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default ChangePasswordScreen;
