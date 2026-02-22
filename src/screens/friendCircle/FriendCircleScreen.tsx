import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { styles } from './FriendCircleScreenStyles';

import { useTranslation } from 'react-i18next';

const FriendCircleScreen = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.text, { color: theme.colors.text }]}>{t('navigation.friendCircle')}</Text>
        </View>
    );
};

export default FriendCircleScreen;
