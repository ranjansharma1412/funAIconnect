import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './ImageEditorModalStyle';

const TOOLS = [
    { id: 'crop', icon: 'crop-outline', label: 'Crop' },
    { id: 'rotate', icon: 'refresh-outline', label: 'Rotate' },
    { id: 'filter', icon: 'color-filter-outline', label: 'Filter' },
    { id: 'brightness', icon: 'sunny-outline', label: 'Bright' },
    { id: 'text', icon: 'text-outline', label: 'Text' },
];

interface ImageEditorModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
    onApply: (uri: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ visible, imageUri, onClose, onApply }) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    const handleUseOriginal = () => {
        if (imageUri) {
            onApply(imageUri);
        }
    };

    const handleApply = () => {
        if (imageUri) {
            // Placeholder: currently just applies the original
            onApply(imageUri);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleUseOriginal}>
                        <Text style={styles.headerText}>Use Original</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleApply}>
                        <Text style={styles.applyText}>Apply</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Image View */}
                <View style={styles.imageContainer}>
                    {imageUri ? (
                        <FastImage 
                            source={{ uri: imageUri }} 
                            style={styles.image as any} 
                            resizeMode={FastImage.resizeMode.contain} 
                        />
                    ) : (
                        <Text style={{ color: 'white' }}>No image to edit</Text>
                    )}
                </View>

                {/* Bottom Toolbar */}
                <View style={styles.toolbar}>
                    {TOOLS.map((tool) => {
                        const isActive = selectedTool === tool.id;
                        return (
                            <TouchableOpacity
                                key={tool.id}
                                style={styles.toolButton}
                                onPress={() => setSelectedTool(tool.id)}
                            >
                                <Ionicons 
                                    name={tool.icon} 
                                    size={28} 
                                    color={isActive ? theme.colors.primary : theme.colors.textSecondary} 
                                />
                                <Text style={isActive ? styles.toolTextActive : styles.toolText}>
                                    {tool.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </Modal>
    );
};

export default ImageEditorModal;
