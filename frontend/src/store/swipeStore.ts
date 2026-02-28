import { create } from 'zustand';
import api from '../services/api';

interface SwipeState {
    cards: any[];
    currentIndex: number;
    isLoading: boolean;
    loadCards: () => Promise<void>;
    swipeRight: (userId: string) => Promise<boolean>;
    swipeLeft: (userId: string) => Promise<void>;
    rewind: () => Promise<void>;
    resetDislikes: () => Promise<void>;
}

export const useSwipeStore = create<SwipeState>((set, get) => ({
    cards: [],
    currentIndex: 0,
    isLoading: false,

    loadCards: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/swipes/cards');
            set({ cards: res.data, currentIndex: 0, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to load cards:', error);
        }
    },

    swipeRight: async (userId: string) => {
        try {
            const res = await api.post('/swipes/like', { userId });
            set((state) => ({ currentIndex: state.currentIndex + 1 }));
            return res.data.matched || false;
        } catch (error) {
            console.error('Swipe right error:', error);
            set((state) => ({ currentIndex: state.currentIndex + 1 }));
            return false;
        }
    },

    swipeLeft: async (userId: string) => {
        try {
            await api.post('/swipes/pass', { userId });
        } catch (error) {
            console.error('Swipe left error:', error);
        }
        set((state) => ({ currentIndex: state.currentIndex + 1 }));
    },

    rewind: async () => {
        try {
            await api.post('/swipes/rewind');
            set((state) => ({
                currentIndex: Math.max(0, state.currentIndex - 1),
            }));
        } catch (error: any) {
            console.error('Rewind error:', error.response?.data?.error || error);
        }
    },

    resetDislikes: async () => {
        try {
            await api.post('/swipes/reset');
            // Reload cards after reset
            const res = await api.get('/swipes/cards');
            set({ cards: res.data, currentIndex: 0 });
        } catch (error: any) {
            console.error('Reset error:', error.response?.data?.error || error);
        }
    },
}));
