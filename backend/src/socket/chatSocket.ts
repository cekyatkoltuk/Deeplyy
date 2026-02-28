import { Server, Socket } from 'socket.io';
import { query } from '../config/database';
import { verifyToken } from '../utils/helpers';

export const setupChatSocket = (io: Server) => {
    // Auth middleware for sockets
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication required'));
        }
        try {
            const decoded = verifyToken(token);
            (socket as any).userId = decoded.userId;
            next();
        } catch (error) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const userId = (socket as any).userId;
        console.log(`🟢 User connected: ${userId}`);

        // Set user online
        query('UPDATE users SET is_online = TRUE, last_seen = NOW() WHERE id = $1', [userId]);

        // Join personal room
        socket.join(`user:${userId}`);

        // Join match room
        socket.on('join_room', async (data: { matchId: string }) => {
            const { matchId } = data;

            // Verify user is part of this match
            const result = await query(
                'SELECT id FROM matches WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
                [matchId, userId]
            );

            if (result.rows.length > 0) {
                socket.join(`match:${matchId}`);
                console.log(`📭 User ${userId} joined room match:${matchId}`);
            }
        });

        // Leave match room
        socket.on('leave_room', (data: { matchId: string }) => {
            socket.leave(`match:${data.matchId}`);
        });

        // Send message
        socket.on('send_message', async (data: { matchId: string; text: string; type?: string }) => {
            try {
                const { matchId, text, type = 'text' } = data;

                // Verify user is part of this match
                const matchCheck = await query(
                    'SELECT user1_id, user2_id FROM matches WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
                    [matchId, userId]
                );

                if (matchCheck.rows.length === 0) return;

                // Save to database
                const result = await query(
                    `INSERT INTO messages (match_id, sender_id, text, type)
           VALUES ($1, $2, $3, $4)
           RETURNING id, sender_id, text, type, is_read, created_at`,
                    [matchId, userId, text, type]
                );

                const message = {
                    id: result.rows[0].id,
                    senderId: result.rows[0].sender_id,
                    text: result.rows[0].text,
                    type: result.rows[0].type,
                    read: result.rows[0].is_read,
                    timestamp: result.rows[0].created_at,
                };

                // Broadcast to match room
                io.to(`match:${matchId}`).emit('new_message', { matchId, message });

                // Also notify the other user's personal room
                const match = matchCheck.rows[0];
                const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
                io.to(`user:${otherUserId}`).emit('message_notification', { matchId, message });
            } catch (error) {
                console.error('Socket send_message error:', error);
            }
        });

        // Typing indicator
        socket.on('typing', (data: { matchId: string; isTyping: boolean }) => {
            socket.to(`match:${data.matchId}`).emit('typing', {
                matchId: data.matchId,
                userId,
                isTyping: data.isTyping,
            });
        });

        // Read messages
        socket.on('read_messages', async (data: { matchId: string }) => {
            try {
                await query(
                    'UPDATE messages SET is_read = TRUE WHERE match_id = $1 AND sender_id != $2 AND is_read = FALSE',
                    [data.matchId, userId]
                );

                socket.to(`match:${data.matchId}`).emit('messages_read', {
                    matchId: data.matchId,
                    readBy: userId,
                });
            } catch (error) {
                console.error('Socket read_messages error:', error);
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`🔴 User disconnected: ${userId}`);
            query('UPDATE users SET is_online = FALSE, last_seen = NOW() WHERE id = $1', [userId]);
        });
    });
};
