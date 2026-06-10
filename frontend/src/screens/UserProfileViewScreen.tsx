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

export const UserProfileViewScreen = ({ route, navigation }: any) => {
    const { user: initialUser } = route.params;
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(true);

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
                            source={{ uri: user.photos?.[0] || `https://ui-avatars.com/api/?name=${user.name}&size=400` }}
                            style={styles.mainPhoto}
                        />
                        {user.isOnline && (
                            <View style={styles.onlineBadge}>
                                <Text style={styles.onlineText}>● Online</Text>
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View style={styles.infoSection}>
                        <Text style={styles.name}>
                            {user.name}{user.age ? `, ${user.age}` : ''}

                        </Text>
                        {user.location ? (
                            <Text style={styles.location}>{user.location}</Text>
                        ) : null}
                    </View>

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

                    {/* All Photos */}
                    {user.photos && user.photos.length > 1 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Photos</Text>
                            <View style={styles.photoGrid}>
                                {user.photos.slice(1).map((photo: string, idx: number) => (
                                    <Image key={idx} source={{ uri: photo }} style={styles.gridPhoto} />
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
        paddingTop: Spacing.xxl + Spacing.sm,
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
    infoSection: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    location: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        marginTop: Spacing.xs,
    },
    section: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    gridPhoto: {
        width: '48%',
        height: 200,
        borderRadius: BorderRadius.md,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
});
