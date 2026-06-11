import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationStore } from '../store/notificationStore';
import { useChatStore } from '../store/chatStore';

const SOCKET_URL = 'http://192.168.1.104:3000';

let socket: Socket | null = null;

export const socketService = {
    connect: async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        if (socket?.connected) return;

        socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected');
        });

        // Listen for new likes — increment badge AND refresh likes list
        socket.on('new_like', (data: any) => {
            useNotificationStore.getState().incrementLikes();
            // Notify any listeners (e.g. LikesMeScreen)
            socketService._emitLocal('new_like', data);
        });

        // Listen for new messages — update chat store in real-time
        socket.on('new_message', (data: { matchId: string; message: any }) => {
            const chatStore = useChatStore.getState();
            chatStore.addIncomingMessage(data.matchId, data.message);
            // Notify any listeners (e.g. ChatListScreen)
            socketService._emitLocal('new_message', data);
        });

        // Listen for message_notification (for users NOT in the chat room)
        socket.on('message_notification', (data: { matchId: string; message: any }) => {
            const chatStore = useChatStore.getState();
            if (chatStore.activeConversationId !== data.matchId) {
                useNotificationStore.getState().incrementMessages();
            }
            chatStore.addIncomingMessage(data.matchId, data.message);
            socketService._emitLocal('message_notification', data);
        });

        // Listen for new match event
        socket.on('new_match', (data: any) => {
            socketService._emitLocal('new_match', data);
        });

        // Listen for online status change
        socket.on('user_status_change', (data: any) => {
            socketService._emitLocal('user_status_change', data);
        });

        // Typing indicator
        socket.on('typing', (data: any) => {
            socketService._emitLocal('typing', data);
        });

        // Messages read
        socket.on('messages_read', (data: any) => {
            const chatStore = useChatStore.getState();
            if (data.matchId) {
                chatStore.markMessagesAsRead(data.matchId);
            }
            socketService._emitLocal('messages_read', data);
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        socket.on('connect_error', (err) => {
            console.log('[Socket] Connection error:', err.message);
        });
    },

    disconnect: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    getSocket: () => socket,

    // --- Room management ---
    joinRoom: (matchId: string) => {
        socket?.emit('join_room', { matchId });
    },

    leaveRoom: (matchId: string) => {
        socket?.emit('leave_room', { matchId });
    },

    // --- Send message via socket ---
    sendMessage: (matchId: string, text: string) => {
        socket?.emit('send_message', { matchId, text });
    },

    // --- Typing indicator ---
    sendTyping: (matchId: string, isTyping: boolean) => {
        socket?.emit('typing', { matchId, isTyping });
    },

    // --- Read messages ---
    markRead: (matchId: string) => {
        socket?.emit('read_messages', { matchId });
    },

    // --- Local event system for component listeners ---
    _listeners: {} as Record<string, Set<Function>>,

    _emitLocal: (event: string, data: any) => {
        const listeners = socketService._listeners[event];
        if (listeners) {
            listeners.forEach((cb) => cb(data));
        }
    },

    on: (event: string, callback: Function) => {
        if (!socketService._listeners[event]) {
            socketService._listeners[event] = new Set();
        }
        socketService._listeners[event].add(callback);
    },

    off: (event: string, callback: Function) => {
        socketService._listeners[event]?.delete(callback);
    },
};
