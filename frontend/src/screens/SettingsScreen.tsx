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

export const SettingsScreen = ({ navigation }: any) => {
    const { logout } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [matchNotifications, setMatchNotifications] = useState(true);
    const [messageNotifications, setMessageNotifications] = useState(true);
    const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');
    const [showOnline, setShowOnline] = useState(true);

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
                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Push Notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>New Matches</Text>
                        <Switch
                            value={matchNotifications}
                            onValueChange={setMatchNotifications}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Messages</Text>
                        <Switch
                            value={messageNotifications}
                            onValueChange={setMessageNotifications}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Distance Unit</Text>
                        <View style={styles.segmentControl}>
                            <TouchableOpacity
                                style={[styles.segment, distanceUnit === 'km' && styles.segmentActive]}
                                onPress={() => setDistanceUnit('km')}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        distanceUnit === 'km' && styles.segmentTextActive,
                                    ]}
                                >
                                    km
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segment, distanceUnit === 'mi' && styles.segmentActive]}
                                onPress={() => setDistanceUnit('mi')}
                            >
                                <Text
                                    style={[
                                        styles.segmentText,
                                        distanceUnit === 'mi' && styles.segmentTextActive,
                                    ]}
                                >
                                    mi
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Show Online Status</Text>
                        <Switch
                            value={showOnline}
                            onValueChange={setShowOnline}
                            trackColor={{ false: Colors.border, true: Colors.primary }}
                            thumbColor={Colors.white}
                        />
                    </View>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Change Email</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Change Password</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('BlockedUsers')}>
                        <Text style={styles.settingText}>Blocked Users</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Legal */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Terms of Service</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Privacy Policy</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.settingText}>Licenses</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.dangerTitle]}>
                        Danger Zone
                    </Text>
                    <TouchableOpacity style={styles.settingRow}>
                        <Text style={styles.dangerText}>Delete Account</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="Log Out"
                    onPress={logout}
                    variant="outline"
                    size="large"
                    fullWidth
                    style={styles.logoutBtn}
                />
            </ScrollView>
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
    segmentControl: {
        flexDirection: 'row',
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
    },
    segment: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    segmentActive: {
        backgroundColor: Colors.primary,
    },
    segmentText: {
        color: Colors.textMuted,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.medium,
    },
    segmentTextActive: {
        color: Colors.white,
    },
    dangerTitle: {
        color: Colors.error,
    },
    dangerText: {
        color: Colors.error,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        flex: 1,
    },
    logoutBtn: {
        marginTop: Spacing.md,
    },
});
