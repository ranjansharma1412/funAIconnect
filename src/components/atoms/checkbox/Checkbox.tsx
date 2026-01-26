import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './CheckboxStyles';

interface CheckboxProps {
    label: string;
    checked: boolean;
    onPress: () => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.box, checked && styles.boxChecked]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default Checkbox;
