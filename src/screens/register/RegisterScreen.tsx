import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './RegisterScreenStyles';

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

export default RegisterScreen;
