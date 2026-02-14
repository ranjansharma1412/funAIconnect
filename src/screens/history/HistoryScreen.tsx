import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './HistoryScreenStyles';

import { useTranslation } from 'react-i18next';

const HistoryScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('navigation.history')}</Text>
        </View>
    );
};

export default HistoryScreen;
