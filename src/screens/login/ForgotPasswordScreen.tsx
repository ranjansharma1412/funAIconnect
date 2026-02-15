
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import Button from '../../components/atoms/button/Button';
import TextInput from '../../components/atoms/textInput/TextInput';
import { styles } from './LoginScreenStyles'; // Reusing styles
import { authService } from '../../services/authService';
import { send } from '@emailjs/react-native';

import {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    EMAILJS_PRIVATE_KEY
} from '@env';

// Constants from env
const SERVICE_ID = EMAILJS_SERVICE_ID;
const TEMPLATE_ID = EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = EMAILJS_PRIVATE_KEY;

const ForgotPasswordScreen = ({ navigation }: any) => {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendLink = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            // 1. Get Reset Link from Backend
            const response = await authService.forgotPassword(email);
            const backendLink = response.reset_link;

            if (!backendLink) {
                throw new Error('Failed to generate reset link');
            }

            console.log('Sending Reset Link:', backendLink);

            // 2. Send Email via EmailJS
            const templateParams = {
                to_email: email,
                reset_link: backendLink, // Send the HTTP link from backend which handles redirect
                // Add other template params if required by your template
            };

            // 2. Send Email via EmailJS (Direct API call to support Private Key)
            const emailJsData = {
                service_id: SERVICE_ID,
                template_id: TEMPLATE_ID,
                user_id: PUBLIC_KEY,
                accessToken: PRIVATE_KEY, // EmailJS uses 'accessToken' for Private Key in API
                template_params: templateParams,
            };

            const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailJsData),
            });

            if (!emailResponse.ok) {
                const errorText = await emailResponse.text();
                throw new Error(`EmailJS Error: ${errorText}`);
            }

            Alert.alert('Success', `Reset link sent to ${email}. Check your inbox!`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error('Forgot Password Error:', error);
            Alert.alert('Error', error.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Forgot Password</Text>
            <Text style={{ color: theme.colors.text, marginBottom: 20, textAlign: 'center' }}>
                Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
                <Button title="Send Reset Link" onPress={handleSendLink} />
            )}

            <Button
                title="Back to Login"
                onPress={() => navigation.goBack()}
                style={{ marginTop: 10, backgroundColor: 'transparent', borderWidth: 0 }}
                textStyle={{ color: theme.colors.primary }}
            />
        </ScrollView>
    );
};

export default ForgotPasswordScreen;
