import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../utils/theme';
import { ConversationItem } from '../components/ConversationItem';
import { useChatStore } from '../store/chatStore';

export const ChatListScreen = ({ navigation }: any) => {
    const { conversations, loadConversations, isLoading } = useChatStore();

    useEffect(() => {
        loadConversations();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.count}>
                    {conversations.filter((c) => c.unreadCount > 0).length} unread
                </Text>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ConversationItem
                        conversation={item}
                        onPress={() =>
                            navigation.navigate('ChatRoom', {
                                conversationId: item.id,
                                userName: item.user.name,
                                userPhoto: item.user.photos?.[0],
                                isOnline: item.user.isOnline,
                                userProfile: item.user,
                                isBlockedByMe: item.isBlockedByMe || false,
                            })
                        }
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={conversations.length === 0 ? styles.empty : undefined}
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>💬</Text>
                        <Text style={styles.emptyTitle}>No messages yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Match with someone to start chatting!
                        </Text>
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
        color: Colors.primary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.medium,
    },
    separator: {
        height: 1,
        backgroundColor: Colors.divider,
        marginLeft: 88,
    },
    empty: {
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
