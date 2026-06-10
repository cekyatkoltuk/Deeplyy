import React, { useEffect, useState, useRef } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { ChatBubble } from '../components/ChatBubble';
import { Avatar } from '../components/Avatar';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export const ChatRoomScreen = ({ route, navigation }: any) => {
    const { conversationId, userName, userPhoto, isOnline, userProfile, isBlockedByMe: initialBlocked } = route.params;
    const { messages, loadMessages, sendMessage } = useChatStore();
    const { userId } = useAuthStore();
    const [text, setText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [blocked, setBlocked] = useState(initialBlocked || false);
    const flatListRef = useRef<FlatList>(null);

    const targetUserId = userProfile?.id || conversationId;
    const conversationMessages = messages[conversationId] || [];

    useEffect(() => {
        loadMessages(conversationId);
    }, [conversationId]);

    const handleSend = () => {
        if (!text.trim() || blocked) return;
        sendMessage(conversationId, text.trim());
        setText('');
    };

    const handleViewProfile = () => {
        setShowMenu(false);
        navigation.navigate('UserProfileView', {
            user: userProfile || {
                id: targetUserId,
                name: userName,
                photos: userPhoto ? [userPhoto] : [],
                isOnline,
            },
        });
    };

    const handleBlock = () => {
        setShowMenu(false);
        const doBlock = typeof window !== 'undefined'
            ? window.confirm(`Block ${userName}? They won't be able to contact you.`)
            : true;
        if (doBlock) {
            api.post(`/users/block/${targetUserId}`)
                .then(() => {
                    setBlocked(true);
                    alert(`${userName} has been blocked.`);
                })
                .catch(() => alert('Failed to block user.'));
        }
    };

    const handleUnblock = () => {
        setShowMenu(false);
        const doUnblock = typeof window !== 'undefined'
            ? window.confirm(`Unblock ${userName}?`)
            : true;
        if (doUnblock) {
            api.delete(`/users/block/${targetUserId}`)
                .then(() => {
                    setBlocked(false);
                    alert(`${userName} has been unblocked.`);
                })
                .catch(() => alert('Failed to unblock user.'));
        }
    };

    const handleReport = () => {
        setShowMenu(false);
        const reason = typeof window !== 'undefined'
            ? window.prompt(`Why are you reporting ${userName}?`, '')
            : 'Inappropriate behavior';
        if (reason !== null && reason !== '') {
            api.post(`/users/report/${targetUserId}`, { reason })
                .then(() => alert('Report submitted. Thank you.'))
                .catch(() => alert('Failed to submit report.'));
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.headerProfile}
                    onPress={handleViewProfile}
                >
                    <Avatar uri={userPhoto} size={40} isOnline={!blocked && isOnline} name={userName} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{userName}</Text>
                        <Text style={[styles.headerStatus, blocked && styles.headerBlocked]}>
                            {blocked ? 'Blocked' : isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)}>
                    <Text style={styles.moreBtn}>⋮</Text>
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={conversationMessages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ChatBubble message={item} isMe={item.senderId === userId} />
                )}
                contentContainerStyle={styles.messageList}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            {/* Blocked banner OR Input bar */}
            {blocked ? (
                <View style={styles.blockedBanner}>

                    <Text style={styles.blockedText}>You blocked this user</Text>
                    <TouchableOpacity style={styles.unblockBannerBtn} onPress={handleUnblock}>
                        <Text style={styles.unblockBannerText}>Unblock</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.inputBar}>
                    <TouchableOpacity style={styles.attachBtn}>
                        <Text style={styles.attachIcon}>+</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={setText}
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.textMuted}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity style={styles.mediaBtn}>
                        <Text style={styles.mediaIcon}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.sendBtn, text.trim() ? styles.sendBtnActive : null]}
                        onPress={handleSend}
                        disabled={!text.trim()}
                    >
                        <Text style={styles.sendIcon}>➤</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* More Menu Modal */}
            <Modal visible={showMenu} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.menuOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMenu(false)}
                >
                    <View style={styles.menuContent}>
                        <TouchableOpacity style={styles.menuItem} onPress={handleViewProfile}>

                            <Text style={styles.menuText}>View Profile</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={() => setShowMenu(false)}>

                            <Text style={styles.menuText}>Mute Notifications</Text>
                        </TouchableOpacity>
                        <View style={styles.menuDivider} />
                        {blocked ? (
                            <TouchableOpacity style={styles.menuItem} onPress={handleUnblock}>

                                <Text style={styles.menuText}>Unblock User</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.menuItem} onPress={handleBlock}>

                                <Text style={[styles.menuText, styles.menuDanger]}>Block User</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.menuDivider} />
                        <TouchableOpacity style={styles.menuItem} onPress={handleReport}>

                            <Text style={[styles.menuText, styles.menuDanger]}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
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
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.xxl + Spacing.sm,
        paddingBottom: Spacing.md,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.sm,
    },
    backBtn: {
        padding: Spacing.xs,
    },
    backText: {
        color: Colors.primary,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    headerProfile: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
    headerStatus: {
        color: Colors.online,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
    },
    headerBlocked: {
        color: Colors.error,
    },
    moreBtn: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        paddingHorizontal: Spacing.sm,
    },
    messageList: {
        paddingVertical: Spacing.md,
    },
    blockedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.sm,
    },
    blockedIcon: {
        fontSize: 18,
        fontFamily: FontFamily.body,
    },
    blockedText: {
        color: Colors.error,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
        flex: 1,
    },
    unblockBannerBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
    },
    unblockBannerText: {
        color: Colors.white,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.surface,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.sm,
    },
    attachBtn: {
        padding: Spacing.sm,
    },
    attachIcon: {
        fontSize: 22,
        fontFamily: FontFamily.body,
    },
    input: {
        flex: 1,
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        maxHeight: 100,
    },
    mediaBtn: {
        padding: Spacing.sm,
    },
    mediaIcon: {
        fontSize: 22,
        fontFamily: FontFamily.body,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnActive: {
        backgroundColor: Colors.primary,
    },
    sendIcon: {
        fontSize: 18,
        fontFamily: FontFamily.body,
        color: Colors.white,
    },
    // Menu modal
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 100,
        paddingRight: Spacing.md,
    },
    menuContent: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        paddingVertical: Spacing.sm,
        minWidth: 200,
        ...Shadows.medium,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    menuIcon: {
        fontSize: 18,
        fontFamily: FontFamily.body,
        width: 24,
        textAlign: 'center',
    },
    menuText: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.medium,
    },
    menuDanger: {
        color: Colors.error,
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginHorizontal: Spacing.md,
    },
});
