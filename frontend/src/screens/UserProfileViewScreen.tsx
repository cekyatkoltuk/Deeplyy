import React, { useEffect, useState } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { Avatar } from '../components/Avatar';
import { InterestTag } from '../components/InterestTag';
import api from '../services/api';
import { getFlagForLocation } from '../utils/countries';

const GENDER_ICONS: Record<string, any> = {
    male: require('../../assets/icons/male_icon.png'),
    female: require('../../assets/icons/female_icon.png'),
    other: require('../../assets/icons/other_genders_icon.png'),
};

const getGenderAsset = (gender: string) => {
    return GENDER_ICONS[gender] || GENDER_ICONS.other;
};

export const UserProfileViewScreen = ({ route, navigation }: any) => {
    const { user: initialUser } = route.params;
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        // Fetch full profile from API
        if (initialUser?.id) {
            api.get(`/users/profile/${initialUser.id}`)
                .then((res) => {
                    setUser(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [initialUser?.id]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Main Photo */}
                    <View style={styles.photoContainer}>
                        <Image
                            source={{ uri: user.photos?.[currentPhotoIndex] || `https://ui-avatars.com/api/?name=${user.name}&size=400` }}
                            style={styles.mainPhoto}
                        />
                        {user.photos && user.photos.length > 1 && currentPhotoIndex > 0 && (
                            <TouchableOpacity
                                style={styles.photoNavLeft}
                                onPress={() => setCurrentPhotoIndex((prev: number) => prev - 1)}
                            >
                                <Text style={styles.photoNavText}>‹</Text>
                            </TouchableOpacity>
                        )}
                        {user.photos && user.photos.length > 1 && currentPhotoIndex < user.photos.length - 1 && (
                            <TouchableOpacity
                                style={styles.photoNavRight}
                                onPress={() => setCurrentPhotoIndex((prev: number) => prev + 1)}
                            >
                                <Text style={styles.photoNavText}>›</Text>
                            </TouchableOpacity>
                        )}
                        {user.isOnline ? (
                            <View style={styles.onlineBadge}>
                                <Text style={styles.onlineText}>● Online</Text>
                            </View>
                        ) : (
                            <View style={[styles.onlineBadge, styles.offlineBadge]}>
                                <Text style={[styles.onlineText, styles.offlineText]}>● Offline</Text>
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View style={styles.infoSection}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>
                                {user.name}{user.age ? `, ${user.age}` : ''}
                            </Text>
                            {user.gender ? (
                                <View style={[styles.genderBadge, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                    <Image source={getGenderAsset(user.gender)} style={styles.genderIconImg} />
                                </View>
                            ) : null}
                        </View>
                        {user.location ? (
                            <Text style={styles.location}>{getFlagForLocation(user.location)} {user.location}</Text>
                        ) : null}
                    </View>

                    {/* Basics */}
                    {(user.mbti || user.enneagram || user.lookingFor) && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Basics</Text>
                            <View style={styles.interestsGrid}>
                                {user.mbti && (
                                    <InterestTag label={`MBTI: ${user.mbti}`} size="small" />
                                )}
                                {user.enneagram && (
                                    <InterestTag label={`Enneagram: ${user.enneagram}`} size="small" />
                                )}
                                {user.lookingFor && (
                                    <InterestTag label={`Looking For: ${user.lookingFor}`} size="small" />
                                )}
                            </View>
                        </View>
                    )}

                    {/* Bio */}
                    {user.bio ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.bioText}>{user.bio}</Text>
                        </View>
                    ) : null}

                    {/* Interests */}
                    {user.interests && user.interests.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Interests</Text>
                            <View style={styles.interestsGrid}>
                                {user.interests.map((interest: string, idx: number) => (
                                    <InterestTag key={idx} label={interest} size="small" />
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        paddingVertical: Spacing.xs,
    },
    backText: {
        color: Colors.primary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: Spacing.xxl,
    },
    photoContainer: {
        position: 'relative',
    },
    mainPhoto: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.md,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    onlineText: {
        color: Colors.online,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    photoNavLeft: {
        position: 'absolute',
        top: '50%',
        left: Spacing.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
    photoNavRight: {
        position: 'absolute',
        top: '50%',
        right: Spacing.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
    photoNavText: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: -6,
        marginLeft: 2,
    },
    offlineBadge: {},
    offlineText: {
        color: '#EB3223',
    },
    infoSection: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    genderBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderIconImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: Colors.white,
    },
    location: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        marginTop: Spacing.xs,
        opacity: 0.8,
    },
    section: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    sectionTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.md,
    },
    bioText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        lineHeight: 24,
    },
    interestsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
});
