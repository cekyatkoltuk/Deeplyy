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
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to load profile:', error);
        }
    },

    updateProfile: async (updates: Partial<UserProfile>) => {
        set({ isLoading: true });
        try {
            const res = await api.put('/users/profile', updates);
            set({ profile: res.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to update profile:', error);
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
        try {
            const res = await api.put('/users/profile', { interests });
            set((state) => ({
                profile: { ...state.profile, interests: res.data.interests },
            }));
        } catch (error) {
            console.error('Failed to set interests:', error);
        }
    },
}));
