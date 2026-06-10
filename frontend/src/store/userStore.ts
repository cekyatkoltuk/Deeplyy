import { create } from 'zustand';
import api from '../services/api';

interface UserProfile {
    id: string;
    email: string;
    name: string;
    age: number;
    bio: string;
    gender: string;
    location: string;
    photos: string[];
    interests: string[];
    mbti?: string;
    enneagram?: string;
    lookingFor?: string;
    isPremium: boolean;
    isOnline: boolean;
    distance: number;
}

interface UserState {
    profile: UserProfile;
    isLoading: boolean;
    loadProfile: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    uploadPhoto: (uri: string) => Promise<void>;
    removePhoto: (index: number) => void;
    setInterests: (interests: string[]) => void;
}

const defaultProfile: UserProfile = {
    id: '',
    email: '',
    name: 'User',
    age: 25,
    bio: '',
    gender: 'other',
    location: '',
    photos: [],
    interests: [],
    mbti: undefined,
    enneagram: undefined,
    lookingFor: undefined,
    isPremium: false,
    isOnline: true,
    distance: 0,
};

export const useUserStore = create<UserState>((set, get) => ({
    profile: defaultProfile,
    isLoading: false,

    loadProfile: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/users/profile');
            set({ profile: res.data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            console.error('Failed to load profile:', error);
            // If user doesn't exist in DB anymore (404), clear auth state
            if (error.response?.status === 404) {
                const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
                await AsyncStorage.multiRemove(['token', 'refreshToken', 'userId']);
                // Force page reload to redirect to login
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            }
        }
    },

    updateProfile: async (updates: Partial<UserProfile>) => {
        set({ isLoading: true });
        try {
            const res = await api.put('/users/profile', updates);
            set({ profile: res.data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false });
            console.error('Failed to update profile:', error);
            throw error; // Re-throw so the caller knows it failed
        }
    },

    uploadPhoto: async (uri: string) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/users/photos', { photoUrl: uri });
            set((state) => ({
                profile: { ...state.profile, photos: res.data.photos },
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to upload photo:', error);
        }
    },

    removePhoto: async (index: number) => {
        try {
            const res = await api.delete(`/users/photos/${index}`);
            set((state) => ({
                profile: { ...state.profile, photos: res.data.photos },
            }));
        } catch (error) {
            console.error('Failed to remove photo:', error);
        }
    },

    setInterests: async (interests: string[]) => {
        // Optimistic update for instant UI feedback
        set((state) => ({
            profile: { ...state.profile, interests },
        }));
        
        try {
            const res = await api.put('/users/profile', { interests });
            // Ensure state matches server exactly (in case server formatted it)
            set((state) => ({
                profile: { ...state.profile, interests: res.data.interests },
            }));
        } catch (error) {
            console.error('Failed to set interests:', error);
            // Optionally could revert state here
        }
    },
}));
