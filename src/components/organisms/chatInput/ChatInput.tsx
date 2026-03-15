import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { createStyles } from './ChatInputStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../../theme/ThemeContext';

interface ChatInputProps {
    onSend: (text: string) => void;
    onAttachCamera?: () => void;
    onAttachGallery?: () => void;
    onAttachDocument?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onAttachCamera, onAttachGallery, onAttachDocument }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [message, setMessage] = useState('');
    const [isAttachmentModalVisible, setAttachmentModalVisible] = useState(false);

    const handleSend = () => {
        if (message.trim().length > 0) {
            onSend(message.trim());
            setMessage('');
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.iconButton} onPress={() => setAttachmentModalVisible(true)}>
                    <Icon name="attach" size={24} color={theme.colors.primary} style={{ transform: [{ rotate: '-45deg' }] }} />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Message..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        maxLength={1000}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.sendButton, message.trim().length === 0 && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={message.trim().length === 0}
                >
                    <Icon
                        name="send"
                        size={20}
                        color={message.trim().length > 0 ? '#FFFFFF' : theme.colors.textSecondary}
                        style={{ marginLeft: 4 }}
                    />
                </TouchableOpacity>
            </View>

            <Modal
                isVisible={isAttachmentModalVisible}
                onBackdropPress={() => setAttachmentModalVisible(false)}
                onBackButtonPress={() => setAttachmentModalVisible(false)}
                style={styles.modal}
            >
                <View style={[styles.bottomSheet, { backgroundColor: theme.colors.card }]}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.attachmentOptions}>
                        <TouchableOpacity 
                            style={styles.attachmentOptionBtn}
                            onPress={() => {
                                setAttachmentModalVisible(false);
                                onAttachCamera?.();
                            }}
                        >
                            <View style={[styles.attachmentIconContainer, { backgroundColor: '#FF5722' }]}>
                                <Icon name="camera" size={30} color="#FFF" />
                            </View>
                            <Text style={[styles.attachmentOptionText, { color: theme.colors.text }]}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.attachmentOptionBtn}
                            onPress={() => {
                                setAttachmentModalVisible(false);
                                onAttachGallery?.();
                            }}
                        >
                            <View style={[styles.attachmentIconContainer, { backgroundColor: '#4CAF50' }]}>
                                <Icon name="image" size={30} color="#FFF" />
                            </View>
                            <Text style={[styles.attachmentOptionText, { color: theme.colors.text }]}>Gallery</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.attachmentOptionBtn}
                            onPress={() => {
                                setAttachmentModalVisible(false);
                                onAttachDocument?.();
                            }}
                        >
                            <View style={[styles.attachmentIconContainer, { backgroundColor: '#007AFF' }]}>
                                <Icon name="document" size={30} color="#FFF" />
                            </View>
                            <Text style={[styles.attachmentOptionText, { color: theme.colors.text }]}>Document</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ChatInput;
