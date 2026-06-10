import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
    Modal,
    TextInput,
    Alert,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FontFamily,
  Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows
} from '../utils/theme';
import { Button } from '../components/Button';
import { InterestTag } from '../components/InterestTag';
import { Avatar } from '../components/Avatar';
import { PremiumModal } from '../components/PremiumModal';
import { AppHeader } from '../components/AppHeader';
import { useUserStore } from '../store/userStore';
import { usePremiumStore } from '../store/premiumStore';
import { useAuthStore } from '../store/authStore';
import { INTERESTS, GENDER_OPTIONS, MBTI_OPTIONS, ENNEAGRAM_OPTIONS, LOOKING_FOR_OPTIONS } from '../utils/constants';

export const ProfileScreen = ({ navigation }: any) => {
    const { profile, setInterests, loadProfile, updateProfile, uploadPhoto, removePhoto } = useUserStore();
    const { isPremium, togglePremium, checkStatus } = usePremiumStore();
    const { logout } = useAuthStore();
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [editingInterests, setEditingInterests] = useState(false);
    const [editingBio, setEditingBio] = useState(false);
    const [editingName, setEditingName] = useState(false);
    const [editingGender, setEditingGender] = useState(false);
    const [editingMbti, setEditingMbti] = useState(false);
    const [editingEnneagram, setEditingEnneagram] = useState(false);
    const [editingLookingFor, setEditingLookingFor] = useState(false);
    
    const [bioText, setBioText] = useState(profile.bio);
    const [showPhotoInput, setShowPhotoInput] = useState(false);
    const [photoUrl, setPhotoUrl] = useState('');
    const [nameText, setNameText] = useState(profile.name);

    useEffect(() => {
        loadProfile();
        checkStatus();
    }, []);

    useEffect(() => {
        setBioText(profile.bio);
        setNameText(profile.name);
    }, [profile]);

    const toggleInterest = (interest: string) => {
        const current = profile.interests;
        if (!current.includes(interest) && current.length >= 6) {
            return;
        }
        const updated = current.includes(interest)
            ? current.filter((i) => i !== interest)
            : [...current, interest];
        setInterests(updated);
    };

    const handleSaveBio = async () => {
        try {
            await updateProfile({ bio: bioText });
            setEditingBio(false);
        } catch (error) {
            if (typeof window !== 'undefined') {
                alert('Failed to save bio. Please try logging in again.');
            } else {
                Alert.alert('Error', 'Failed to save bio. Please try logging in again.');
            }
        }
    };

    const handleSaveName = async () => {
        try {
            await updateProfile({ name: nameText });
            setEditingName(false);
        } catch (error) {
            if (typeof window !== 'undefined') {
                alert('Failed to save name.');
            } else {
                Alert.alert('Error', 'Failed to save name.');
            }
        }
    };

    const handleAddPhoto = () => {
        if (!photoUrl.trim()) return;
        uploadPhoto(photoUrl.trim());
        setPhotoUrl('');
        setShowPhotoInput(false);
    };

    const handleRemovePhoto = (index: number) => {
        if (typeof window !== 'undefined') {
            // Web: use confirm
            if (confirm('Remove this photo?')) {
                removePhoto(index);
            }
        } else {
            Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removePhoto(index) },
            ]);
        }
    };

    const handleSetMainPhoto = (index: number) => {
        if (index === 0) return; // Already main
        const photos = [...profile.photos];
        const [photo] = photos.splice(index, 1);
        photos.unshift(photo);
        updateProfile({ photos } as any);
    };

    return (
        <ImageBackground source={require('../../assets/backgrounds/background_3.png')} style={styles.container}>
            <AppHeader titleImage={require('../../assets/titles/title_profile.png')} />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            uri={profile.photos[0]}
                            size={100}
                            isPremium={isPremium}
                            name={profile.name}
                        />
                        <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setShowPhotoInput(true)}>
                            <Text style={styles.editAvatarIcon}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Image 
                            source={
                                profile.gender === 'female' ? require('../../assets/icons/female_icon.png') :
                                profile.gender === 'male' ? require('../../assets/icons/male_icon.png') :
                                require('../../assets/icons/other_genders_icon.png')
                            } 
                            style={{ width: 24, height: 24 }} 
                        />
                        <Text style={styles.profileName}>
                            {profile.name}, {profile.age}
                        </Text>
                    </View>
                    <Text style={styles.profileLocation}>📍 {profile.location || 'No location set'}</Text>
                    {isPremium && (
                        <View style={styles.premiumTag}>
                            <Text style={styles.premiumTagText}> Premium Member</Text>
                        </View>
                    )}
                </View>

                {/* Premium CTA (for non-premium) */}
                {!isPremium && (
                    <TouchableOpacity
                        style={styles.premiumCta}
                        onPress={() => setShowPremiumModal(true)}
                    >
                        <LinearGradient
                            colors={[Colors.premiumGradientStart, Colors.premiumGradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.premiumCtaGradient}
                        >
                            <Text style={styles.premiumCtaIcon}>★</Text>
                            <View style={styles.premiumCtaText}>
                                <Text style={styles.premiumCtaTitle}>Upgrade to Premium</Text>
                                <Text style={styles.premiumCtaSubtitle}>
                                    Unlock all features & get more matches
                                </Text>
                            </View>
                            <Text style={styles.premiumCtaArrow}>›</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Basic Details Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Name</Text>
                        <TouchableOpacity onPress={() => setEditingName(!editingName)}>
                            <Text style={styles.editBtn}>
                                {editingName ? 'Cancel' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingName ? (
                        <View style={{ gap: Spacing.sm }}>
                            <TextInput
                                style={[styles.bioInput, { minHeight: 40 }]}
                                value={nameText}
                                onChangeText={setNameText}
                                placeholder="Your Name"
                                placeholderTextColor={Colors.textMuted}
                            />
                            <Button title="Save Name" onPress={handleSaveName} size="small" style={styles.saveBtn} />
                        </View>
                    ) : (
                        <Text style={styles.bioText}>{profile.name}</Text>
                    )}
                </View>

                {/* Bio Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>About Me</Text>
                        <TouchableOpacity onPress={() => setEditingBio(!editingBio)}>
                            <Text style={styles.editBtn}>
                                {editingBio ? 'Cancel' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingBio ? (
                        <View>
                            <TextInput
                                style={styles.bioInput}
                                value={bioText}
                                onChangeText={setBioText}
                                placeholder="Tell people about yourself..."
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                maxLength={300}
                                autoFocus
                            />
                            <Text style={styles.charCount}>{bioText.length}/300</Text>
                            <Button
                                title="Save"
                                onPress={handleSaveBio}
                                variant="primary"
                                size="small"
                                style={styles.saveBtn}
                            />
                        </View>
                    ) : (
                        <Text style={styles.bioText}>
                            {profile.bio || 'Tap "Edit" to add your bio'}
                        </Text>
                    )}
                </View>

                {/* Photos Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Photos</Text>
                        <TouchableOpacity onPress={() => setShowPhotoInput(true)}>
                            <Text style={styles.editBtn}>Add</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.photoGrid}>
                        {profile.photos.map((photo, idx) => (
                            <View key={idx} style={styles.photoItem}>
                                <TouchableOpacity
                                    style={{ flex: 1 }}
                                    onLongPress={() => handleSetMainPhoto(idx)}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri: photo }} style={styles.photoImage} />
                                </TouchableOpacity>
                                {idx === 0 && (
                                    <View style={styles.mainPhotoBadge}>
                                        <Text style={styles.mainPhotoText}>Main</Text>
                                    </View>
                                )}
                                {idx !== 0 && (
                                    <View style={styles.setMainHint}>
                                        <Text style={styles.setMainText}>Hold = Main</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.removePhotoBadge}
                                    onPress={() => handleRemovePhoto(idx)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <Text style={styles.removePhotoText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {Array.from({ length: Math.max(0, 6 - profile.photos.length) }).map((_, idx) => (
                            <TouchableOpacity
                                key={`empty-${idx}`}
                                style={styles.photoSlot}
                                onPress={() => setShowPhotoInput(true)}
                            >
                                <Text style={styles.addPhotoIcon}>+</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Interests Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                            <Text style={styles.sectionTitle}>Interests</Text>
                            {editingInterests && (
                                <Text style={{ color: Colors.textSecondary, fontSize: FontSizes.sm, fontFamily: FontFamily.body }}>
                                    {profile.interests.length}/6
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => setEditingInterests(!editingInterests)}>
                            <Text style={styles.editBtn}>
                                {editingInterests ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.interestsGrid}>
                        {(editingInterests ? INTERESTS : profile.interests).map((interest) => (
                            <InterestTag
                                key={interest}
                                label={interest}
                                selected={profile.interests.includes(interest)}
                                onPress={editingInterests ? () => toggleInterest(interest) : undefined}
                                size="small"
                            />
                        ))}
                    </View>
                </View>

                {/* Gender Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Gender</Text>
                        <TouchableOpacity onPress={() => setEditingGender(!editingGender)}>
                            <Text style={styles.editBtn}>
                                {editingGender ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingGender ? (
                        <View style={styles.interestsGrid}>
                            {GENDER_OPTIONS.map((opt) => (
                                <InterestTag
                                    key={opt.value}
                                    label={opt.label}
                                    selected={profile.gender === opt.value}
                                    onPress={() => updateProfile({ gender: opt.value } as any)}
                                    size="small"
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.bioText}>{GENDER_OPTIONS.find(o => o.value === profile.gender)?.label || profile.gender}</Text>
                    )}
                </View>

                {/* MBTI Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>MBTI</Text>
                        <TouchableOpacity onPress={() => setEditingMbti(!editingMbti)}>
                            <Text style={styles.editBtn}>
                                {editingMbti ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingMbti ? (
                        <View style={styles.interestsGrid}>
                            {MBTI_OPTIONS.map((opt) => (
                                <InterestTag
                                    key={opt}
                                    label={opt}
                                    selected={profile.mbti === opt}
                                    onPress={() => updateProfile({ mbti: opt } as any)}
                                    size="small"
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.bioText}>{profile.mbti || 'Tap "Edit" to set MBTI'}</Text>
                    )}
                </View>

                {/* Enneagram Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Enneagram</Text>
                        <TouchableOpacity onPress={() => setEditingEnneagram(!editingEnneagram)}>
                            <Text style={styles.editBtn}>
                                {editingEnneagram ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingEnneagram ? (
                        <View style={styles.interestsGrid}>
                            {ENNEAGRAM_OPTIONS.map((opt) => (
                                <InterestTag
                                    key={opt}
                                    label={opt}
                                    selected={profile.enneagram === opt}
                                    onPress={() => updateProfile({ enneagram: opt } as any)}
                                    size="small"
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.bioText}>{profile.enneagram || 'Tap "Edit" to set Enneagram'}</Text>
                    )}
                </View>

                {/* Looking For Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Looking For</Text>
                        <TouchableOpacity onPress={() => setEditingLookingFor(!editingLookingFor)}>
                            <Text style={styles.editBtn}>
                                {editingLookingFor ? 'Done' : 'Edit'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {editingLookingFor ? (
                        <View style={styles.interestsGrid}>
                            {LOOKING_FOR_OPTIONS.map((opt) => (
                                <InterestTag
                                    key={opt.value}
                                    label={opt.value}
                                    selected={profile.lookingFor === opt.value}
                                    onPress={() => updateProfile({ lookingFor: opt.value } as any)}
                                    size="small"
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.bioText}>{profile.lookingFor || 'Tap "Edit" to set what you are looking for'}</Text>
                    )}
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    {/* Dev Toggle for Premium */}
                    <View style={styles.settingRow}>
                        <Text style={styles.settingText}>Premium (Dev Toggle)</Text>
                        <Switch
                            value={isPremium}
                            onValueChange={togglePremium}
                            trackColor={{ false: Colors.border, true: Colors.premiumGold }}
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

                {/* Logout */}
                <View style={styles.logoutContainer}>
                    <Button
                        title="Log Out"
                        onPress={logout}
                        variant="outline"
                        size="large"
                        fullWidth
                    />
                </View>

                <Text style={styles.version}>Deeplyy v1.0.0</Text>
            </ScrollView>

            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onSubscribe={() => {
                    togglePremium();
                    setShowPremiumModal(false);
                }}
            />

            {/* Photo URL Input Modal */}
            <Modal visible={showPhotoInput} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Photo</Text>
                        <Text style={styles.modalSubtitle}>Enter a URL for your photo</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={photoUrl}
                            onChangeText={setPhotoUrl}
                            placeholder="https://example.com/photo.jpg"
                            placeholderTextColor={Colors.textMuted}
                            autoCapitalize="none"
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => { setShowPhotoInput(false); setPhotoUrl(''); }}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalAddBtn, !photoUrl.trim() && styles.modalAddBtnDisabled]}
                                onPress={handleAddPhoto}
                            >
                                <Text style={styles.modalAddText}>Add Photo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: Spacing.xxl,
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: -4,
        backgroundColor: Colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: Colors.background,
    },
    editAvatarIcon: {
        fontSize: 14,
        fontFamily: FontFamily.small,
    
    },
    profileName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    profileLocation: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        marginTop: Spacing.xs,
    },
    premiumTag: {
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
        marginTop: Spacing.sm,
    },
    premiumTagText: {
        color: Colors.premiumGold,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    premiumCta: {
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    premiumCtaGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    premiumCtaIcon: {
        fontSize: 32,
        fontFamily: FontFamily.heading,
    
    },
    premiumCtaText: {
        flex: 1,
    },
    premiumCtaTitle: {
        color: Colors.black,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
    },
    premiumCtaSubtitle: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
    premiumCtaArrow: {
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        color: 'rgba(0,0,0,0.4)',
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    sectionTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
    },
    editBtn: {
        color: Colors.primary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    bioText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        lineHeight: 24,
    },
    bioInput: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        lineHeight: 24,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    charCount: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        textAlign: 'right',
        marginTop: Spacing.xs,
    },
    saveBtn: {
        marginTop: Spacing.sm,
        alignSelf: 'flex-end',
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    photoItem: {
        width: '31%',
        aspectRatio: 0.75,
        borderRadius: BorderRadius.md,
        overflow: 'hidden',
    },
    photoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    mainPhotoBadge: {
        position: 'absolute',
        bottom: Spacing.xs,
        left: Spacing.xs,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.xs,
    },
    mainPhotoText: {
        color: Colors.white,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.bold,
    },
    removePhotoBadge: {
        position: 'absolute',
        top: Spacing.xs,
        right: Spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.6)',
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    removePhotoText: {
        color: Colors.white,
        fontSize: 12,
        fontFamily: FontFamily.small,
    
        fontWeight: FontWeights.bold,
    },
    setMainHint: {
        position: 'absolute',
        bottom: Spacing.xs,
        left: Spacing.xs,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: Spacing.xs + 2,
        paddingVertical: 2,
        borderRadius: BorderRadius.xs,
    },
    setMainText: {
        color: Colors.white,
        fontSize: 9,
        fontFamily: FontFamily.small,
    
        fontWeight: FontWeights.medium,
    },
    photoSlot: {
        width: '31%',
        aspectRatio: 0.75,
        borderRadius: BorderRadius.md,
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
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        gap: Spacing.md,
    },
    settingIcon: {
        fontSize: 22,
        fontFamily: FontFamily.body,
    },
    settingText: {
        flex: 1,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
    },
    settingArrow: {
        color: Colors.textMuted,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
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
    logoutContainer: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.md,
    },
    version: {
        textAlign: 'center',
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        marginTop: Spacing.lg,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.xs,
    },
    modalSubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        marginBottom: Spacing.md,
    },
    modalInput: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.md,
    },
    modalActions: {
        flexDirection: 'row',
        gap: Spacing.md,
        justifyContent: 'flex-end',
    },
    modalCancelBtn: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    modalCancelText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
    },
    modalAddBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.md,
    },
    modalAddBtnDisabled: {
        opacity: 0.5,
    },
    modalAddText: {
        color: Colors.white,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
});
