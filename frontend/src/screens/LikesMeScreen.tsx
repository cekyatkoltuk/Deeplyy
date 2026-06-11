import React, { useEffect, useState, useCallback } from 'react';
import { FontFamily } from '../utils/theme';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ImageBackground,
    Modal,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows } from '../utils/theme';
import { InterestTag } from '../components/InterestTag';
import { AppHeader } from '../components/AppHeader';
import api from '../services/api';
import { useNotificationStore } from '../store/notificationStore';
import { getFlagForLocation } from '../utils/countries';
import { socketService } from '../services/socket';

const { width: windowWidth, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SCREEN_WIDTH = Math.min(windowWidth, 500);

interface LikeUser {
    id: string;
    name: string;
    age: number;
    photos: string[];
    interests: string[];
    location: string;
    gender: string;
    bio: string;
    mbti?: string;
    enneagram?: string;
    lookingFor?: string;
    isOnline: boolean;
    isPremium: boolean;
    distance: number;
}

const GENDER_ICONS: Record<string, any> = {
    male: require('../../assets/icons/male_icon.png'),
    female: require('../../assets/icons/female_icon.png'),
    other: require('../../assets/icons/other_genders_icon.png'),
};

const getGenderAsset = (gender: string) => {
    return GENDER_ICONS[gender] || GENDER_ICONS.other;
};

export const LikesMeScreen = () => {
    const [likes, setLikes] = useState<LikeUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<LikeUser | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLikes();

        // Auto-refresh when a new like arrives via socket
        const handleNewLike = () => {
            loadLikes();
        };
        socketService.on('new_like', handleNewLike);

        const handleStatusChange = (data: { userId: string; isOnline: boolean }) => {
            setLikes((prev) =>
                prev.map((u) => (u.id === data.userId ? { ...u, isOnline: data.isOnline } : u))
            );
            setSelectedUser((prev) => {
                if (prev && prev.id === data.userId) {
                    return { ...prev, isOnline: data.isOnline };
                }
                return prev;
            });
        };
        socketService.on('user_status_change', handleStatusChange);

        return () => {
            socketService.off('new_like', handleNewLike);
            socketService.off('user_status_change', handleStatusChange);
        };
    }, []);

    const loadLikes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/matches/likes');
            setLikes(res.data);
            useNotificationStore.getState().setUnreadLikes(res.data.length);
        } catch (error) {
            console.error('Failed to load likes:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await api.get('/matches/likes');
            setLikes(res.data);
            useNotificationStore.getState().setUnreadLikes(res.data.length);
        } catch (error) {
            console.error('Failed to refresh likes:', error);
        } finally {
            setRefreshing(false);
        }
    }, []);

    const openProfile = (user: LikeUser) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const closeProfile = () => {
        setModalVisible(false);
        setSelectedUser(null);
        setModalPhotoIndex(0);
    };

    const handleLikeBack = async (userId: string) => {
        try {
            await api.post('/swipes/like', { userId });
            // Remove from likes list (they become a match now) and update notification count
            setLikes(prev => {
                const newLikes = prev.filter(u => u.id !== userId);
                useNotificationStore.getState().setUnreadLikes(newLikes.length);
                return newLikes;
            });
            closeProfile();
        } catch (error) {
            console.error('Failed to like back:', error);
        }
    };

    const handlePass = async (userId: string) => {
        try {
            await api.post('/swipes/pass', { userId });
            // Remove from likes list and update notification count
            setLikes(prev => {
                const newLikes = prev.filter(u => u.id !== userId);
                useNotificationStore.getState().setUnreadLikes(newLikes.length);
                return newLikes;
            });
            closeProfile();
        } catch (error) {
            console.error('Failed to pass:', error);
        }
    };

    const renderUserCard = ({ item }: { item: LikeUser }) => {
        const photoUri = item.photos?.[0] || `https://ui-avatars.com/api/?name=${item.name}&size=200`;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => openProfile(item)}
                activeOpacity={0.85}
            >
                {/* Photo background */}
                <Image source={{ uri: photoUri }} style={styles.cardPhoto} />

                {/* Dark gradient overlay */}
                <View style={styles.cardOverlay} />

                {/* Bottom info row: gender icon + name + age + online status */}
                <View style={styles.cardInfoRow}>
                    <Image source={getGenderAsset(item.gender)} style={styles.cardGenderIcon} />
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardAge}>{item.age}</Text>
                    <View style={{ flex: 1 }} />
                    <View style={[styles.onlineDotNew, { backgroundColor: item.isOnline ? Colors.online : '#EB3223' }]} />
                </View>
            </TouchableOpacity>
        );
    };

    const renderProfileModal = () => {
        if (!selectedUser) return null;

        return (
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={closeProfile}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Close button */}
                        <TouchableOpacity style={styles.modalCloseBtn} onPress={closeProfile}>
                            <Text style={styles.modalCloseText}>✕</Text>
                        </TouchableOpacity>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.modalScroll}
                        >
                            {/* Main Photo */}
                            <View style={styles.modalPhotoContainer}>
                                <Image
                                    source={{
                                        uri: selectedUser.photos?.[modalPhotoIndex] ||
                                            `https://ui-avatars.com/api/?name=${selectedUser.name}&size=400`
                                    }}
                                    style={styles.modalPhoto}
                                />
                                {selectedUser.photos && selectedUser.photos.length > 1 && modalPhotoIndex > 0 && (
                                    <TouchableOpacity
                                        style={styles.photoNavLeft}
                                        onPress={() => setModalPhotoIndex(prev => prev - 1)}
                                    >
                                        <Text style={styles.photoNavText}>‹</Text>
                                    </TouchableOpacity>
                                )}
                                {selectedUser.photos && selectedUser.photos.length > 1 && modalPhotoIndex < selectedUser.photos.length - 1 && (
                                    <TouchableOpacity
                                        style={styles.photoNavRight}
                                        onPress={() => setModalPhotoIndex(prev => prev + 1)}
                                    >
                                        <Text style={styles.photoNavText}>›</Text>
                                    </TouchableOpacity>
                                )}
                                {selectedUser.isOnline ? (
                                    <View style={styles.modalOnlineBadge}>
                                        <Text style={styles.modalOnlineText}>● Online</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.modalOnlineBadge, styles.modalOfflineBadge]}>
                                        <Text style={[styles.modalOnlineText, styles.modalOfflineText]}>● Offline</Text>
                                    </View>
                                )}
                            </View>

                            {/* Name, Age, Gender */}
                            <View style={styles.modalInfoSection}>
                                <View style={styles.modalNameRow}>
                                    <Text style={styles.modalName}>
                                        {selectedUser.name}, {selectedUser.age}
                                    </Text>
                                    <View style={[
                                        styles.modalGenderBadge,
                                        { backgroundColor: 'rgba(255,255,255,0.1)' }
                                    ]}>
                                        <Image
                                            source={getGenderAsset(selectedUser.gender)}
                                            style={styles.modalGenderIconImg}
                                        />
                                    </View>
                                </View>
                                {selectedUser.location ? (
                                    <Text style={styles.modalLocation}>{getFlagForLocation(selectedUser.location)} {selectedUser.location}</Text>
                                ) : null}
                            </View>

                            {/* Bio */}
                            {selectedUser.bio ? (
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>About</Text>
                                    <Text style={styles.modalBioText}>{selectedUser.bio}</Text>
                                </View>
                            ) : null}

                            {/* Interests */}
                            {selectedUser.interests && selectedUser.interests.length > 0 && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Interests</Text>
                                    <View style={styles.modalInterests}>
                                        {selectedUser.interests.map((interest, idx) => (
                                            <InterestTag key={idx} label={interest} size="small" />
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Basics: MBTI, Enneagram, Looking For */}
                            {(selectedUser.mbti || selectedUser.enneagram || selectedUser.lookingFor) && (
                                <View style={styles.modalSection}>
                                    <Text style={styles.modalSectionTitle}>Basics</Text>
                                    <View style={styles.modalInterests}>
                                        {selectedUser.mbti && (
                                            <InterestTag label={`MBTI: ${selectedUser.mbti}`} size="small" />
                                        )}
                                        {selectedUser.enneagram && (
                                            <InterestTag label={`Enneagram: ${selectedUser.enneagram}`} size="small" />
                                        )}
                                        {selectedUser.lookingFor && (
                                            <InterestTag label={`Looking For: ${selectedUser.lookingFor}`} size="small" />
                                        )}
                                    </View>
                                </View>
                            )}

                        </ScrollView>

                        {/* Action buttons */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalActionBtn, styles.passBtn]}
                                onPress={() => handlePass(selectedUser.id)}
                            >
                                <Text style={styles.passBtnText}>✕</Text>
                                <Text style={styles.actionLabel}>Pass</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalActionBtn, styles.likeBtn]}
                                onPress={() => handleLikeBack(selectedUser.id)}
                            >
                                <Text style={styles.likeBtnText}>♥</Text>
                                <Text style={styles.actionLabel}>Like Back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <ImageBackground
            source={require('../../assets/backgrounds/background_2.png')}
            style={styles.container}
        >
            <AppHeader titleImage={require('../../assets/titles/title_likes.png')} />
            <View style={styles.header}>
                <Text style={styles.title}>Likes You</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{likes.length}</Text>
                </View>
            </View>

            <Text style={styles.subtitle}>
                These people already liked your profile
            </Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={likes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderUserCard}
                    numColumns={3}
                    columnWrapperStyle={likes.length > 1 ? styles.row : undefined}
                    contentContainerStyle={[styles.list, likes.length === 0 && { flexGrow: 1, justifyContent: 'center' }]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>No likes yet</Text>
                            <Text style={styles.emptySubtitle}>Keep swiping to get noticed!</Text>
                        </View>
                    )}
                />
            )}

            {renderProfileModal()}
        </ImageBackground>
    );
};

