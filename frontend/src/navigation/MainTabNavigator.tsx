import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing } from '../utils/theme';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { DiscoveryFiltersScreen } from '../screens/DiscoveryFiltersScreen';
import { MatchesScreen } from '../screens/MatchesScreen';
import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';
import { LikesMeScreen } from '../screens/LikesMeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { UserProfileViewScreen } from '../screens/UserProfileViewScreen';
import { BlockedUsersScreen } from '../screens/BlockedUsersScreen';
import { usePremiumStore } from '../store/premiumStore';

const Tab = createBottomTabNavigator();
const DiscoveryStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DiscoveryNavigator = () => (
    <DiscoveryStack.Navigator screenOptions={{ headerShown: false }}>
        <DiscoveryStack.Screen name="DiscoveryMain" component={DiscoveryScreen} />
        <DiscoveryStack.Screen
            name="DiscoveryFilters"
            component={DiscoveryFiltersScreen}
            options={{ animation: 'slide_from_bottom' }}
        />
    </DiscoveryStack.Navigator>
);

const ChatNavigator = () => (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
        <ChatStack.Screen name="ChatList" component={ChatListScreen} />
        <ChatStack.Screen
            name="ChatRoom"
            component={ChatRoomScreen}
            options={{ animation: 'slide_from_right' }}
        />
        <ChatStack.Screen
            name="UserProfileView"
            component={UserProfileViewScreen}
            options={{ animation: 'slide_from_right' }}
        />
    </ChatStack.Navigator>
);

const ProfileNavigator = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
        <ProfileStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
        />
        <ProfileStack.Screen
            name="BlockedUsers"
            component={BlockedUsersScreen}
            options={{ animation: 'slide_from_right' }}
        />
    </ProfileStack.Navigator>
);

interface TabIconProps {
    icon: string;
    label: string;
    focused: boolean;
    badge?: number;
}

const TabIcon = ({ icon, label, focused, badge }: TabIconProps) => (
    <View style={tabIconStyles.container}>
        <Text style={[tabIconStyles.icon, focused && tabIconStyles.iconFocused]}>
            {icon}
        </Text>
        {badge !== undefined && badge > 0 && (
            <View style={tabIconStyles.badge}>
                <Text style={tabIconStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
            </View>
        )}
        <Text style={[tabIconStyles.label, focused && tabIconStyles.labelFocused]}>
            {label}
        </Text>
    </View>
);

const tabIconStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        position: 'relative',
    },
    icon: {
        fontSize: 24,
        opacity: 0.5,
    },
    iconFocused: {
        opacity: 1,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: 6,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: Colors.white,
        fontSize: 10,
        fontWeight: '700',
    },
    label: {
        fontSize: 10,
        color: Colors.textMuted,
        marginTop: 2,
    },
    labelFocused: {
        color: Colors.primary,
        fontWeight: '600',
    },
});

export const MainTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.surface,
                    borderTopColor: Colors.border,
                    borderTopWidth: 1,
                    height: 80,
                    paddingTop: Spacing.sm,
                    paddingBottom: Spacing.md,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="DiscoveryTab"
                component={DiscoveryNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="🔥" label="Discover" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="MatchesTab"
                component={MatchesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="💝" label="Matches" focused={focused} badge={2} />
                    ),
                }}
            />
            <Tab.Screen
                name="ChatTab"
                component={ChatNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="💬" label="Chat" focused={focused} badge={3} />
                    ),
                }}
            />
            <Tab.Screen
                name="LikesMeTab"
                component={LikesMeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="❤️" label="Likes" focused={focused} badge={5} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon="👤" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
