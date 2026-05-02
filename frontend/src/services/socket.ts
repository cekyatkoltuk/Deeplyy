import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotificationStore } from '../store/notificationStore';

const SOCKET_URL = 'http://localhost:3000';

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

        // Listen for new likes
        socket.on('new_like', () => {
            useNotificationStore.getState().incrementLikes();
        });

        // Listen for new messages
        socket.on('message_notification', () => {
            useNotificationStore.getState().incrementMessages();
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });
    },

    disconnect: () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
    },

    getSocket: () => socket,
};
