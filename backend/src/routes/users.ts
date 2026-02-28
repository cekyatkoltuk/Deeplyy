import { Router, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT id, email, name, age, bio, gender, location, photos, interests,
              is_premium, is_online, created_at
       FROM users WHERE id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            age: user.age,
            bio: user.bio,
            gender: user.gender,
            location: user.location,
            photos: user.photos,
            interests: user.interests,
            isPremium: user.is_premium,
            isOnline: user.is_online,
            distance: 0,
            createdAt: user.created_at,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users/profile/:userId — view another user's public profile
router.get('/profile/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.userId as string;
        const result = await query(
            `SELECT id, name, age, bio, gender, location, photos, interests,
              is_premium, is_online
       FROM users WHERE id = $1`,
            [targetId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];
        res.json({
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
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, age, bio, gender, location, interests, photos } = req.body;

        const result = await query(
            `UPDATE users SET
        name = COALESCE($1, name),
        age = COALESCE($2, age),
        bio = COALESCE($3, bio),
        gender = COALESCE($4, gender),
        location = COALESCE($5, location),
        interests = COALESCE($6, interests),
        photos = COALESCE($7, photos),
        updated_at = NOW()
       WHERE id = $8
       RETURNING id, email, name, age, bio, gender, location, photos, interests, is_premium, is_online`,
            [name, age, bio, gender, location, interests, photos, req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            age: user.age,
            bio: user.bio,
            gender: user.gender,
            location: user.location,
            photos: user.photos,
            interests: user.interests,
            isPremium: user.is_premium,
            isOnline: user.is_online,
            distance: 0,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/users/photos
router.post('/photos', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { photoUrl } = req.body;
        if (!photoUrl) {
            res.status(400).json({ error: 'photoUrl is required' });
            return;
        }

        const result = await query(
            `UPDATE users SET photos = array_append(photos, $1), updated_at = NOW()
       WHERE id = $2 RETURNING photos`,
            [photoUrl, req.userId]
        );

        res.json({ photos: result.rows[0].photos });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/users/photos/:index
router.delete('/photos/:index', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const index = parseInt(req.params.index as string);
        const userResult = await query('SELECT photos FROM users WHERE id = $1', [req.userId]);

        if (userResult.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const photos = userResult.rows[0].photos;
        if (index < 0 || index >= photos.length) {
            res.status(400).json({ error: 'Invalid photo index' });
            return;
        }

        photos.splice(index, 1);
        await query(
            'UPDATE users SET photos = $1, updated_at = NOW() WHERE id = $2',
            [photos, req.userId]
        );

        res.json({ photos });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/users/block/:userId
router.post('/block/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.userId as string;
        // Record a "block" swipe so they never see each other again
        // We do NOT delete the match — this preserves message history
        await query(
            `INSERT INTO swipes (swiper_id, swiped_id, direction)
             VALUES ($1, $2, 'block')
             ON CONFLICT (swiper_id, swiped_id) DO UPDATE SET direction = 'block'`,
            [req.userId, targetId]
        );
        res.json({ success: true, message: 'User blocked' });
    } catch (error) {
        console.error('Block user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/users/report/:userId
router.post('/report/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.userId as string;
        const { reason } = req.body;
        await query(
            `INSERT INTO reports (reporter_id, reported_id, reason)
             VALUES ($1, $2, $3)`,
            [req.userId, targetId, reason || '']
        );
        res.json({ success: true, message: 'Report submitted. Thank you.' });
    } catch (error) {
        console.error('Report user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users/blocked — list blocked users
router.get('/blocked', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT u.id, u.name, u.photos, u.age
             FROM swipes s
             JOIN users u ON u.id = s.swiped_id
             WHERE s.swiper_id = $1 AND s.direction = 'block'
             ORDER BY s.created_at DESC`,
            [req.userId]
        );
        res.json(result.rows.map((u: any) => ({
            id: u.id,
            name: u.name,
            age: u.age,
            photos: u.photos,
        })));
    } catch (error) {
        console.error('Get blocked users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/users/block/:userId — unblock a user
router.delete('/block/:userId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const targetId = req.params.userId as string;
        await query(
            `DELETE FROM swipes WHERE swiper_id = $1 AND swiped_id = $2 AND direction = 'block'`,
            [req.userId, targetId]
        );
        res.json({ success: true, message: 'User unblocked' });
    } catch (error) {
        console.error('Unblock user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
