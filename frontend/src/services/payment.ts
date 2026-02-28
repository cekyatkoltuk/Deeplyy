import { delay } from '../utils/mockData';

export type SubscriptionPlan = 'monthly' | 'yearly';

export interface SubscriptionInfo {
    isPremium: boolean;
    plan: SubscriptionPlan | null;
    expiresAt: string | null;
}

export const paymentService = {
    getSubscriptionStatus: async (): Promise<SubscriptionInfo> => {
        await delay(500);
        return { isPremium: false, plan: null, expiresAt: null };
    },

    subscribe: async (plan: SubscriptionPlan): Promise<SubscriptionInfo> => {
        await delay(1500);
        return {
            isPremium: true,
            plan,
            expiresAt: new Date(
                Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
            ).toISOString(),
        };
    },

    cancelSubscription: async (): Promise<void> => {
        await delay(500);
    },

    // Stripe placeholder
    createPaymentIntent: async (amount: number): Promise<{ clientSecret: string }> => {
        await delay(800);
        return { clientSecret: 'mock_client_secret_' + Date.now() };
    },
};
