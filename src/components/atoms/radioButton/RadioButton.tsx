import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './RadioButtonStyles';

interface RadioButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onPress }) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.outerCircle}>
                {selected && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

export default RadioButton;
