import React, { useEffect, useCallback } from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../utils/theme';
import { ConversationItem } from '../components/ConversationItem';
import { AppHeader } from '../components/AppHeader';
import { useChatStore } from '../store/chatStore';
import { socketService } from '../services/socket';

export const ChatListScreen = ({ navigation }: any) => {
    const { conversations, loadConversations, isLoading } = useChatStore();

    useEffect(() => {
        loadConversations();
    }, []);

    // Also reload whenever the screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadConversations();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ImageBackground source={require('../../assets/backgrounds/background_1.png')} style={styles.container}>
            <AppHeader titleImage={require('../../assets/titles/title_chat.png')} />
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <Text style={styles.count}>
                    {conversations.filter((c) => c.unreadCount > 0).length} unread
                </Text>
            </View>

            {isLoading && conversations.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
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

                            <Text style={styles.emptyTitle}>No messages yet</Text>
                            <Text style={styles.emptySubtitle}>
                                Match with someone to start chatting!
                            </Text>
                        </View>
                    )}
                />
            )}
        </ImageBackground>
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
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    count: {
        color: Colors.primary,
        fontSize: FontSizes.md,
        fontFamily: FontFamily.small,
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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
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
