import { delay, mockCurrentUser, UserProfile } from '../utils/mockData';

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        await delay(500);
        return mockCurrentUser;
    },

    updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
        await delay(500);
        return { ...mockCurrentUser, ...updates };
    },

    uploadPhoto: async (uri: string): Promise<{ url: string }> => {
        await delay(1000);
        return { url: uri };
    },

    deletePhoto: async (photoId: string): Promise<void> => {
        await delay(300);
    },
};
