import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../utils/theme';

interface PremiumLockOverlayProps {
    onPress: () => void;
    message?: string;
}

export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({
    onPress,
    message = 'Premium Feature',
}) => {
    return (
        <TouchableOpacity
            style={styles.overlay}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.content}>
                <Text style={styles.lockIcon}>Locked</Text>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.subtext}>Tap to unlock</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 15, 26, 0.85)',
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    content: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    lockIcon: {
        fontSize: 40,
        fontFamily: FontFamily.heading,
    },
    message: {
        color: Colors.premiumGold,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
    },
    subtext: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
});
