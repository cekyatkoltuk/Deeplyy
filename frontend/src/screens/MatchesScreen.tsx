import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius } from '../utils/theme';
import { MatchCard } from '../components/MatchCard';
import { Avatar } from '../components/Avatar';
import { useMatchStore } from '../store/matchStore';

export const MatchesScreen = ({ navigation }: any) => {
    const { matches, loadMatches, isLoading } = useMatchStore();

    useEffect(() => {
        loadMatches();
    }, []);

    const recentMatches = matches.filter((m) => m.isNew);
    const allMatches = matches;

    const navigateToChat = (userId: string) => {
        navigation.navigate('ChatTab', {
            screen: 'ChatRoom',
            params: { conversationId: 'c1', userName: matches.find(m => m.user.id === userId)?.user.name },
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Matches</Text>
                <Text style={styles.count}>{matches.length} people</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Recent Matches */}
                {recentMatches.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>New Matches ✨</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recentRow}
                        >
                            {recentMatches.map((match) => (
                                <TouchableOpacity
                                    key={match.id}
                                    style={styles.recentItem}
                                    onPress={() => navigateToChat(match.user.id)}
                                >
                                    <View style={styles.recentAvatarRing}>
                                        <Avatar
                                            uri={match.user.photos[0]}
                                            size={70}
                                            isOnline={match.user.isOnline}
                                            name={match.user.name}
                                        />
                                    </View>
                                    <Text style={styles.recentName} numberOfLines={1}>
                                        {match.user.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* All Matches Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>All Matches</Text>
                    <View style={styles.grid}>
                        {allMatches.map((match) => (
                            <MatchCard
                                key={match.id}
                                user={match.user}
                                isNew={match.isNew}
                                onPress={() => navigateToChat(match.user.id)}
                            />
                        ))}
                    </View>
                </View>

                {matches.length === 0 && !isLoading && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💝</Text>
                        <Text style={styles.emptyTitle}>No matches yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Keep swiping to find your perfect match!
                        </Text>
                    </View>
                )}
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
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontWeight: FontWeights.bold,
    },
    count: {
        color: Colors.textMuted,
        fontSize: FontSizes.md,
    },
    content: {
        flex: 1,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
        marginBottom: Spacing.md,
    },
    recentRow: {
        gap: Spacing.lg,
        paddingRight: Spacing.lg,
    },
    recentItem: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    recentAvatarRing: {
        padding: 3,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    recentName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.medium,
        width: 70,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Spacing.xxxl,
        gap: Spacing.md,
    },
    emptyIcon: {
        fontSize: 64,
    },
    emptyTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    emptySubtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
    },
});
