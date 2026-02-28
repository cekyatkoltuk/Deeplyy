import { Router, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/chat/conversations — list all conversations
router.get('/conversations', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT m.id as match_id,
              u.id as user_id, u.name, u.photos, u.is_online,
              msg.id as msg_id, msg.sender_id, msg.text, msg.type, msg.is_read, msg.created_at as msg_time,
              (SELECT COUNT(*) FROM messages WHERE match_id = m.id AND sender_id != $1 AND is_read = FALSE)::int as unread_count,
              EXISTS (
                SELECT 1 FROM swipes s
                WHERE s.swiper_id = $1 AND s.swiped_id = u.id AND s.direction = 'block'
              ) as is_blocked_by_me,
              EXISTS (
                SELECT 1 FROM swipes s
                WHERE s.swiper_id = u.id AND s.swiped_id = $1 AND s.direction = 'block'
              ) as is_blocked_by_them
       FROM matches m
       JOIN users u ON (CASE WHEN m.user1_id = $1 THEN m.user2_id ELSE m.user1_id END) = u.id
       LEFT JOIN LATERAL (
         SELECT * FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1
       ) msg ON TRUE
       WHERE (m.user1_id = $1 OR m.user2_id = $1)
       ORDER BY COALESCE(msg.created_at, m.created_at) DESC`,
            [req.userId]
        );

        const conversations = result.rows.map((row) => ({
            id: row.match_id,
            user: {
                id: row.user_id,
                name: row.name,
                photos: row.photos,
                isOnline: row.is_online,
            },
            lastMessage: row.msg_id
                ? {
                    id: row.msg_id,
                    senderId: row.sender_id,
                    text: row.text,
                    type: row.type,
                    read: row.is_read,
                    timestamp: row.msg_time,
                }
                : null,
            unreadCount: row.unread_count,
            isTyping: false,
            isBlockedByMe: row.is_blocked_by_me,
            isBlockedByThem: row.is_blocked_by_them,
        }));

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/chat/messages/:matchId — get message history
router.get('/messages/:matchId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { matchId } = req.params;
        const limit = parseInt(req.query.limit as string) || 50;
        const offset = parseInt(req.query.offset as string) || 0;

        // Verify user is part of this match
        const matchCheck = await query(
            'SELECT id FROM matches WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
            [matchId, req.userId]
        );

        if (matchCheck.rows.length === 0) {
            res.status(403).json({ error: 'Not authorized to view these messages' });
            return;
        }

        const result = await query(
            `SELECT id, sender_id, text, type, image_url, is_read, created_at
       FROM messages
       WHERE match_id = $1
       ORDER BY created_at ASC
       LIMIT $2 OFFSET $3`,
            [matchId, limit, offset]
        );

        // Mark messages as read
        await query(
            `UPDATE messages SET is_read = TRUE
       WHERE match_id = $1 AND sender_id != $2 AND is_read = FALSE`,
            [matchId, req.userId]
        );

        const messages = result.rows.map((msg) => ({
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.text,
            type: msg.type,
            imageUrl: msg.image_url,
            read: msg.is_read,
            timestamp: msg.created_at,
        }));

        res.json(messages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/chat/messages/:matchId — send a message (REST fallback)
router.post('/messages/:matchId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { matchId } = req.params;
        const { text, type = 'text' } = req.body;

        if (!text) {
            res.status(400).json({ error: 'Message text is required' });
            return;
        }

        // Verify user is part of this match
        const matchCheck = await query(
            'SELECT id, user1_id, user2_id FROM matches WHERE id = $1 AND (user1_id = $2 OR user2_id = $2)',
            [matchId, req.userId]
        );

        if (matchCheck.rows.length === 0) {
            res.status(403).json({ error: 'Not authorized' });
            return;
        }

        // Check if either user has blocked the other
        const match = matchCheck.rows[0];
        const otherUserId = match.user1_id === req.userId ? match.user2_id : match.user1_id;
        const blockCheck = await query(
            `SELECT 1 FROM swipes WHERE direction = 'block'
             AND ((swiper_id = $1 AND swiped_id = $2) OR (swiper_id = $2 AND swiped_id = $1))`,
            [req.userId, otherUserId]
        );
        if (blockCheck.rows.length > 0) {
            res.status(403).json({ error: 'Cannot send messages — one of you has blocked the other' });
            return;
        }

        const result = await query(
            `INSERT INTO messages (match_id, sender_id, text, type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, sender_id, text, type, is_read, created_at`,
            [matchId, req.userId, text, type]
        );

        const msg = result.rows[0];
        res.status(201).json({
            id: msg.id,
            senderId: msg.sender_id,
            text: msg.text,
            type: msg.type,
            read: msg.is_read,
            timestamp: msg.created_at,
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
