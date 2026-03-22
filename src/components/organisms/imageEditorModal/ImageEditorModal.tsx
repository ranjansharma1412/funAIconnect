import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, PanResponder, Platform, StyleSheet, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './ImageEditorModalStyle';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Canvas, Image as SkiaImage, Text as SkiaText, useImage, matchFont, useCanvasRef } from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';

interface TextLayer {
    id: string;
    text: string;
    x: number;
    y: number;
    color: string;
    fontSize: number;
    fontFamily: string;
    fontStyle: 'normal' | 'italic';
    fontWeight: 'normal' | 'bold';
}

const COLORS = ['#FFFFFF', '#000000', '#FF3B30', '#34C759', '#007AFF', '#FF9500', '#FF2D55', '#AF52DE'];
const FONTS = Platform.select({
    ios: ['System', 'Courier', 'Georgia', 'Helvetica', 'Times New Roman'],
    android: ['System', 'monospace', 'serif', 'sans-serif', 'sans-serif-condensed'],
    default: ['System', 'monospace', 'serif', 'sans-serif']
}) || ['System'];

const SkiaTextLayerComponent: React.FC<{ layer: TextLayer }> = ({ layer }) => {
    const fontStyle = {
        fontFamily: layer.fontFamily === 'System' ? undefined : layer.fontFamily,
        fontSize: layer.fontSize,
        fontStyle: layer.fontStyle,
        fontWeight: layer.fontWeight,
    };
    const font = matchFont(fontStyle as any);
    return <SkiaText text={layer.text} x={layer.x} y={layer.y} color={layer.color} font={font} />;
};

