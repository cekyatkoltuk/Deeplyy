import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Colors, FontSizes, FontWeights, Spacing, FontFamily } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
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

const CUSTOM_ICONS = {
    matches: {
        active: require('../../assets/icons/matches-active.png'),
        inactive: require('../../assets/icons/matches-inactive.png'),
    },
    chat: {
        active: require('../../assets/icons/chat-active.png'),
        inactive: require('../../assets/icons/chat-inactive.png'),
    },
    likes: {
        active: require('../../assets/icons/likes-active.png'),
        inactive: require('../../assets/icons/likes-inactive.png'),
    },
    profile: {
        active: require('../../assets/icons/profile-active.png'),
        inactive: require('../../assets/icons/profile-inactive.png'),
    },
    discover: {
        active: require('../../assets/icons/discover-active.png'),
        inactive: require('../../assets/icons/discover-inactive.png'),
    },
};

interface TabIconProps {
    name: keyof typeof CUSTOM_ICONS;
    label: string;
    focused: boolean;
    badge?: number;
}

const TabIcon = ({ name, label, focused, badge }: TabIconProps) => {
    const source = focused ? CUSTOM_ICONS[name].active : CUSTOM_ICONS[name].inactive;

    return (
        <View style={tabIconStyles.container}>
            <View style={tabIconStyles.iconWrapper}>
                <Image
                    source={source}
                    style={tabIconStyles.iconImage}
                    resizeMode="contain"
                />
                {badge !== undefined && badge > 0 && (
                    <View style={tabIconStyles.badge}>
                        <Text style={tabIconStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                    </View>
                )}
            </View>
            <Text style={[tabIconStyles.label, focused && tabIconStyles.labelFocused]}>
                {label}
            </Text>
        </View>
    );
};

const tabIconStyles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: '100%',
    },
    iconWrapper: {
        width: 26,
        height: 26,
        position: 'relative',
    },
    iconImage: {
        width: 26,
        height: 26,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -8,
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
        fontFamily: FontFamily.small,

    },
    label: {
        fontSize: 10,
        fontFamily: FontFamily.small,
        color: Colors.textMuted,
        marginTop: 2,
    },
    labelFocused: {
        color: Colors.primary,

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
                    height: 65,
                    paddingTop: 12,
                    paddingBottom: 0,
                },
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="MatchesTab"
                component={MatchesScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="matches" label="Matches" focused={focused} badge={2} />
                    ),
                }}
            />
            <Tab.Screen
                name="ChatTab"
                component={ChatNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="chat" label="Chat" focused={focused} badge={3} />
                    ),
                }}
            />
            <Tab.Screen
                name="LikesMeTab"
                component={LikesMeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="likes" label="Likes" focused={focused} badge={5} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="profile" label="Profile" focused={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="DiscoveryTab"
                component={DiscoveryNavigator}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon name="discover" label="Discover" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};