const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md * 2) / 3;

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
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xxl,
    },
    row: {
        gap: Spacing.md,
        marginBottom: Spacing.md,
    },

    // ─── Photo Card ───────────────────────────────────────
    card: {
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.35,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        ...Shadows.small,
    },
    cardPhoto: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.35)',
    },
    onlineDotNew: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: Spacing.xs,
    },
    cardInfoRow: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        gap: 4,
    },
    cardGenderIcon: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        tintColor: Colors.white,
        opacity: 0.85,
    },
    cardName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
        flexShrink: 1,
    },
    cardAge: {
        color: Colors.textSecondary,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        opacity: 0.8,
    },

    // ─── Profile Modal ───────────────────────────────────
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        maxHeight: SCREEN_HEIGHT * 0.9,
        overflow: 'hidden',
    },
    modalCloseBtn: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        zIndex: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCloseText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: FontWeights.bold,
    },
    modalScroll: {
        paddingBottom: 100,
    },
    modalPhotoContainer: {
        position: 'relative',
    },
    modalPhoto: {
        width: '100%',
        height: 350,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
    },
    photoNavLeft: {
        position: 'absolute',
        top: '50%',
        left: Spacing.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
    photoNavRight: {
        position: 'absolute',
        top: '50%',
        right: Spacing.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -20,
    },
    photoNavText: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: -6,
        marginLeft: 2,
    },
    modalOnlineBadge: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.md,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    modalOnlineText: {
        color: Colors.online,
        fontSize: FontSizes.sm,
        fontFamily: FontFamily.small,
        fontWeight: FontWeights.semiBold,
    },
    modalOfflineBadge: {},
    modalOfflineText: {
        color: '#EB3223',
    },
    modalInfoSection: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    modalNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    modalName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
    },
    modalGenderBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalGenderIconImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: Colors.white,
    },
    modalLocation: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        marginTop: Spacing.xs,
        opacity: 0.8,
    },
    modalSection: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
    },
    modalSectionTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.bold,
        marginBottom: Spacing.md,
    },
    modalBioText: {
        color: Colors.textSecondary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        lineHeight: 24,
    },
    modalInterests: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    modalPhotoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    modalGridPhoto: {
        width: '48%',
        height: 200,
        borderRadius: BorderRadius.md,
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },

    // ─── Modal Actions ───────────────────────────────────
    modalActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        paddingBottom: Spacing.xl,
        gap: Spacing.md,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    modalActionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.xl,
        gap: Spacing.sm,
    },
    passBtn: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    likeBtn: {
        backgroundColor: Colors.primary,
    },
    passBtnText: {
        color: Colors.textSecondary,
        fontSize: 20,
    },
    likeBtnText: {
        color: Colors.white,
        fontSize: 20,
    },
    actionLabel: {
        color: Colors.white,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },

    // ─── Empty State ─────────────────────────────────────
    emptyState: {
        alignItems: 'center',
        gap: Spacing.md,
        marginTop: -110,
    },
    emptyIcon: {
        fontSize: 64,
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
