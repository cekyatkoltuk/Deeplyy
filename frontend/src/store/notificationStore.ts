import { create } from 'zustand';
import api from '../services/api';

interface NotificationState {
    unreadLikes: number;
    unreadMessages: number;
    loadUnreadCounts: () => Promise<void>;
    incrementLikes: () => void;
    incrementMessages: () => void;
    clearLikes: () => void;
    clearMessages: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    unreadLikes: 0,
    unreadMessages: 0,

    loadUnreadCounts: async () => {
        try {
            // Fetch unread likes count from the server
            const likesRes = await api.get('/matches/likes');
            const likesCount = Array.isArray(likesRes.data) ? likesRes.data.length : 0;

            // Fetch unread messages count from conversations
            const chatRes = await api.get('/chat/conversations');
            let msgCount = 0;
            if (Array.isArray(chatRes.data)) {
                msgCount = chatRes.data.reduce(
                    (sum: number, conv: any) => sum + (conv.unreadCount || 0),
                    0
                );
            }

            set({ unreadLikes: likesCount, unreadMessages: msgCount });
        } catch (error) {
            console.error('Failed to load notification counts:', error);
        }
    },

    incrementLikes: () => set((state) => ({ unreadLikes: state.unreadLikes + 1 })),
    incrementMessages: () => set((state) => ({ unreadMessages: state.unreadMessages + 1 })),
    clearLikes: () => set({ unreadLikes: 0 }),
    clearMessages: () => set({ unreadMessages: 0 }),
}));
