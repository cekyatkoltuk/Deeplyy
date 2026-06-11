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
    activeConversationId: string | null;
    setActiveConversation: (id: string | null) => void;
    markMessagesAsRead: (matchId: string) => void;
    loadConversations: () => Promise<void>;
    loadMessages: (matchId: string) => Promise<void>;
    sendMessage: (matchId: string, text: string) => Promise<void>;
    addIncomingMessage: (matchId: string, message: Message) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    conversations: [],
    messages: {},
    isLoading: false,
    activeConversationId: null,

    setActiveConversation: (id: string | null) => set({ activeConversationId: id }),

    markMessagesAsRead: (matchId: string) => {
        set((state) => {
            const existing = state.messages[matchId];
            if (!existing) return state;
            return {
                messages: {
                    ...state.messages,
                    [matchId]: existing.map((m) => ({ ...m, read: true })),
                },
                conversations: state.conversations.map((conv) =>
                    conv.id === matchId && conv.lastMessage
                        ? { ...conv, lastMessage: { ...conv.lastMessage, read: true } }
                        : conv
                ),
            };
        });
    },

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

            set((state) => {
                const existing = state.messages[matchId] || [];
                if (existing.some((m) => m.id === newMessage.id)) {
                    // Message was already added via fast socket event
                    return state;
                }
                return {
                    messages: {
                        ...state.messages,
                        [matchId]: [...existing, newMessage],
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
                };
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    },

    addIncomingMessage: (matchId: string, message: Message) => {
        set((state) => {
            // Avoid duplicate messages
            const existing = state.messages[matchId] || [];
            if (existing.some((m) => m.id === message.id)) {
                return state;
            }

            return {
                messages: {
                    ...state.messages,
                    [matchId]: [...existing, message],
                },
                conversations: state.conversations
                    .map((conv) =>
                        conv.id === matchId
                            ? {
                                ...conv,
                                lastMessage: {
                                    id: message.id,
                                    senderId: message.senderId,
                                    text: message.text,
                                    type: message.type,
                                    read: message.read,
                                    timestamp: message.timestamp,
                                },
                                unreadCount: state.activeConversationId === matchId ? conv.unreadCount : conv.unreadCount + 1,
                            }
                            : conv
                    )
                    .sort((a, b) => {
                        const timeA = a.lastMessage?.timestamp || 0;
                        const timeB = b.lastMessage?.timestamp || 0;
                        return new Date(timeB).getTime() - new Date(timeA).getTime();
                    }),
            };
        });
    },
}));
