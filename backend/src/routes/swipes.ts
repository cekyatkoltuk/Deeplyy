import { Router, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { premiumMiddleware } from '../middleware/premium';

const router = Router();

// GET /api/swipes/cards — get profiles to swipe on
router.get('/cards', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Get profiles the user hasn't swiped on yet, excluding themselves
        const result = await query(
            `SELECT u.id, u.name, u.age, u.bio, u.gender, u.location, u.photos,
              u.interests, u.is_premium, u.is_online
       FROM users u
       WHERE u.id != $1
         AND u.id NOT IN (SELECT swiped_id FROM swipes WHERE swiper_id = $1)
       ORDER BY RANDOM()
       LIMIT 20`,
            [req.userId]
        );

        const cards = result.rows.map((user) => ({
            id: user.id,
            name: user.name,
            age: user.age,
            bio: user.bio,
            gender: user.gender,
            location: user.location,
            photos: user.photos,
            interests: user.interests,
            isPremium: user.is_premium,
            isOnline: user.is_online,
            distance: Math.floor(Math.random() * 20) + 1, // placeholder distance
        }));

        res.json(cards);
    } catch (error) {
        console.error('Get cards error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/swipes/like
router.post('/like', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId: targetUserId } = req.body;
        if (!targetUserId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }

        // Record the swipe
        await query(
            `INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES ($1, $2, 'like')
       ON CONFLICT (swiper_id, swiped_id) DO UPDATE SET direction = 'like', created_at = NOW()`,
            [req.userId, targetUserId]
        );

        // Check if they also liked us → MATCH!
        const mutualLike = await query(
            `SELECT id FROM swipes WHERE swiper_id = $1 AND swiped_id = $2 AND direction = 'like'`,
            [targetUserId, req.userId]
        );

        let matched = false;
        let matchId = null;

        if (mutualLike.rows.length > 0) {
            // Create match (sort IDs to avoid duplicates)
            const [user1, user2] = [req.userId!, targetUserId].sort();
            const matchResult = await query(
                `INSERT INTO matches (user1_id, user2_id) VALUES ($1, $2)
         ON CONFLICT (user1_id, user2_id) DO NOTHING RETURNING id`,
                [user1, user2]
            );

            if (matchResult.rows.length > 0) {
                matchId = matchResult.rows[0].id;
                matched = true;
            }
        }

        // Get target user info if matched
        let matchedUser = null;
        if (matched) {
            const userResult = await query(
                'SELECT id, name, age, photos, is_online FROM users WHERE id = $1',
                [targetUserId]
            );
            if (userResult.rows.length > 0) {
                const u = userResult.rows[0];
                matchedUser = {
                    id: u.id,
                    name: u.name,
                    age: u.age,
                    photos: u.photos,
                    isOnline: u.is_online,
                };
            }
        }

        res.json({ matched, matchId, matchedUser });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/swipes/pass
router.post('/pass', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { userId: targetUserId } = req.body;
        if (!targetUserId) {
            res.status(400).json({ error: 'userId is required' });
            return;
        }

        await query(
            `INSERT INTO swipes (swiper_id, swiped_id, direction) VALUES ($1, $2, 'pass')
       ON CONFLICT (swiper_id, swiped_id) DO UPDATE SET direction = 'pass', created_at = NOW()`,
            [req.userId, targetUserId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Pass error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/swipes/rewind (premium only)
router.post('/rewind', authMiddleware, premiumMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Delete the most recent swipe
        const result = await query(
            `DELETE FROM swipes WHERE id = (
        SELECT id FROM swipes WHERE swiper_id = $1 ORDER BY created_at DESC LIMIT 1
      ) RETURNING swiped_id, direction`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            res.status(400).json({ error: 'No swipes to rewind' });
            return;
        }

        // If it was a like that created a match, remove the match too
        const swiped = result.rows[0];
        if (swiped.direction === 'like') {
            const [user1, user2] = [req.userId!, swiped.swiped_id].sort();
            await query('DELETE FROM matches WHERE user1_id = $1 AND user2_id = $2', [user1, user2]);
        }

        res.json({ success: true, rewoundUserId: swiped.swiped_id });
    } catch (error) {
        console.error('Rewind error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/swipes/reset (premium only) — reset all passes
router.post('/reset', authMiddleware, premiumMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await query(
            `DELETE FROM swipes WHERE swiper_id = $1 AND direction = 'pass'`,
            [req.userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Reset dislikes error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
