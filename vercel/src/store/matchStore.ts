import { create } from 'zustand';
import api from '../services/api';

interface MatchUser {
    id: string;
    name: string;
    age: number;
    bio: string;
    photos: string[];
    interests: string[];
    location: string;
    isPremium: boolean;
    isOnline: boolean;
    distance: number;
}

interface Match {
    id: string;
    user: MatchUser;
    matchedAt: string;
    lastMessage: string | null;
    unreadCount: number;
    isNew: boolean;
}

interface MatchState {
    matches: Match[];
    isLoading: boolean;
    loadMatches: () => Promise<void>;
    addMatch: (user: any) => void;
    removeMatch: (matchId: string) => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
    matches: [],
    isLoading: false,

    loadMatches: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/matches');
            set({ matches: res.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to load matches:', error);
        }
    },

    addMatch: (user: any) => {
        const newMatch: Match = {
            id: 'temp-' + Date.now(),
            user: {
                id: user.id,
                name: user.name,
                age: user.age,
                bio: user.bio || '',
                photos: user.photos || [],
                interests: user.interests || [],
                location: user.location || '',
                isPremium: user.isPremium || false,
                isOnline: user.isOnline || false,
                distance: user.distance || 0,
            },
            matchedAt: new Date().toISOString(),
            lastMessage: null,
            unreadCount: 0,
            isNew: true,
        };
        set((state) => ({ matches: [newMatch, ...state.matches] }));
    },

    removeMatch: (matchId: string) => {
        set((state) => ({
            matches: state.matches.filter((m) => m.id !== matchId),
        }));
    },
}));
