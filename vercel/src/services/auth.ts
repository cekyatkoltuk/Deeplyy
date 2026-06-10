import { delay, mockCurrentUser, UserProfile } from '../utils/mockData';

export interface AuthResponse {
    token: string;
    user: UserProfile;
}

export const authService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        await delay(800);
        return { token: 'mock-jwt-token', user: mockCurrentUser };
    },

    register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
        await delay(1000);
        return { token: 'mock-jwt-token', user: { ...mockCurrentUser, name } };
    },

    logout: async (): Promise<void> => {
        await delay(300);
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        await delay(500);
        return { message: 'Password reset email sent' };
    },
};
