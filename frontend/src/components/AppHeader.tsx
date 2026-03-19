import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { usePremiumStore } from '../store/premiumStore';
import { Colors, FontSizes, FontWeights, Spacing, FontFamily } from '../utils/theme';

export const AppHeader = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { isPremium } = usePremiumStore();

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>🔥 Flame</Text>
            <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => navigation.navigate('DiscoveryTab', { screen: 'DiscoveryFilters' })}
            >
                <Text style={styles.filterIcon}>⚙️</Text>
                {!isPremium && <Text style={styles.lockBadge}>🔒</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        height: 65,
        paddingTop: 10,
        backgroundColor: Colors.surface, // Dark black background like nav bar
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
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
});
