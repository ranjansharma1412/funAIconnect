import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './LoginScreenStyles';

const LoginScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Login Screen</Text>
            <TextInput label="Username" placeholder="Enter username" />
            <TextInput label="Password" placeholder="Enter password" secureTextEntry />
            <Button title="Login" onPress={() => navigation.navigate('Main')} />
            <Button
                title="Register"
                onPress={() => navigation.navigate('Register')}
                style={{ marginTop: 10, backgroundColor: theme.colors.secondary }}
            />
        </View>
    );
};

export default LoginScreen;
