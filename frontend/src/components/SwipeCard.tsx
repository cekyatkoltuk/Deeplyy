import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../utils/theme';
import { UserProfile } from '../utils/mockData';
import { InterestTag } from './InterestTag';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

interface SwipeCardProps {
    user: UserProfile;
    isFirst?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ user, isFirst = false }) => {
    return (
        <View style={[styles.card, isFirst && styles.firstCard]}>
            <Image source={{ uri: user.photos[0] }} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
                locations={[0.3, 0.6, 1]}
                style={styles.gradient}
            >
                <View style={styles.info}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.age}>{user.age}</Text>
                        {user.isPremium && <Text style={styles.premiumBadge}>💎</Text>}
                    </View>
                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.location}>
                            {user.location} · {user.distance} km away
                        </Text>
                        {user.isOnline && <View style={styles.onlineDot} />}
                    </View>
                    <Text style={styles.bio} numberOfLines={2}>
                        {user.bio}
                    </Text>
                    <View style={styles.interests}>
                        {user.interests.slice(0, 3).map((interest, idx) => (
                            <InterestTag key={idx} label={interest} size="small" />
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export { CARD_WIDTH, CARD_HEIGHT };

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        backgroundColor: Colors.card,
        ...Shadows.large,
    },
    firstCard: {
        // Additional styles for the top card
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    info: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    name: {
        color: Colors.white,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    age: {
        color: Colors.white,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.light,
    },
    premiumBadge: {
        fontSize: 20,
        fontFamily: FontFamily.body,
        marginLeft: Spacing.xs,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    locationIcon: {
        fontSize: 14,
        fontFamily: FontFamily.small,
    },
    location: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.online,
        marginLeft: Spacing.xs,
    },
    bio: {
        color: Colors.textSecondary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
        marginBottom: Spacing.md,
        lineHeight: 20,
    },
    interests: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.xs,
    },
});
