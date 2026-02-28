import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../utils/theme';
import { InterestTag } from '../components/InterestTag';
import { PremiumLockOverlay } from '../components/PremiumLockOverlay';
import { PremiumModal } from '../components/PremiumModal';
import { Button } from '../components/Button';
import { usePremiumStore } from '../store/premiumStore';
import { INTERESTS, MIN_AGE, MAX_AGE, MIN_DISTANCE, MAX_DISTANCE } from '../utils/constants';

export const DiscoveryFiltersScreen = ({ navigation }: any) => {
    const { isPremium, togglePremium } = usePremiumStore();
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [ageRange, setAgeRange] = useState<[number, number]>([18, 35]);
    const [distance, setDistance] = useState(50);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [location, setLocation] = useState('Current Location');

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Discovery Filters</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.doneBtn}>Done</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Premium Lock */}
                {!isPremium && (
                    <View style={styles.premiumBanner}>
                        <Text style={styles.premiumBannerIcon}>👑</Text>
                        <View style={styles.premiumBannerText}>
                            <Text style={styles.premiumBannerTitle}>Premium Feature</Text>
                            <Text style={styles.premiumBannerSubtitle}>
                                Unlock advanced filters with Premium
                            </Text>
                        </View>
                        <Button
                            title="Unlock"
                            onPress={() => setShowPremiumModal(true)}
                            variant="premium"
                            size="small"
                        />
                    </View>
                )}

                {/* Filters (with lock overlay for non-premium) */}
                <View style={styles.filtersWrapper}>
                    {!isPremium && (
                        <PremiumLockOverlay
                            onPress={() => setShowPremiumModal(true)}
                            message="Advanced Filters"
                        />
                    )}

                    {/* Age Range */}
                    <View style={styles.filterSection}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterLabel}>Age Range</Text>
                            <Text style={styles.filterValue}>
                                {ageRange[0]} - {ageRange[1]}
                            </Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={MIN_AGE}
                            maximumValue={MAX_AGE}
                            value={ageRange[0]}
                            onValueChange={(val) => setAgeRange([Math.round(val), ageRange[1]])}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor={Colors.border}
                            thumbTintColor={Colors.primary}
                        />
                        <Slider
                            style={styles.slider}
                            minimumValue={MIN_AGE}
                            maximumValue={MAX_AGE}
                            value={ageRange[1]}
                            onValueChange={(val) => setAgeRange([ageRange[0], Math.round(val)])}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor={Colors.border}
                            thumbTintColor={Colors.primary}
                        />
                    </View>

                    {/* Distance */}
                    <View style={styles.filterSection}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterLabel}>Maximum Distance</Text>
                            <Text style={styles.filterValue}>{distance} km</Text>
                        </View>
                        <Slider
                            style={styles.slider}
                            minimumValue={MIN_DISTANCE}
                            maximumValue={MAX_DISTANCE}
                            value={distance}
                            onValueChange={(val) => setDistance(Math.round(val))}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor={Colors.border}
                            thumbTintColor={Colors.primary}
                        />
                    </View>

                    {/* Location */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Location</Text>
                        <TouchableOpacity style={styles.locationBtn}>
                            <Text style={styles.locationIcon}>📍</Text>
                            <Text style={styles.locationText}>{location}</Text>
                            <Text style={styles.locationArrow}>›</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Interests */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Interests</Text>
                        <Text style={styles.filterSubtext}>
                            Show people with similar interests
                        </Text>
                        <View style={styles.interestsGrid}>
                            {INTERESTS.map((interest) => (
                                <InterestTag
                                    key={interest}
                                    label={interest}
                                    selected={selectedInterests.includes(interest)}
                                    onPress={() => toggleInterest(interest)}
                                    size="small"
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Apply Button */}
                <Button
                    title="Apply Filters"
                    onPress={() => navigation.goBack()}
                    variant="primary"
                    size="large"
                    fullWidth
                    disabled={!isPremium}
                />
            </ScrollView>

            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onSubscribe={() => {
                    togglePremium();
                    setShowPremiumModal(false);
                }}
            />
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
        fontWeight: FontWeights.medium,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    doneBtn: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    premiumBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    premiumBannerIcon: {
        fontSize: 28,
    },
    premiumBannerText: {
        flex: 1,
    },
    premiumBannerTitle: {
        color: Colors.premiumGold,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
    premiumBannerSubtitle: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
    },
    filtersWrapper: {
        position: 'relative',
        marginBottom: Spacing.lg,
    },
    filterSection: {
        marginBottom: Spacing.xl,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    filterLabel: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.sm,
    },
    filterValue: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
    filterSubtext: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        marginBottom: Spacing.md,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    locationIcon: {
        fontSize: 18,
    },
    locationText: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
    },
    locationArrow: {
        color: Colors.textMuted,
        fontSize: FontSizes.xl,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
});
