import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { useNavigation, NavigationProp, useRoute } from '@react-navigation/native';
import { usePremiumStore } from '../store/premiumStore';
import { Colors, FontSizes, FontWeights, Spacing, FontFamily } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

interface AppHeaderProps {
    titleImage?: ImageSourcePropType;
}

export const AppHeader = ({ titleImage }: AppHeaderProps = {}) => {
    const navigation = useNavigation<NavigationProp<any>>();
    const { isPremium } = usePremiumStore();

    const handleSettingsPress = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftContainer}>
                <Image source={require('../../assets/titles/title_deeplyy_icon.png')} style={styles.deeplyyIcon} resizeMode="contain" />
                {titleImage ? (
                    <Image source={titleImage} style={styles.titleImage} resizeMode="contain" />
                ) : (
                    <Text style={styles.logo}>Deeplyy</Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.settingsBtn}
                onPress={handleSettingsPress}
            >
                <Image source={require('../../assets/icons/settings.png')} style={styles.settingsIcon} resizeMode="contain" />
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
        backgroundColor: 'transparent',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    deeplyyIcon: {
        width: 24,
        height: 24,
    },
    logo: {
        fontSize: FontSizes.xl,
        fontFamily: FontFamily.heading,
        fontWeight: FontWeights.bold,
        color: Colors.primary,
    },
    titleImage: {
        height: 32,
        width: 120,
        justifyContent: 'center',
    },
    settingsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    settingsIcon: {
        width: 28,
        height: 28,
    },
});
