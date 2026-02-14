import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { createStyles } from './AIScreenStyle';
import Button from '../../components/atoms/button/Button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Mock Data for Trending
const TRENDING_CREATIONS = [
    { id: '1', uri: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop', prompt: 'Cyberpunk city at night, neon lights', desc: 'Neon dreams in the cyberpunk city.', tags: '#cyberpunk #neon #city' },
    { id: '2', uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop', prompt: 'Astronaut surfing in space nebula', desc: 'Catching waves in the nebula.', tags: '#space #surreal #art' },
    { id: '3', uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop', prompt: 'Minimalist geometric abstract shapes', desc: 'Abstract harmony.', tags: '#abstract #minimal #design' },
    { id: '4', uri: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop', prompt: 'Digital earth network connection', desc: 'Connected world.', tags: '#tech #network #future' },
];

const MOCK_GENERATED_IMAGES = [
    'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=800&auto=format&fit=crop',
];

const AIScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const navigation = useNavigation<any>();

    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<{ uri: string; description: string; hashtags: string } | null>(null);

    const handleGenerate = () => {
        if (!prompt.trim()) {
            Alert.alert(t('ai.prompt_required_title'), t('ai.prompt_required_message'));
            return;
        }

        setIsLoading(true);
        // Mock API Call
        setTimeout(() => {
            const randomImage = MOCK_GENERATED_IMAGES[Math.floor(Math.random() * MOCK_GENERATED_IMAGES.length)];
            setGeneratedContent({
                uri: randomImage,
                description: `Generated art based on: ${prompt}`, // Localize this? Maybe difficult as it includes prompt.
                hashtags: '#aiart #generated #creative',
            });
            setIsLoading(false);
        }, 2000);
    };

    const handleRegenerate = () => {
        handleGenerate();
    };

    const handleUseTrending = (item: typeof TRENDING_CREATIONS[0]) => {
        setPrompt(item.prompt);
        setGeneratedContent({
            uri: item.uri,
            description: item.desc,
            hashtags: item.tags,
        });
        // Scroll to top functionality could be added here if ref was used
    };

    const handleCreatePost = () => {
        if (generatedContent) {
            navigation.navigate('Creative', {
                initialImage: generatedContent.uri,
                initialDescription: generatedContent.description,
                initialHashtags: generatedContent.hashtags,
            });
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('ai.header_title')}</Text>
                    <Text style={styles.subtitle}>{t('ai.subtitle')}</Text>
                </View>

                {/* Generator Input */}
                <View style={styles.generatorContainer}>
                    <TextInput
                        style={styles.promptInput}
                        placeholder={t('ai.prompt_placeholder')}
                        placeholderTextColor={theme.colors.textSecondary}
                        multiline
                        value={prompt}
                        onChangeText={setPrompt}
                    />
                    <Button
                        title={isLoading ? t('ai.generating_button') : t('ai.generate_button')}
                        onPress={handleGenerate}
                        useGradient={true}
                        style={isLoading ? { opacity: 0.7 } : {}}
                    // To support icon, I need to update Button component or usage. 
                    // For now, let's keep it simple and just use title. 
                    // If user wants icon, I should update Button.
                    />
                </View>

                {/* Generated Result */}
                {generatedContent && (
                    <View style={styles.resultContainer}>
                        <View style={styles.generatedImageContainer}>
                            <Image source={{ uri: generatedContent.uri }} style={styles.generatedImage} />
                            {isLoading && (
                                <View style={styles.loadingOverlay}>
                                    <ActivityIndicator size="large" color="#FFF" />
                                </View>
                            )}
                            <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate} disabled={isLoading}>
                                <Ionicons name="refresh" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.resultInputs}>
                            <Text style={styles.resultLabel}>{t('ai.result_description_label')}</Text>
                            <TextInput
                                style={styles.resultInput}
                                value={generatedContent.description}
                                onChangeText={(text) => setGeneratedContent({ ...generatedContent, description: text })}
                                multiline
                            />
                            <Text style={styles.resultLabel}>{t('ai.result_hashtags_label')}</Text>
                            <TextInput
                                style={styles.resultInput}
                                value={generatedContent.hashtags}
                                onChangeText={(text) => setGeneratedContent({ ...generatedContent, hashtags: text })}
                            />

                            <Button
                                title={t('ai.create_post_button')}
                                onPress={handleCreatePost}
                                style={{ marginTop: 15 }}
                                useGradient={true}
                            />
                        </View>
                    </View>
                )}

                {/* Trending Section */}
                <View style={styles.trendingSection}>
                    <Text style={styles.sectionTitle}>{t('ai.trending_title')}</Text>
                    <View style={styles.trendingGrid}>
                        {TRENDING_CREATIONS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.trendingItem}
                                onPress={() => handleUseTrending(item)}
                            >
                                <Image source={{ uri: item.uri }} style={styles.trendingImage} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

export default AIScreen;
