import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { usePremiumStore } from '../store/premiumStore';
import { Colors, FontSizes, FontWeights, Spacing, FontFamily } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
    onFilterPress?: () => void;
}

export const AppHeader = ({ onFilterPress }: AppHeaderProps = {}) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { isPremium } = usePremiumStore();

    const handleFilterPress = () => {
        if (onFilterPress) {
            onFilterPress();
            return;
        }
        // Navigate cross-tab (for screens outside the Discovery stack)
        navigation.navigate('DiscoveryTab', { screen: 'DiscoveryFilters' });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Flame</Text>
            <TouchableOpacity
                style={styles.filterBtn}
                onPress={handleFilterPress}
            >
                <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
                {!isPremium && (
                    <Ionicons
                        name="lock-closed"
                        size={10}
                        color={Colors.textMuted}
                        style={styles.lockBadge}
                    />
                )}
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
        backgroundColor: Colors.surface,
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
    lockBadge: {
        marginLeft: -4,
        marginTop: -8,
    },
});
