import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FontFamily,
  Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows
} from '../../utils/theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { InterestTag } from '../../components/InterestTag';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { INTERESTS } from '../../utils/constants';

export const ProfileSetupScreen = ({ navigation }: any) => {
    const [step, setStep] = useState(0);
    const [bio, setBio] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const { updateProfile } = useUserStore();
    const { setAuthenticated } = useAuthStore();

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : prev.length < 6
                    ? [...prev, interest]
                    : prev
        );
    };

    const handleComplete = async () => {
        await updateProfile({
            bio,
            interests: selectedInterests,
            gender: gender || 'other',
        });
        setAuthenticated(true);
    };

    const steps = [
        // Step 0: Photos
        <View key="photos" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Add Your Photos</Text>
            <Text style={styles.stepSubtitle}>Add at least 1 photo to continue</Text>
            <View style={styles.photoGrid}>
                {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <TouchableOpacity key={idx} style={styles.photoSlot}>
                        <Text style={styles.addPhotoIcon}>{idx === 0 ? 'Add' : '+'}</Text>
                        {idx === 0 && <Text style={styles.mainLabel}>Main</Text>}
                    </TouchableOpacity>
                ))}
            </View>
        </View>,

        // Step 1: Bio & Gender
        <View key="bio" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepSubtitle}>Tell others what makes you unique</Text>
            <Input
                label="Bio"
                placeholder="Write something about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                containerStyle={styles.bioInput}
            />
            <Text style={styles.sectionLabel}>I am</Text>
            <View style={styles.genderRow}>
                {(['male', 'female', 'other'] as const).map((g) => (
                    <TouchableOpacity
                        key={g}
                        style={[styles.genderBtn, gender === g && styles.genderSelected]}
                        onPress={() => setGender(g)}
                    >
                        <Text style={styles.genderIcon}>
                            {g === 'male' ? 'M' : g === 'female' ? 'F' : 'O'}
                        </Text>
                        <Text style={[styles.genderText, gender === g && styles.genderSelectedText]}>
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>,

        // Step 2: Interests
        <View key="interests" style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Interests</Text>
            <Text style={styles.stepSubtitle}>
                Pick up to 6 things you love ({selectedInterests.length}/6)
            </Text>
            <View style={styles.interestsGrid}>
                {INTERESTS.map((interest) => (
                    <InterestTag
                        key={interest}
                        label={interest}
                        selected={selectedInterests.includes(interest)}
                        onPress={() => toggleInterest(interest)}
                    />
                ))}
            </View>
        </View>,
    ];

    return (
        <LinearGradient
            colors={[Colors.background, '#1a0a2e', Colors.background]}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    {[0, 1, 2].map((idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.progressDot,
                                idx <= step && styles.progressDotActive,
                            ]}
                        />
                    ))}
                </View>

                {steps[step]}

                {/* Navigation */}
                <View style={styles.navButtons}>
                    {step > 0 && (
                        <Button
                            title="Back"
                            onPress={() => setStep(step - 1)}
                            variant="outline"
                            size="large"
                            style={styles.navBtn}
                        />
                    )}
                    <Button
                        title={step === 2 ? "Let's Go!" : 'Next'}
                        onPress={step === 2 ? handleComplete : () => setStep(step + 1)}
                        variant="primary"
                        size="large"
                        style={styles.navBtn}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Spacing.lg,
        paddingTop: Spacing.xxl + Spacing.lg,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    progressDot: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.border,
    },
    progressDotActive: {
        backgroundColor: Colors.primary,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    stepSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        marginBottom: Spacing.xl,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    photoSlot: {
        width: '30%',
        aspectRatio: 0.75,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1.5,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoIcon: {
        fontSize: 28,
        fontFamily: FontFamily.heading,
    
        color: Colors.textMuted,
    },
    mainLabel: {
        color: Colors.primary,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
        marginTop: Spacing.xs,
    },
    bioInput: {
        marginBottom: Spacing.lg,
    },
    sectionLabel: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.md,
    },
    genderRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    genderBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.surfaceLight,
        borderWidth: 1.5,
        borderColor: Colors.border,
        gap: Spacing.sm,
    },
    genderSelected: {
        borderColor: Colors.primary,
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
    genderIcon: {
        fontSize: 32,
        fontFamily: FontFamily.heading,
    
    },
    genderText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.medium,
    },
    genderSelectedText: {
        color: Colors.primary,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    navButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.xl,
        paddingBottom: Spacing.lg,
    },
    navBtn: {
        flex: 1,
    },
    fullBtn: {
        flex: 1,
    },
});
