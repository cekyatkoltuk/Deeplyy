import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { query } from '../config/database';

export const premiumMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await query(
            'SELECT is_premium, premium_expires_at FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = result.rows[0];

        // Check if premium has expired
        if (user.is_premium && user.premium_expires_at) {
            const now = new Date();
            const expires = new Date(user.premium_expires_at);
            if (now > expires) {
                await query(
                    'UPDATE users SET is_premium = FALSE, premium_expires_at = NULL WHERE id = $1',
                    [req.userId]
                );
                res.status(403).json({ error: 'You must be a premium user to access this feature.' });
                return;
            }
        }

        if (!user.is_premium) {
            res.status(403).json({ error: 'You must be a premium user to access this feature.' });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Server error checking premium status' });
    }
};
