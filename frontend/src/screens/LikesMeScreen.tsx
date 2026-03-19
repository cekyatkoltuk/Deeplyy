import React, { useEffect, useState } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { InterestTag } from '../components/InterestTag';
import { AppHeader } from '../components/AppHeader';
import api from '../services/api';

interface LikeUser {
    id: string;
    name: string;
    age: number;
    photos: string[];
    interests: string[];
    location: string;
    isOnline: boolean;
    distance: number;
}

export const LikesMeScreen = () => {
    const [likes, setLikes] = useState<LikeUser[]>([]);

    useEffect(() => {
        loadLikes();
    }, []);

    const loadLikes = async () => {
        try {
            const res = await api.get('/matches/likes');
            setLikes(res.data);
        } catch (error) {
            console.error('Failed to load likes:', error);
        }
    };

    const renderUserCard = ({ item }: { item: LikeUser }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.photos[0] }} style={styles.photo} />
            {item.isOnline && <View style={styles.onlineDot} />}
            <View style={styles.info}>
                <Text style={styles.name}>
                    {item.name}, {item.age}
                </Text>
                <View style={styles.locationRow}>
                    <Text style={styles.location}>📍 {item.location}</Text>
                    <Text style={styles.distance}>{item.distance} km</Text>
                </View>
                <View style={styles.interests}>
                    {item.interests.slice(0, 2).map((interest, idx) => (
                        <InterestTag key={idx} label={interest} size="small" />
                    ))}
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.actionBtn, styles.passAction]}>
                    <Text style={styles.actionText}>✕</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.likeAction]}>
                    <Text style={styles.actionText}>♥</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <AppHeader />
            <View style={styles.header}>
                <Text style={styles.title}>Likes You</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{likes.length}</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>
                These people already liked your profile 💕
            </Text>

            <FlatList
                data={likes}
                keyExtractor={(item) => item.id}
                renderItem={renderUserCard}
                numColumns={2}
                columnWrapperStyle={likes.length > 1 ? styles.row : undefined}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💕</Text>
                        <Text style={styles.emptyTitle}>No likes yet</Text>
                        <Text style={styles.emptySubtitle}>Keep swiping to get noticed!</Text>
                    </View>
                )}
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
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
        gap: Spacing.sm,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    badge: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.sm + 2,
        paddingVertical: Spacing.xs,
    },
    badgeText: {
        color: Colors.white,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.bold,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.xs,
        marginBottom: Spacing.md,
    },
    list: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xxl,
    },
    row: {
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },
    card: {
        flex: 1,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.card,
        overflow: 'hidden',
        ...Shadows.small,
    },
    photo: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    onlineDot: {
        position: 'absolute',
        top: Spacing.sm,
        right: Spacing.sm,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.online,
        borderWidth: 2,
        borderColor: Colors.card,
    },
    info: {
        padding: Spacing.sm,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    location: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
    },
    distance: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
    },
    interests: {
        flexDirection: 'row',
        gap: Spacing.xs,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    actionBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    passAction: {
        borderRightWidth: 1,
        borderRightColor: Colors.border,
    },
    likeAction: {},
    actionText: {
        fontSize: 20,
        fontFamily: FontFamily.body,
    },
    emptyState: {
        alignItems: 'center',
        gap: Spacing.md,
        marginTop: 150,
    },
    emptyIcon: {
        fontSize: 64,
        fontFamily: FontFamily.heading,
    },
    emptyTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    emptySubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
    },
});
