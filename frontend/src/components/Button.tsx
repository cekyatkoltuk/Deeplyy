import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../utils/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
}) => {
    const sizeStyles = {
        small: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, fontSize: FontSizes.sm },
        medium: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, fontSize: FontSizes.body },
        large: { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xl, fontSize: FontSizes.lg },
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white} />
            ) : (
                <>
                    {icon && <>{icon}</>}
                    <Text
                        style={[
                            styles.text,
                            { fontSize: sizeStyles[size].fontSize },
                            variant === 'outline' && styles.outlineText,
                            variant === 'ghost' && styles.ghostText,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </>
    );

    if (variant === 'primary' || variant === 'premium') {
        const gradientColors: [string, string] =
            variant === 'premium'
                ? [Colors.premiumGradientStart, Colors.premiumGradientEnd]
                : [Colors.primaryGradientStart, Colors.primaryGradientEnd];

        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[fullWidth && styles.fullWidth, style]}
            >
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.button,
                        {
                            paddingVertical: sizeStyles[size].paddingVertical,
                            paddingHorizontal: sizeStyles[size].paddingHorizontal,
                        },
                        disabled && styles.disabled,
                        fullWidth && styles.fullWidth,
                    ]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            style={[
                styles.button,
                {
                    paddingVertical: sizeStyles[size].paddingVertical,
                    paddingHorizontal: sizeStyles[size].paddingHorizontal,
                },
                variant === 'secondary' && styles.secondary,
                variant === 'outline' && styles.outline,
                variant === 'ghost' && styles.ghost,
                disabled && styles.disabled,
                fullWidth && styles.fullWidth,
                style,
            ]}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.xl,
        gap: Spacing.sm,
        ...Shadows.small,
    },
    text: {
        color: Colors.white,
        fontWeight: FontWeights.semiBold,
    },
    secondary: {
        backgroundColor: Colors.surfaceLight,
    },
    outline: {
        backgroundColor: Colors.transparent,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    outlineText: {
        color: Colors.primary,
    },
    ghost: {
        backgroundColor: Colors.transparent,
        shadowOpacity: 0,
        elevation: 0,
    },
    ghostText: {
        color: Colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: '100%',
    },
});
