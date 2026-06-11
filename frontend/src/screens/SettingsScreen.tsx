import React, { useState } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../utils/theme';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { usePremiumStore } from '../store/premiumStore';

export const SettingsScreen = ({ navigation }: any) => {
    const { logout } = useAuthStore();
    const { isPremium, togglePremium } = usePremiumStore();
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Dev Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Developer Settings</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Premium (Dev Toggle)</Text>
                        <Switch
                            value={isPremium}
                            onValueChange={togglePremium}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </View>

                {/* Subscription Status */}
                {isPremium && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Subscription</Text>
                        <View style={styles.subscriptionCard}>
                            <Text style={styles.subscriptionPlan}>Premium Monthly</Text>
                            <Text style={styles.subscriptionDate}>
                                Renews: March 28, 2026
                            </Text>
                            <TouchableOpacity>
                                <Text style={styles.manageSub}>Manage Subscription</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Change Phone Number</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Change Email</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Change Password</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.dangerText}>Delete Account</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Fixed Footer */}
            <View style={styles.footer}>
                <Button
                    title="Log Out"
                    onPress={logout}
                    variant="outline"
                    size="large"
                    fullWidth
                    style={styles.logoutBtn}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xxl + Spacing.sm,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: Spacing.md,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    settingText: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        flex: 1,
    },
    arrow: {
        color: Colors.textMuted,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
    },
    dangerText: {
        color: Colors.error,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        flex: 1,
    },
    footer: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: Colors.surface,
    },
    logoutBtn: {
        marginTop: 0,
    },
    subscriptionCard: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.premiumGold,
        gap: Spacing.xs,
    },
    subscriptionPlan: {
        color: Colors.premiumGold,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
    subscriptionDate: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
    manageSub: {
        color: Colors.primary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.medium,
        marginTop: Spacing.xs,
    },
});
