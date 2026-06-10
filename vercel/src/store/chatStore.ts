import { create } from 'zustand';
import api from '../services/api';

interface Message {
    id: string;
    senderId: string;
    text: string;
    type: string;
    read: boolean;
    timestamp: string;
}

interface ConversationUser {
    id: string;
    name: string;
    photos: string[];
    isOnline: boolean;
}

interface Conversation {
    id: string;
    user: ConversationUser;
    lastMessage: {
        id: string;
        senderId: string;
        text: string;
        type: string;
        read: boolean;
        timestamp: string;
    } | null;
    unreadCount: number;
    isTyping: boolean;
    isBlockedByMe?: boolean;
    isBlockedByThem?: boolean;
}

interface ChatState {
    conversations: Conversation[];
    messages: Record<string, Message[]>;
    isLoading: boolean;
    loadConversations: () => Promise<void>;
    loadMessages: (matchId: string) => Promise<void>;
    sendMessage: (matchId: string, text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    messages: {},
    isLoading: false,

    loadConversations: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/chat/conversations');
            set({ conversations: res.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to load conversations:', error);
        }
    },

    loadMessages: async (matchId: string) => {
        set({ isLoading: true });
        try {
            const res = await api.get(`/chat/messages/${matchId}`);
            set((state) => ({
                messages: { ...state.messages, [matchId]: res.data },
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            console.error('Failed to load messages:', error);
        }
    },

    sendMessage: async (matchId: string, text: string) => {
        try {
            const res = await api.post(`/chat/messages/${matchId}`, { text });
            const newMessage: Message = res.data;

            set((state) => ({
                messages: {
                    ...state.messages,
                    [matchId]: [...(state.messages[matchId] || []), newMessage],
                },
                conversations: state.conversations.map((conv) =>
                    conv.id === matchId
                        ? {
                            ...conv,
                            lastMessage: {
                                id: newMessage.id,
                                senderId: newMessage.senderId,
                                text: newMessage.text,
                                type: newMessage.type,
                                read: newMessage.read,
                                timestamp: newMessage.timestamp,
                            },
                        }
                        : conv
                ),
            }));
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    },
}));
