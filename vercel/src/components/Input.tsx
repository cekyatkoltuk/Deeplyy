import React, { useState } from 'react';
import { FontFamily } from '../utils/theme';
import { View, TextInput, Text, StyleSheet, ViewStyle, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../utils/theme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focused,
                    error ? styles.errorBorder : null,
                ]}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input, 
                        icon ? styles.inputWithLeftIcon : null,
                        rightIcon ? styles.inputWithRightIcon : null
                    ]}
                    placeholderTextColor={Colors.textMuted}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity 
                        onPress={onRightIconPress} 
                        style={styles.rightIconContainer}
                        activeOpacity={onRightIconPress ? 0.7 : 1}
                        disabled={!onRightIconPress}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.medium,
        marginBottom: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    focused: {
        borderColor: Colors.primary,
    },
    errorBorder: {
        borderColor: Colors.error,
    },
    iconContainer: {
        paddingLeft: Spacing.md,
    },
    input: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    inputWithLeftIcon: {
        paddingLeft: Spacing.sm,
    },
    inputWithRightIcon: {
        paddingRight: Spacing.sm,
    },
    rightIconContainer: {
        paddingRight: Spacing.md,
        paddingLeft: Spacing.sm,
    },
    error: {
        color: Colors.error,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
});
