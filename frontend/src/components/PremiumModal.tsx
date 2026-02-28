import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../utils/theme';
import { PREMIUM_FEATURES } from '../utils/constants';
import { Button } from './Button';

interface PremiumModalProps {
    visible: boolean;
    onClose: () => void;
    onSubscribe: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
    visible,
    onClose,
    onSubscribe,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <LinearGradient
                                colors={[Colors.surfaceLight, Colors.surface]}
                                style={styles.modal}
                            >
                                {/* Header */}
                                <View style={styles.header}>
                                    <Text style={styles.crown}>👑</Text>
                                    <Text style={styles.title}>Unlock Premium</Text>
                                    <Text style={styles.subtitle}>
                                        You must be a premium user to access this feature.
                                    </Text>
                                </View>

                                {/* Features */}
                                <View style={styles.features}>
                                    {PREMIUM_FEATURES.map((feature, index) => (
                                        <View key={index} style={styles.featureRow}>
                                            <Text style={styles.featureIcon}>{feature.icon}</Text>
                                            <View style={styles.featureText}>
                                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                                <Text style={styles.featureDesc}>{feature.description}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                {/* Pricing */}
                                <View style={styles.pricing}>
                                    <TouchableOpacity style={styles.planCard}>
                                        <Text style={styles.planName}>Monthly</Text>
                                        <Text style={styles.planPrice}>$9.99/mo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.planCard, styles.planCardBest]}>
                                        <View style={styles.bestBadge}>
                                            <Text style={styles.bestBadgeText}>BEST VALUE</Text>
                                        </View>
                                        <Text style={styles.planName}>Yearly</Text>
                                        <Text style={styles.planPrice}>$4.99/mo</Text>
                                        <Text style={styles.planBilled}>Billed $59.99/year</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Actions */}
                                <Button
                                    title="Subscribe Now"
                                    onPress={onSubscribe}
                                    variant="premium"
                                    size="large"
                                    fullWidth
                                />

                                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                    <Text style={styles.closeText}>Maybe Later</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        maxHeight: '90%',
    },
    modal: {
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    crown: {
        fontSize: 48,
        marginBottom: Spacing.sm,
    },
    title: {
        color: Colors.premiumGold,
        fontSize: FontSizes.xxl,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        textAlign: 'center',
        lineHeight: 20,
    },
    features: {
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    featureIcon: {
        fontSize: 24,
        width: 36,
        textAlign: 'center',
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
    featureDesc: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
    },
    pricing: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    planCard: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.border,
    },
    planCardBest: {
        borderColor: Colors.premiumGold,
    },
    bestBadge: {
        backgroundColor: Colors.premiumGold,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.xs,
        marginBottom: Spacing.xs,
    },
    bestBadgeText: {
        color: Colors.black,
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    planName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.xs,
    },
    planPrice: {
        color: Colors.premiumGold,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    planBilled: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        marginTop: Spacing.xs,
    },
    closeBtn: {
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    closeText: {
        color: Colors.textMuted,
        fontSize: FontSizes.body,
    },
});
