import { delay, mockProfiles, UserProfile } from '../utils/mockData';

export const swipeService = {
    getCards: async (): Promise<UserProfile[]> => {
        await delay(600);
        return mockProfiles;
    },

    like: async (userId: string): Promise<{ matched: boolean }> => {
        await delay(200);
        return { matched: Math.random() < 0.3 };
    },

    pass: async (userId: string): Promise<void> => {
        await delay(100);
    },

    rewind: async (): Promise<void> => {
        await delay(300);
    },

    resetDislikes: async (): Promise<void> => {
        await delay(500);
    },
};
