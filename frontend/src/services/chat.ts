import { delay, mockConversations, mockMessages, Conversation, Message } from '../utils/mockData';

export const chatService = {
    getConversations: async (): Promise<Conversation[]> => {
        await delay(500);
        return mockConversations;
    },

    getMessages: async (conversationId: string): Promise<Message[]> => {
        await delay(400);
        return mockMessages;
    },

    sendMessage: async (conversationId: string, text: string): Promise<Message> => {
        await delay(200);
        return {
            id: 'msg' + Date.now(),
            senderId: 'me',
            text,
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text',
        };
    },

    // Socket.io placeholder
    connectSocket: () => {
        // TODO: const socket = io(SOCKET_URL);
        console.log('[Chat] Socket connection placeholder');
    },

    disconnectSocket: () => {
        console.log('[Chat] Socket disconnect placeholder');
    },
};
