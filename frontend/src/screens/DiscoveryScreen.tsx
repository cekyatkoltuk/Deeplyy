import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    PanResponder,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FontFamily,
  Colors, FontSizes, FontWeights, Spacing, BorderRadius, Shadows
} from '../utils/theme';
import { SwipeCard, CARD_WIDTH, CARD_HEIGHT } from '../components/SwipeCard';
import { PremiumModal } from '../components/PremiumModal';
import { Button } from '../components/Button';
import { AppHeader } from '../components/AppHeader';
import { useSwipeStore } from '../store/swipeStore';
import { useMatchStore } from '../store/matchStore';
import { usePremiumStore } from '../store/premiumStore';
import { SWIPE_THRESHOLD } from '../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DiscoveryScreen = ({ navigation }: any) => {
    const { cards, currentIndex, loadCards, swipeRight, swipeLeft, rewind, resetDislikes } =
        useSwipeStore();
    const { addMatch } = useMatchStore();
    const { isPremium, togglePremium } = usePremiumStore();
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedUser, setMatchedUser] = useState<any>(null);

    const position = new Animated.ValueXY();
    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-12deg', '0deg', '12deg'],
        extrapolate: 'clamp',
    });

    const likeOpacity = position.x.interpolate({
        inputRange: [0, SCREEN_WIDTH / 4],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const nopeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 4, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const nextCardScale = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.92, 1],
        extrapolate: 'clamp',
    });

    const nextCardOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.6, 1],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        loadCards();
    }, []);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                swipeOut('right');
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                swipeOut('left');
            } else {
                resetPosition();
            }
        },
    });

    const swipeOut = (direction: 'left' | 'right') => {
        const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: 300,
            useNativeDriver: false,
        }).start(async () => {
            if (direction === 'right') {
                const card = cards[currentIndex];
                const isMatch = await swipeRight(card.id);
                if (isMatch) {
                    setMatchedUser(card);
                    addMatch(card);
                    setShowMatchModal(true);
                }
            } else {
                await swipeLeft(cards[currentIndex].id);
            }
            position.setValue({ x: 0, y: 0 });
        });
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
        }).start();
    };

    const handleLike = () => swipeOut('right');
    const handlePass = () => swipeOut('left');

    const handleRewind = () => {
        if (!isPremium) {
            setShowPremiumModal(true);
            return;
        }
        rewind();
    };

    const handleReset = () => {
        if (!isPremium) {
            setShowPremiumModal(true);
            return;
        }
        resetDislikes();
    };

    const currentCard = cards[currentIndex];
    const nextCard = cards[currentIndex + 1];

    return (
        <View style={styles.container}>
            <AppHeader />

            {/* Card Stack */}
            <View style={styles.cardStack}>
                {!currentCard ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                        <Text style={styles.emptyTitle}>No more profiles</Text>
                        <Text style={styles.emptySubtitle}>
                            Check back later or adjust your filters
                        </Text>
                        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                            <Text style={styles.resetText}>
                                🔄 Reset {!isPremium && '🔒'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Next card (behind) */}
                        {nextCard && (
                            <Animated.View
                                style={[
                                    styles.cardContainer,
                                    styles.nextCard,
                                    {
                                        transform: [{ scale: nextCardScale }],
                                        opacity: nextCardOpacity,
                                    },
                                ]}
                            >
                                <SwipeCard user={nextCard} />
                            </Animated.View>
                        )}

                        {/* Current card (top) */}
                        <Animated.View
                            {...panResponder.panHandlers}
                            style={[
                                styles.cardContainer,
                                {
                                    transform: [
                                        { translateX: position.x },
                                        { translateY: position.y },
                                        { rotate },
                                    ],
                                },
                            ]}
                        >
                            {/* LIKE overlay */}
                            <Animated.View
                                style={[styles.stampContainer, styles.likeStamp, { opacity: likeOpacity }]}
                            >
                                <Text style={styles.stampText}>LIKE</Text>
                            </Animated.View>

                            {/* NOPE overlay */}
                            <Animated.View
                                style={[styles.stampContainer, styles.nopeStamp, { opacity: nopeOpacity }]}
                            >
                                <Text style={[styles.stampText, styles.nopeText]}>NOPE</Text>
                            </Animated.View>

                            <SwipeCard user={currentCard} isFirst />
                        </Animated.View>
                    </>
                )}
            </View>

            {/* Action Buttons */}
            {currentCard && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, styles.passBtn]}
                        onPress={handlePass}
                    >
                        <Text style={styles.actionIcon}>✕</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.rewindBtn]}
                        onPress={handleRewind}
                    >
                        <Text style={styles.actionIcon}>↩️</Text>
                        {!isPremium && <Text style={styles.actionLock}>🔒</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.likeBtn]}
                        onPress={handleLike}
                    >
                        <Text style={styles.actionIcon}>♥</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.resetActionBtn]}
                        onPress={handleReset}
                    >
                        <Text style={styles.actionIcon}>🔄</Text>
                        {!isPremium && <Text style={styles.actionLock}>🔒</Text>}
                    </TouchableOpacity>
                </View>
            )}

            {/* Match Modal */}
            <Modal visible={showMatchModal} transparent animationType="fade">
                <View style={styles.matchModalBackdrop}>
                    <LinearGradient
                        colors={['rgba(255,107,107,0.9)', 'rgba(168,85,247,0.9)']}
                        style={styles.matchModalContent}
                    >
                        <Text style={styles.matchEmoji}>🎉</Text>
                        <Text style={styles.matchTitle}>It's a Match!</Text>
                        <Text style={styles.matchSubtitle}>
                            You and {matchedUser?.name} liked each other
                        </Text>
                        <Button
                            title="Send a Message"
                            onPress={() => {
                                setShowMatchModal(false);
                                navigation.navigate('ChatTab');
                            }}
                            variant="secondary"
                            size="large"
                        />
                        <TouchableOpacity onPress={() => setShowMatchModal(false)}>
                            <Text style={styles.keepSwiping}>Keep Swiping</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Modal>

            {/* Premium Modal */}
            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onSubscribe={() => {
                    togglePremium();
                    setShowPremiumModal(false);
                }}
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
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.sm,
    },
    logo: {
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.primary,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    filterIcon: {
        fontSize: 24,
        fontFamily: FontFamily.heading,
    
    },
    lockBadge: {
        fontSize: 12,
        fontFamily: FontFamily.small,
    
        marginLeft: -4,
        marginTop: -8,
    },
    cardStack: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        position: 'absolute',
    },
    nextCard: {
        top: 8,
    },
    stampContainer: {
        position: 'absolute',
        top: 40,
        zIndex: 10,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
        borderWidth: 3,
    },
    likeStamp: {
        left: 20,
        borderColor: Colors.like,
        transform: [{ rotate: '-15deg' }],
    },
    nopeStamp: {
        right: 20,
        borderColor: Colors.pass,
        transform: [{ rotate: '15deg' }],
    },
    stampText: {
        fontSize: FontSizes.xxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.extraBold,
        color: Colors.like,
        letterSpacing: 3,
    },
    nopeText: {
        color: Colors.pass,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.md,
    },
    actionBtn: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.small,
    },
    passBtn: {
        backgroundColor: Colors.surface,
        borderColor: Colors.pass,
    },
    rewindBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
    },
    likeBtn: {
        backgroundColor: Colors.surface,
        borderColor: Colors.like,
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    resetActionBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
    },
    actionIcon: {
        fontSize: 24,
        fontFamily: FontFamily.heading,
    
    },
    actionLock: {
        position: 'absolute',
        top: -4,
        right: -4,
        fontSize: 12,
        fontFamily: FontFamily.small,
    
    },
    emptyState: {
        alignItems: 'center',
        gap: Spacing.md,
    },
    emptyIcon: {
        fontSize: 72,
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
    resetBtn: {
        marginTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.full,
    },
    resetText: {
        color: Colors.textPrimary,
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        fontWeight: FontWeights.semiBold,
    },
    matchModalBackdrop: {
        flex: 1,
        backgroundColor: Colors.overlay,
        alignItems: 'center',
        justifyContent: 'center',
    },
    matchModalContent: {
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xxl,
        alignItems: 'center',
        marginHorizontal: Spacing.lg,
        gap: Spacing.md,
    },
    matchEmoji: {
        fontSize: 64,
        fontFamily: FontFamily.heading,
    
    },
    matchTitle: {
        fontSize: FontSizes.xxxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.extraBold,
        color: Colors.white,
    },
    matchSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: FontSizes.lg,
        fontFamily: FontFamily.body,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },
    keepSwiping: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: FontSizes.body,
        fontFamily: FontFamily.body,
        marginTop: Spacing.sm,
    },
});
