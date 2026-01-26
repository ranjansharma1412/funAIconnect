import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/atoms/Button';
import TextInput from '../components/atoms/TextInput';

const RegisterScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Register Screen</Text>
            <TextInput label="Username" placeholder="Enter username" />
            <TextInput label="Email" placeholder="Enter email" />
            <TextInput label="Password" placeholder="Enter password" secureTextEntry />
            <Button title="sign up" onPress={() => navigation.goBack()} />
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

export default RegisterScreen;
