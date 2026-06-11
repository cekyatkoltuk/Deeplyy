import React from 'react';
import { FontFamily } from '../utils/theme';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Colors, BorderRadius, FontSizes, FontWeights } from '../utils/theme';

interface AvatarProps {
    uri: string;
    size?: number;
    isOnline?: boolean;
    isPremium?: boolean;
    name?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    uri,
    size = 50,
    isOnline,
    isPremium,
    name,
}) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {uri ? (
                <Image
                    source={{ uri }}
                    style={[
                        styles.image,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                        isPremium && styles.premiumBorder,
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                        },
                    ]}
                >
                    <Text style={[styles.placeholderText, { fontSize: size * 0.4 }]}>
                        {name ? name.charAt(0).toUpperCase() : '?'}
                    </Text>
                </View>
            )}
            {isOnline !== undefined && (
                <View
                    style={[
                        styles.onlineDot,
                        {
                            backgroundColor: isOnline ? Colors.online : '#EB3223',
                            width: size * 0.24,
                            height: size * 0.24,
                            borderRadius: size * 0.12,
                        },
                    ]}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    image: {
        resizeMode: 'cover',
    },
    premiumBorder: {
        borderWidth: 2,
        borderColor: Colors.premiumGold,
    },
    placeholder: {
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        color: Colors.textSecondary,
        fontWeight: FontWeights.bold,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});
