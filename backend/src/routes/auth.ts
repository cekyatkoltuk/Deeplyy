import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { hashPassword, comparePassword, generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/helpers';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, age, gender } = req.body;

        if (!email || !password || !name || !age || !gender) {
            res.status(400).json({ error: 'All fields are required: email, password, name, age, gender' });
            return;
        }

        // Check if user exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existing.rows.length > 0) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password);
        const result = await query(
            `INSERT INTO users (email, password_hash, name, age, gender)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, age, bio, gender, location, photos, interests, is_premium, is_online`,
            [email.toLowerCase(), passwordHash, name, age, gender]
        );

        const user = result.rows[0];
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Set user online
        await query('UPDATE users SET is_online = TRUE WHERE id = $1', [user.id]);

        res.status(201).json({
            token,
            refreshToken,
            user: {
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
                isOnline: true,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await query(
            'SELECT id, email, password_hash, name, age, bio, gender, location, photos, interests, is_premium, is_online FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const user = result.rows[0];
        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Set user online
        await query('UPDATE users SET is_online = TRUE WHERE id = $1', [user.id]);

        res.json({
            token,
            refreshToken,
            user: {
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
                isOnline: true,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token required' });
            return;
        }

        const decoded = verifyRefreshToken(refreshToken);
        const newToken = generateToken(decoded.userId);
        const newRefreshToken = generateRefreshToken(decoded.userId);

        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

export default router;
