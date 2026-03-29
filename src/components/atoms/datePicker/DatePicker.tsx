import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useTheme } from '../../../theme/ThemeContext';
import { createStyles } from './DatePickerStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

dayjs.extend(customParseFormat);

interface DatePickerProps {
    value: string; // The formatted date string
    onChange: (date: string) => void;
    label?: string;
    placeholder?: string;
    format?: string;
    editable?: boolean;
    style?: StyleProp<ViewStyle>;
    rightIcon?: React.ReactNode;
    maximumDate?: Date;
    minimumDate?: Date;
    mode?: 'date' | 'time' | 'datetime';
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    label,
    placeholder,
    format = 'DD/MM/YYYY',
    editable = true,
    style,
    rightIcon,
    maximumDate,
    minimumDate,
    mode = 'date',
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [open, setOpen] = useState(false);
    
    // Parse the value string back into a Date object or use current date if empty/invalid
    const getValidDate = () => {
        if (!value) return new Date();
        const parsedDate = dayjs(value, format, true);
        return parsedDate.isValid() ? parsedDate.toDate() : new Date();
    };

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TouchableOpacity
                    style={[styles.inputContainer, !editable && styles.inputContainerDisabled]}
                    onPress={() => editable && setOpen(true)}
                    activeOpacity={editable ? 0.7 : 1}
                >
                    <Text style={value ? styles.inputText : styles.placeholderText}>
                        {value || placeholder || 'Select Date'}
                    </Text>
                     
                    {rightIcon ? (
                        <View style={styles.rightIconContainer}>{rightIcon}</View>
                    ) : (
                        <View style={styles.rightIconContainer}>
                            <Ionicons name="calendar-outline" size={20} color={theme.colors.border} />
                        </View>
                    )}
                </TouchableOpacity>

                {editable && (
                    <RNDatePicker
                        modal
                        mode={mode}
                        open={open}
                        date={getValidDate()}
                        maximumDate={maximumDate}
                        minimumDate={minimumDate}
                        onConfirm={(date: Date) => {
                            setOpen(false);
                            onChange(dayjs(date).format(format));
                        }}
                        onCancel={() => {
                            setOpen(false);
                        }}
                    />
                )}
            </View>
        </View>
    );
};

export default DatePicker;
