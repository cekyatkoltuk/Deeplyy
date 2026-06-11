import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setCachedToken } from '../services/api';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    userId: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, age: number, gender: 'male' | 'female' | 'other', phone: string, extraData: any) => Promise<void>;
    logout: () => void;
    setAuthenticated: (value: boolean) => Promise<void>;
    loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    isLoading: false,
    token: null,
    userId: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user } = res.data;

            await AsyncStorage.setItem('token', token);
            setCachedToken(token);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('userId', user.id);
            await AsyncStorage.setItem('onboardingComplete', 'true');

            set({
                isAuthenticated: true,
                isLoading: false,
                token,
                userId: user.id,
            });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    },

    register: async (name, email, password, age, gender, phone, extraData) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/register', { 
                name, email, password, age, gender, phone_number: phone, 
                ...extraData
            });
            const { token, refreshToken, user } = res.data;

            await AsyncStorage.setItem('token', token);
            setCachedToken(token);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('userId', user.id);

            // Don't set isAuthenticated here — onboarding will call setAuthenticated(true)
            // when the user completes the profile setup.
            // We DO store the token so API calls work during onboarding.
            set({
                isAuthenticated: false,
                isLoading: false,
                token,
                userId: user.id,
            });
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    },

    logout: async () => {
        setCachedToken(null);
        await AsyncStorage.multiRemove(['token', 'refreshToken', 'userId', 'onboardingComplete']);
        set({
            isAuthenticated: false,
            token: null,
            userId: null,
        });
    },

    setAuthenticated: async (value: boolean) => {
        if (value) {
            await AsyncStorage.setItem('onboardingComplete', 'true');
        } else {
            await AsyncStorage.removeItem('onboardingComplete');
        }
        set({ isAuthenticated: value });
    },

    loadToken: async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        if (token && userId && onboardingComplete === 'true') {
            setCachedToken(token);
            set({ isAuthenticated: true, token, userId });
        }
    },
}));
