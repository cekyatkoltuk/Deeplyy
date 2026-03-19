import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing } from '../utils/theme';
import { Message } from '../utils/mockData';

interface ChatBubbleProps {
    message: Message;
    isMe: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe }) => {
    const time = new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <View style={[styles.container, isMe ? styles.meContainer : styles.otherContainer]}>
            <View style={[styles.bubble, isMe ? styles.meBubble : styles.otherBubble]}>
                <Text style={[styles.text, isMe ? styles.meText : styles.otherText]}>
                    {message.text}
                </Text>
                <View style={styles.meta}>
                    <Text style={[styles.time, isMe ? styles.meTime : styles.otherTime]}>{time}</Text>
                    {isMe && (
                        <Text style={[styles.readReceipt, message.read && styles.readReceiptRead]}>
                            {message.read ? '✓✓' : '✓'}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
    },
    meContainer: {
        alignItems: 'flex-end',
    },
    otherContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        borderRadius: BorderRadius.xl,
    },
    meBubble: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: Spacing.xs,
    },
    otherBubble: {
        backgroundColor: Colors.surfaceLight,
        borderBottomLeftRadius: Spacing.xs,
    },
    text: {
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        lineHeight: 22,
    },
    meText: {
        color: Colors.white,
    },
    otherText: {
        color: Colors.textPrimary,
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    time: {
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
    },
    meTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: Colors.textMuted,
    },
    readReceipt: {
        fontSize: FontSizes.xs,
        fontFamily: FontFamily.small,
        color: 'rgba(255,255,255,0.5)',
    },
    readReceiptRead: {
        color: '#38BDF8',
    },
});
