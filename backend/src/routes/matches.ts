import { Router, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/matches — get all matches
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT m.id as match_id, m.created_at as matched_at,
              u.id, u.name, u.age, u.bio, u.photos, u.interests, u.location,
              u.is_premium, u.is_online,
              (SELECT text FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT COUNT(*) FROM messages WHERE match_id = m.id AND sender_id != $1 AND is_read = FALSE)::int as unread_count
       FROM matches m
       JOIN users u ON (CASE WHEN m.user1_id = $1 THEN m.user2_id ELSE m.user1_id END) = u.id
       WHERE m.user1_id = $1 OR m.user2_id = $1
       ORDER BY m.created_at DESC`,
            [req.userId]
        );

        const matches = result.rows.map((row) => ({
            id: row.match_id,
            matchedAt: row.matched_at,
            lastMessage: row.last_message,
            unreadCount: row.unread_count,
            isNew: (new Date().getTime() - new Date(row.matched_at).getTime()) < 24 * 60 * 60 * 1000,
            user: {
                id: row.id,
                name: row.name,
                age: row.age,
                bio: row.bio,
                photos: row.photos,
                interests: row.interests,
                location: row.location,
                isPremium: row.is_premium,
                isOnline: row.is_online,
                distance: Math.floor(Math.random() * 15) + 1,
            },
        }));

        res.json(matches);
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/matches/likes — get users who liked me
router.get('/likes', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT u.id, u.name, u.age, u.bio, u.photos, u.interests, u.location,
              u.gender, u.is_premium, u.is_online, u.mbti, u.enneagram, u.looking_for
       FROM swipes s
       JOIN users u ON s.swiper_id = u.id
       WHERE s.swiped_id = $1 AND s.direction = 'like'
         AND s.swiper_id NOT IN (
           SELECT swiped_id FROM swipes WHERE swiper_id = $1 AND direction = 'like'
         )
       ORDER BY s.created_at DESC`,
            [req.userId]
        );

        const likes = result.rows.map((user) => ({
            id: user.id,
            name: user.name,
            age: user.age,
            bio: user.bio,
            photos: user.photos,
            interests: user.interests,
            location: user.location,
            gender: user.gender,
            mbti: user.mbti,
            enneagram: user.enneagram,
            lookingFor: user.looking_for,
            isPremium: user.is_premium,
            isOnline: user.is_online,
            distance: Math.floor(Math.random() * 15) + 1,
        }));

        res.json(likes);
    } catch (error) {
        console.error('Get likes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
