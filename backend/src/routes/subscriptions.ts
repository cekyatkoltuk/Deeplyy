import { Router, Response } from 'express';
import { query } from '../config/database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/subscriptions/status
router.get('/status', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const result = await query(
            `SELECT u.is_premium, u.premium_expires_at,
              s.plan, s.starts_at, s.expires_at, s.is_active
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id AND s.is_active = TRUE
       WHERE u.id = $1`,
            [req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const row = result.rows[0];
        res.json({
            isPremium: row.is_premium,
            plan: row.plan || null,
            startsAt: row.starts_at || null,
            expiresAt: row.premium_expires_at || row.expires_at || null,
            isActive: row.is_active || false,
        });
    } catch (error) {
        console.error('Get subscription status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/subscriptions/subscribe
router.post('/subscribe', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { plan } = req.body;

        if (!plan || !['monthly', 'yearly'].includes(plan)) {
            res.status(400).json({ error: 'Plan must be "monthly" or "yearly"' });
            return;
        }

        const durationDays = plan === 'monthly' ? 30 : 365;
        const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

        // Deactivate existing subscriptions
        await query(
            'UPDATE subscriptions SET is_active = FALSE WHERE user_id = $1',
            [req.userId]
        );

        // Create new subscription
        await query(
            `INSERT INTO subscriptions (user_id, plan, expires_at)
       VALUES ($1, $2, $3)`,
            [req.userId, plan, expiresAt]
        );

        // Update user premium status
        await query(
            'UPDATE users SET is_premium = TRUE, premium_expires_at = $1 WHERE id = $2',
            [expiresAt, req.userId]
        );

        res.json({
            isPremium: true,
            plan,
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/subscriptions/cancel
router.post('/cancel', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await query(
            'UPDATE subscriptions SET is_active = FALSE WHERE user_id = $1',
            [req.userId]
        );

        await query(
            'UPDATE users SET is_premium = FALSE, premium_expires_at = NULL WHERE id = $1',
            [req.userId]
        );

        res.json({ isPremium: false, plan: null });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
