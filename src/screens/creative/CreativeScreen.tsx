import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
    Linking,
    StyleSheet
} from 'react-native';
import Button from '../../components/atoms/button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '../../services/postService';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './CreativeScreenStyle';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { useRoute } from '@react-navigation/native';


const CreativeScreen = () => {
    const { theme } = useTheme();
    const route = useRoute<any>();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        if (route.params) {
            const { initialImage, initialDescription, initialHashtags } = route.params;
            if (initialImage) setSelectedImage(initialImage);
            if (initialDescription) setDescription(initialDescription);
            if (initialHashtags) setHashtags(initialHashtags);
        }
    }, [route.params]);

    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const device = useCameraDevice('back');
    const { hasPermission, requestPermission } = useCameraPermission();
    const camera = useRef<Camera>(null);

    const handleGalleryPick = async () => {
        const options: ImageLibraryOptions = {
            mediaType: 'photo',
            quality: 0.8,
        };

        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.errorCode) {
            console.log('ImagePicker Error: ', result.errorMessage);
            Alert.alert('Error', result.errorMessage);
        } else if (result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri || null);
        }
    };

    const handleCameraCapture = async () => {
        const permissionStatus = await requestPermission();
        if (!permissionStatus) {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Settings', onPress: () => Linking.openSettings() },
            ]);
            return;
        }

        setIsCameraOpen(true);
    };

    const takePhoto = async () => {
        if (camera.current) {
            try {
                const photo = await camera.current.takePhoto({
                    flash: 'off',
                });
                setSelectedImage(`file://${photo.path}`);
                setIsCameraOpen(false);
            } catch (error) {
                console.error('Failed to take photo:', error);
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state.auth); // Assuming RootState is any for now or import it
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = async () => {
        if (!selectedImage) {
            Alert.alert('Validation', 'Please select an image first.');
            return;
        }
        if (!description) {
            Alert.alert('Validation', 'Please add a description.');
            return;
        }

        setIsPosting(true);
        try {
            // Use user data from store, fallback to defaults if not logged in (for dev)
            const userName = user?.name || 'Guest User';
            const userHandle = user?.username || '@guest';
            const userImage = user?.avatar || 'https://via.placeholder.com/150';

            const payload: any = { // Use 'any' or import CreatePostPayload to avoid strict type checks for now if types mismatch slightly
                userName,
                userHandle,
                userImage,
                description,
                hashtags,
                isVerified: user?.isVerified || false,
                postImage: {
                    uri: selectedImage,
                    type: 'image/jpeg', // Simple default
                    fileName: 'upload.jpg',
                }
            };

            console.log('Sending post payload:', JSON.stringify(payload, null, 2)); // Debug log
            const response = await postService.createPost(payload);
            console.log('Post created successfully:', response);

            Alert.alert('Success', 'Post created successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setDescription('');
                        setHashtags('');
                        setSelectedImage(null);
                        // Optional: Navigate back or to feed
                        // navigation.navigate('Dashboard'); 
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create post');
            console.error('Post creation error:', error);
        } finally {
            setIsPosting(false);
        }
    };

    if (isCameraOpen && device) {
        return (
            <View style={StyleSheet.absoluteFill}>
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={true}
                    photo={true}
                    ref={camera}
                />
                <TouchableOpacity style={styles.closeCameraButton} onPress={() => setIsCameraOpen(false)}>
                    <Text style={styles.closeCameraText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
            </View>
        );
    }

    if (isCameraOpen && !device) {
        return (
            <View style={styles.centeredContainer}>
                <Text style={styles.errorText}>Camera device not found</Text>
                <TouchableOpacity onPress={() => setIsCameraOpen(false)} style={{ padding: 20 }}>
                    <Text style={styles.linkText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.header}>Create New Post</Text>

                <TouchableOpacity style={styles.imagePreview} onPress={handleGalleryPick}>
                    {selectedImage ? (
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} />
                    ) : (
                        <Text style={styles.placeholderText}>Tap to select an image</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What's on your mind?"
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Hashtags</Text>
                    <TextInput
                        style={[styles.input, styles.hashtagsInput]}
                        placeholder="#fun #ai #connect"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={hashtags}
                        onChangeText={setHashtags}
                    />
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleCameraCapture}
                    >
                        <Text style={styles.actionButtonText}>Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleGalleryPick}
                    >
                        <Text style={styles.actionButtonText}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title={isPosting ? "Posting..." : "Post"}
                    onPress={handlePost}
                    useGradient={true}
                    style={{ marginTop: 20, opacity: isPosting ? 0.7 : 1 }}
                    disabled={isPosting}
                />
            </ScrollView>
        </View>
    );
};


export default CreativeScreen;
