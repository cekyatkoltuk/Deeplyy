import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAuthStore } from '../store/authStore';
import {
  FontFamily,
  Colors
} from '../utils/theme';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <NavigationContainer
            theme={{
                dark: true,
                colors: {
                    primary: Colors.primary,
                    background: Colors.background,
                    card: Colors.surface,
                    text: Colors.textPrimary,
                    border: Colors.border,
                    notification: Colors.primary,
                },
                fonts: {
                    regular: { fontFamily: FontFamily.regular, fontWeight: '400' },
                    medium: { fontFamily: FontFamily.medium, fontWeight: '500' },
                    bold: { fontFamily: FontFamily.bold, fontWeight: '700' },
                    heavy: { fontFamily: FontFamily.bold, fontWeight: '800' },
                },
            }}
        >
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabNavigator} />
                        <Stack.Screen name="Settings" component={SettingsScreen} options={{ animation: 'slide_from_right' }} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