const normalizeUri = (uri: string | null) => {
    if (!uri) return null;
    if (Platform.OS === 'ios' && !uri.startsWith('file://') && !uri.startsWith('http')) {
        return `file://${uri}`;
    }
    return uri;
};

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
    const [editedImageUri, setEditedImageUri] = useState<string | null>(normalizeUri(imageUri));
    const [texts, setTexts] = useState<TextLayer[]>([]);
    const [isAddingText, setIsAddingText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [inputColor, setInputColor] = useState('#FFFFFF');
    const [inputFontFamily, setInputFontFamily] = useState('System');
    const [inputFontStyle, setInputFontStyle] = useState<'normal' | 'italic'>('normal');
    const [inputFontWeight, setInputFontWeight] = useState<'normal' | 'bold'>('normal');
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const canvasRef = useCanvasRef();
    const skiaImage = useImage(editedImageUri);

    const dragContext = React.useRef({ id: null as string | null, startX: 0, startY: 0 });
    const textsRef = React.useRef(texts);
    textsRef.current = texts;

    const panResponder = React.useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const { locationX, locationY } = evt.nativeEvent;
            const hit = textsRef.current.find(t => 
                locationX >= t.x && locationX <= t.x + (t.text.length * 15) &&
                locationY >= t.y - t.fontSize && locationY <= t.y + 10
            );
            if (hit) {
                dragContext.current = { id: hit.id, startX: hit.x, startY: hit.y };
            } else {
                dragContext.current = { id: null, startX: 0, startY: 0 };
            }
        },
        onPanResponderMove: (evt, gestureState) => {
            if (dragContext.current.id) {
                const { id, startX, startY } = dragContext.current;
                setTexts(prev => prev.map(t => 
                    t.id === id 
                        ? { ...t, x: startX + gestureState.dx, y: startY + gestureState.dy } 
                        : t
                ));
            }
        },
        onPanResponderRelease: () => {
            dragContext.current.id = null;
        }
    }), []);

    // Sync state when new image is provided
    useEffect(() => {
        setEditedImageUri(normalizeUri(imageUri));
    }, [imageUri]);

    const handleUseOriginal = () => {
        if (imageUri) {
            onApply(imageUri);
        }
    };

    const handleApply = async () => {
        if (!editedImageUri) return;

        if (texts.length > 0 && canvasRef.current) {
            try {
                const imageSnapshot = canvasRef.current.makeImageSnapshot();
                if (imageSnapshot) {
                    const base64 = imageSnapshot.encodeToBase64();
                    const newUri = `${RNFS.CachesDirectoryPath}/edited_${Date.now()}.png`;
                    await RNFS.writeFile(newUri, base64, 'base64');
                    onApply(`file://${newUri}`);
                    return;
                }
            } catch (err) {
                console.log('Error creating snapshot', err);
            }
        }

        onApply(editedImageUri);
    };

    const handleToolPress = async (toolId: string) => {
        setSelectedTool(toolId);
        
        if (!editedImageUri) return;

        try {
            if (toolId === 'crop' || toolId === 'rotate') {
                const result = await ImageCropPicker.openCropper({
                    path: editedImageUri,
                    mediaType: 'photo',
                    freeStyleCropEnabled: true,
                    compressImageQuality: 0.9,
                });
                
                if (result && result.path) {
                    setEditedImageUri(normalizeUri(result.path));
                }
                setSelectedTool(null);
            } else if (toolId === 'text') {
                setIsAddingText(true);
            }
            // Add logic for other tools here in the future
        } catch (error) {
            console.log('Image crop/rotate cancelled or failed', error);
            setSelectedTool(null);
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
                <View 
                    style={styles.imageContainer} 
                    onLayout={(e) => setCanvasSize(e.nativeEvent.layout)}
                    {...panResponder.panHandlers}
                >
                    {editedImageUri ? (
                        <Canvas style={StyleSheet.absoluteFill} ref={canvasRef}>
                            {skiaImage && (
                                <SkiaImage 
                                    image={skiaImage} 
                                    fit="contain" 
                                    x={0} 
                                    y={0} 
                                    width={canvasSize.width} 
                                    height={canvasSize.height} 
                                />
                            )}
                            {texts.map(t => (
                                <SkiaTextLayerComponent key={t.id} layer={t} />
                            ))}
                        </Canvas>
                    ) : (
                        <Text style={{ color: 'white' }}>No image to edit</Text>
                    )}
                </View>

                {/* Text Input Overlay */}
                {isAddingText && (
                    <View style={styles.textInputOverlay}>
                        <TextInput
                            autoFocus
                            style={[styles.textInput, {
                                color: inputColor, 
                                fontFamily: inputFontFamily !== 'System' ? inputFontFamily : undefined,
                                fontStyle: inputFontStyle,
                                fontWeight: inputFontWeight as any
                            }]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Enter text..."
                            placeholderTextColor="#ccc"
                            onSubmitEditing={() => {
                                if (inputText.trim()) {
                                    setTexts([...texts, { 
                                        id: Math.random().toString(), 
                                        text: inputText, 
                                        x: canvasSize.width / 2 - 50, 
                                        y: canvasSize.height / 2, 
                                        color: inputColor, 
                                        fontSize: 32,
                                        fontFamily: inputFontFamily,
                                        fontStyle: inputFontStyle,
                                        fontWeight: inputFontWeight
                                    }]);
                                }
                                setIsAddingText(false);
                                setInputText('');
                                setSelectedTool(null);
                            }}
                            returnKeyType="done"
                        />
                        <View style={styles.textStylingToolbar}>
                            <View style={styles.styleRowScroll}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {COLORS.map(c => (
                                        <TouchableOpacity 
                                            key={c} 
                                            style={[styles.colorSwatch, { backgroundColor: c }, inputColor === c && styles.colorSwatchSelected]} 
                                            onPress={() => setInputColor(c)} 
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.styleRowScroll}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {FONTS.map(f => (
                                        <TouchableOpacity 
                                            key={f} 
                                            style={[styles.fontPill, inputFontFamily === f && styles.fontPillSelected]} 
                                            onPress={() => setInputFontFamily(f)}
                                        >
                                            <Text style={styles.fontPillText}>{f}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.styleRow}>
                                <TouchableOpacity 
                                    style={[styles.styleToggle, inputFontWeight === 'bold' && styles.styleToggleSelected]} 
                                    onPress={() => setInputFontWeight(inputFontWeight === 'bold' ? 'normal' : 'bold')}
                                >
                                    <Text style={[styles.styleToggleText, { fontWeight: 'bold' }]}>B</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.styleToggle, inputFontStyle === 'italic' && styles.styleToggleSelected]} 
                                    onPress={() => setInputFontStyle(inputFontStyle === 'italic' ? 'normal' : 'italic')}
                                >
                                    <Text style={[styles.styleToggleText, { fontStyle: 'italic' }]}>I</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Bottom Toolbar */}
                <View style={styles.toolbar}>
                    {TOOLS.map((tool) => {
                        const isActive = selectedTool === tool.id;
                        return (
                            <TouchableOpacity
                                key={tool.id}
                                style={styles.toolButton}
                                onPress={() => handleToolPress(tool.id)}
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
