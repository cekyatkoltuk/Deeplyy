import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../utils/theme';
import { Avatar } from './Avatar';

interface ConversationData {
    id: string;
    user: { name: string; photos: string[]; isOnline?: boolean; };
    lastMessage: { senderId: string; text: string; timestamp: string; } | null;
    unreadCount: number;
    isTyping?: boolean;
}

interface ConversationItemProps {
    conversation: ConversationData;
    onPress: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
    conversation,
    onPress,
}) => {
    const { user, lastMessage, unreadCount, isTyping } = conversation;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 1) return `${Math.floor(diff / (1000 * 60))}m`;
        if (hours < 24) return `${Math.floor(hours)}h`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Avatar
                uri={user.photos[0]}
                size={56}
                isOnline={user.isOnline}
                name={user.name}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={[styles.time, unreadCount > 0 && styles.unreadTime]}>
                        {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                    </Text>
                </View>
                <View style={styles.messageRow}>
                    {isTyping ? (
                        <Text style={styles.typing}>typing...</Text>
                    ) : (
                        <Text
                            style={[styles.message, unreadCount > 0 && styles.unreadMessage]}
                            numberOfLines={1}
                        >
                            {lastMessage ? (
                                <>
                                    {lastMessage.senderId === 'me' ? 'You: ' : ''}
                                    {lastMessage.text}
                                </>
                            ) : 'Start a conversation!'}
                        </Text>
                    )}
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    name: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontWeight: FontWeights.semiBold,
    },
    time: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
    },
    unreadTime: {
        color: Colors.primary,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    message: {
        flex: 1,
        color: Colors.textMuted,
        fontSize: FontSizes.md,
    },
    unreadMessage: {
        color: Colors.textSecondary,
        fontWeight: FontWeights.medium,
    },
    typing: {
        color: Colors.primary,
        fontSize: FontSizes.md,
        fontStyle: 'italic',
    },
    badge: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        minWidth: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xs,
        marginLeft: Spacing.sm,
    },
    badgeText: {
        color: Colors.white,
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
    },
});
