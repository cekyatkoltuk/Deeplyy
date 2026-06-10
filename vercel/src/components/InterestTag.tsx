import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../utils/theme';

interface InterestTagProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    size?: 'small' | 'medium';
}

export const InterestTag: React.FC<InterestTagProps> = ({
    label,
    selected = false,
    onPress,
    size = 'medium',
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
            style={[
                styles.tag,
                selected && styles.selected,
                size === 'small' && styles.small,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    selected && styles.selectedText,
                    size === 'small' && styles.smallText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    selected: {
        backgroundColor: 'rgba(255, 107, 107, 0.15)',
        borderColor: Colors.primary,
    },
    small: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
    },
    text: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.medium,
    },
    selectedText: {
        color: Colors.primary,
    },
    smallText: {
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
});
