import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../utils/theme';
import { Avatar } from './Avatar';

interface MatchCardProps {
    user: { name: string; age: number; photos: string[]; isOnline?: boolean; };
    onPress: () => void;
    isNew?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ user, onPress, isNew }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: user.photos[0] }} style={styles.photo} />
            {isNew && (
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>NEW</Text>
                </View>
            )}
            {user.isOnline && <View style={styles.onlineDot} />}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {user.name}, {user.age}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 110,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        backgroundColor: Colors.card,
        ...Shadows.small,
    },
    photo: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    newBadge: {
        position: 'absolute',
        top: Spacing.xs,
        right: Spacing.xs,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    newBadgeText: {
        color: Colors.white,
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
    onlineDot: {
        position: 'absolute',
        top: Spacing.xs,
        left: Spacing.xs,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.online,
        borderWidth: 2,
        borderColor: Colors.card,
    },
    info: {
        padding: Spacing.sm,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semiBold,
    },
});
