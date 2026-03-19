import React, { useEffect, useState } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../utils/theme';
import api from '../services/api';

interface BlockedUser {
    id: string;
    name: string;
    age: number;
    photos: string[];
}

export const BlockedUsersScreen = ({ navigation }: any) => {
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBlockedUsers();
    }, []);

    const loadBlockedUsers = async () => {
        try {
            const res = await api.get('/users/blocked');
            setBlockedUsers(res.data);
        } catch (error) {
            console.error('Failed to load blocked users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId: string, name: string) => {
        const doUnblock = typeof window !== 'undefined'
            ? window.confirm(`Unblock ${name}?`)
            : true;
        if (!doUnblock) return;

        try {
            await api.delete(`/users/block/${userId}`);
            setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
            alert(`${name} has been unblocked.`);
        } catch (error) {
            alert('Failed to unblock user.');
        }
    };

    const renderItem = ({ item }: { item: BlockedUser }) => (
        <View style={styles.userRow}>
            <Image
                source={{ uri: item.photos?.[0] || `https://ui-avatars.com/api/?name=${item.name}&size=80` }}
                style={styles.avatar}
            />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userAge}>{item.age} years old</Text>
            </View>
            <TouchableOpacity
                style={styles.unblockBtn}
                onPress={() => handleUnblock(item.id, item.name)}
            >
                <Text style={styles.unblockText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backBtn}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Blocked Users</Text>
                <View style={{ width: 50 }} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={blockedUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={blockedUsers.length === 0 ? styles.emptyContainer : styles.list}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>✅</Text>
                            <Text style={styles.emptyTitle}>No blocked users</Text>
                            <Text style={styles.emptySubtitle}>
                                You haven't blocked anyone yet
                            </Text>
                        </View>
                    )}
                />
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        padding: Spacing.md,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Shadows.small,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.surfaceLight,
    },
    userInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    userName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
    userAge: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        marginTop: 2,
    },
    unblockBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    unblockText: {
        color: Colors.white,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    emptyContainer: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.md,
        paddingTop: Spacing.xxxl,
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
