import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors, FontSizes, FontWeights, BorderRadius, Spacing, Shadows } from '../utils/theme';
import { UserProfile } from '../utils/mockData';
import { getFlagForLocation } from '../utils/countries';

const { width: windowWidth } = Dimensions.get('window');
const SCREEN_WIDTH = Math.min(windowWidth, 500);
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = CARD_WIDTH * 1.35;

const CARD_FONT = 'MontserratAlternates_800ExtraBold';

interface SwipeCardProps {
    user: UserProfile;
    isFirst?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ user, isFirst = false }) => {
    const genderIcon = user.gender === 'female'
        ? require('../../assets/icons/female_icon.png')
        : user.gender === 'male'
            ? require('../../assets/icons/male_icon.png')
            : require('../../assets/icons/other_genders_icon.png');

    return (
        <View style={[styles.card, isFirst && styles.firstCard]}>
            {/* User photo (behind everything, inset to fit inside border) */}
            <View style={styles.imageWrapper}>
                <Image source={{ uri: user.photos[0] }} style={styles.image} />
            </View>

            {/* Border frame overlay */}
            <Image
                source={require('../../assets/connect_border.png')}
                style={styles.borderFrame}
            />

            {/* Gender icon - bottom left */}
            <View style={styles.genderContainer}>
                <Image source={genderIcon} style={styles.genderIcon} />
            </View>

            {/* Bottom info overlay */}
            <View style={styles.bottomInfo}>
                {/* Left side: Flag + Location + Name */}
                <View style={styles.leftInfo}>
                    <Text style={styles.flag}>{getFlagForLocation(user.location)}</Text>
                    <Text style={styles.location} numberOfLines={1}>{user.location}</Text>
                    <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
                </View>

                {/* Right side: AGE label + Age number */}
                <View style={styles.rightInfo}>
                    <View style={styles.ageLabel}>
                        <Text style={styles.ageLabelText}>A</Text>
                        <Text style={styles.ageLabelText}>G</Text>
                        <Text style={styles.ageLabelText}>E</Text>
                    </View>
                    <Text style={styles.age}>{user.age}</Text>
                </View>
            </View>
        </View>
    );
};

export { CARD_WIDTH, CARD_HEIGHT };

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        backgroundColor: Colors.card,
        ...Shadows.large,
    },
    firstCard: {
        // Additional styles for the top card
    },
    imageWrapper: {
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        bottom: 14,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        backgroundColor: Colors.surfaceLight,
    },
    borderFrame: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        resizeMode: 'stretch',
    },
    genderContainer: {
        position: 'absolute',
        top: 26,
        right: 18,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    genderIcon: {
        width: 40,
        height: 40,
        tintColor: Colors.white,
    },
    bottomInfo: {
        position: 'absolute',
        bottom: 0,
        left: 4,
        right: 0,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
    },
    leftInfo: {
        flex: 1,
        marginRight: Spacing.md,
    },
    flag: {
        fontSize: 22,
        marginBottom: 6,
    },
    location: {
        color: Colors.white,
        fontSize: FontSizes.sm,
        fontFamily: CARD_FONT,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    name: {
        color: Colors.white,
        fontSize: FontSizes.xl,
        fontFamily: CARD_FONT,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    rightInfo: {
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ageLabel: {
        alignItems: 'center',
        marginBottom: 6,
        marginLeft: 9,
    },
    ageLabelText: {
        color: Colors.white,
        fontSize: 34,
        fontFamily: CARD_FONT,
        lineHeight: 30,
        opacity: 0.85,
    },
    age: {
        color: Colors.white,
        fontSize: 32,
        fontFamily: CARD_FONT,
        lineHeight: 36,
    },
});
