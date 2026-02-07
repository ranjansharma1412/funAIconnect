import { StyleSheet, Dimensions } from 'react-native';
import { Theme } from '../../theme/theme';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const ITEM_WIDTH = (width - 40 - (COLUMN_COUNT - 1) * 10) / COLUMN_COUNT; // 40 padding, 10 gap

export const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
    },
    generatorContainer: {
        backgroundColor: theme.colors.card,
        borderRadius: 16,
        padding: 15,
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    promptInput: {
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        padding: 15,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        color: theme.colors.text,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    generateButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    generateButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Result Section
    resultContainer: {
        marginBottom: 30,
    },
    generatedImageContainer: {
        width: '100%',
        height: 300,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 15,
        position: 'relative',
        backgroundColor: theme.colors.card,
    },
    generatedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    regenerateButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    resultInputs: {
        gap: 10,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text,
        marginLeft: 4,
    },
    resultInput: {
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: theme.colors.text,
    },
    createPostButton: {
        marginTop: 15,
        backgroundColor: theme.colors.secondary || '#03DAC6',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    createPostButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Trending Section
    trendingSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: 15,
    },
    trendingGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    trendingItem: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: theme.colors.card,
    },
    trendingImage: {
        width: '100%',
        height: '100%',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    }
});
