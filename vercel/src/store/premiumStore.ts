import { create } from 'zustand';
import api from '../services/api';

interface PremiumState {
    isPremium: boolean;
    plan: string | null;
    expiresAt: string | null;
    isLoading: boolean;
    checkStatus: () => Promise<void>;
    subscribe: (plan: 'monthly' | 'yearly') => Promise<void>;
    cancelSubscription: () => Promise<void>;
    togglePremium: () => void;
}

export const usePremiumStore = create<PremiumState>((set) => ({
    isPremium: false,
    plan: null,
    expiresAt: null,
    isLoading: false,

    checkStatus: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/subscriptions/status');
            set({
                isPremium: res.data.isPremium,
                plan: res.data.plan,
                expiresAt: res.data.expiresAt,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to check premium status:', error);
        }
    },

    subscribe: async (plan: 'monthly' | 'yearly') => {
        set({ isLoading: true });
        try {
            const res = await api.post('/subscriptions/subscribe', { plan });
            set({
                isPremium: true,
                plan: res.data.plan,
                expiresAt: res.data.expiresAt,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to subscribe:', error);
        }
    },

    cancelSubscription: async () => {
        set({ isLoading: true });
        try {
            await api.post('/subscriptions/cancel');
            set({
                isPremium: false,
                plan: null,
                expiresAt: null,
                isLoading: false,
            });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to cancel subscription:', error);
        }
    },

    // Dev toggle for quick testing
    togglePremium: () => {
        set((state) => {
            const newPremium = !state.isPremium;
            // Fire and forget API call
            if (newPremium) {
                api.post('/subscriptions/subscribe', { plan: 'monthly' }).catch(() => { });
            } else {
                api.post('/subscriptions/cancel').catch(() => { });
            }
            return { isPremium: newPremium };
        });
    },
}));
