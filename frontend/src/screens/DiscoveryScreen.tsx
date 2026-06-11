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
    ImageBackground,
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
import { socketService } from '../services/socket';

const { width: windowWidth } = Dimensions.get('window');
const SCREEN_WIDTH = Math.min(windowWidth, 500);

export const DiscoveryScreen = ({ navigation }: any) => {
    const { cards, currentIndex, loadCards, swipeRight, swipeLeft, rewind, resetDislikes, updateUserStatus } =
        useSwipeStore();
    const { addMatch } = useMatchStore();
    const { isPremium, togglePremium } = usePremiumStore();
    const [showPremiumModal, setShowPremiumModal] = useState(false);


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

        const handleStatusChange = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
            updateUserStatus(userId, isOnline);
        };

        socketService.on('user_status_change', handleStatusChange);

        return () => {
            socketService.off('user_status_change', handleStatusChange);
        };
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
                if (Math.abs(gesture.dx) < 10 && Math.abs(gesture.dy) < 10) {
                    const card = cards[currentIndex];
                    if (card) {
                        navigation.navigate('UserProfileView', { user: card });
                    }
                }
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
                    addMatch(card);
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
        <ImageBackground source={require('../../assets/backgrounds/background_1.png')} style={styles.container}>
            <AppHeader titleImage={require('../../assets/titles/title_connect.png')} />

            {/* Card Stack */}
            <View style={styles.cardStack}>
                {!currentCard ? (
                    <View style={styles.emptyState}>

                        <Text style={styles.emptyTitle}>No more profiles</Text>
                        <Text style={styles.emptySubtitle}>
                            Check back later or adjust your filters
                        </Text>
                        <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                            <Text style={styles.resetText}>
                                Reset
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
                        style={[styles.actionBtn, styles.smallBtn, styles.rewindBtn]}
                        onPress={handleRewind}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['rgba(185,104,204,0.15)', 'rgba(185,104,204,0.05)']}
                            style={styles.smallBtnGradient}
                        >
                            <Text style={[styles.actionIcon, styles.smallIcon, styles.rewindIcon]}>↩</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.passBtn]}
                        onPress={handlePass}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['rgba(235,50,35,0.15)', 'rgba(235,50,35,0.05)']}
                            style={styles.actionBtnGradient}
                        >
                            <Text style={[styles.actionIcon, styles.passIcon]}>✕</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.likeBtn]}
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={[Colors.primary, Colors.primaryGradientEnd]}
                            style={styles.likeBtnGradient}
                        >
                            <Text style={[styles.actionIcon, styles.likeIcon]}>♥</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionBtn, styles.smallBtn, styles.resetActionBtn]}
                        onPress={handleReset}
                        activeOpacity={0.7}
                    >
                        <LinearGradient
                            colors={['rgba(185,104,204,0.15)', 'rgba(185,104,204,0.05)']}
                            style={styles.smallBtnGradient}
                        >
                            <Text style={[styles.actionIcon, styles.smallIcon, styles.resetIcon]}>↻</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}


            {/* Premium Modal */}
            <PremiumModal
                visible={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onSubscribe={() => {
                    togglePremium();
                    setShowPremiumModal(false);
                }}
            />
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
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 3,
    },
    likeStamp: {
        left: 20,
        borderColor: Colors.like,
        backgroundColor: 'rgba(185,104,204,0.15)',
        transform: [{ rotate: '-15deg' }],
        shadowColor: Colors.like,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 8,
    },
    nopeStamp: {
        right: 20,
        borderColor: Colors.pass,
        backgroundColor: 'rgba(235,50,35,0.15)',
        transform: [{ rotate: '15deg' }],
        shadowColor: Colors.pass,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
        elevation: 8,
    },
    stampText: {
        fontSize: FontSizes.xxxl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.extraBold,
        color: Colors.like,
        letterSpacing: 4,
        textShadowColor: 'rgba(185,104,204,0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    nopeText: {
        color: Colors.pass,
        textShadowColor: 'rgba(235,50,35,0.5)',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.lg,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.md,
    },
    actionBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    actionBtnGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(235,50,35,0.4)',
    },
    smallBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    smallBtnGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(185,104,204,0.35)',
    },
    passBtn: {
        shadowColor: Colors.pass,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 6,
    },
    rewindBtn: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    likeBtn: {
        width: 72,
        height: 72,
        borderRadius: 36,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
    },
    likeBtnGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetActionBtn: {
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    actionIcon: {
        fontSize: 26,
        fontFamily: FontFamily.heading,
    },
    passIcon: {
        color: Colors.pass,
        fontSize: 24,
    },
    smallIcon: {
        fontSize: 20,
    },
    rewindIcon: {
        color: Colors.accent,
    },
    likeIcon: {
        color: Colors.white,
        fontSize: 30,
    },
    resetIcon: {
        color: Colors.accent,
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
