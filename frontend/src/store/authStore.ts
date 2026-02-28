import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    userId: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, age: number, gender: string) => Promise<void>;
    logout: () => void;
    setAuthenticated: (value: boolean) => void;
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
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('userId', user.id);

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

    register: async (name: string, email: string, password: string, age: number = 25, gender: string = 'other') => {
        set({ isLoading: true });
        try {
            const res = await api.post('/auth/register', { name, email, password, age, gender });
            const { token, refreshToken, user } = res.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('userId', user.id);

            set({
                isAuthenticated: true,
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
        await AsyncStorage.multiRemove(['token', 'refreshToken', 'userId']);
        set({
            isAuthenticated: false,
            token: null,
            userId: null,
        });
    },

    setAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
    },

    loadToken: async () => {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (token && userId) {
            set({ isAuthenticated: true, token, userId });
        }
    },
}));
