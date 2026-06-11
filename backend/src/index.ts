import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { pool, query } from './config/database';
import { setupChatSocket } from './socket/chatSocket';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import swipeRoutes from './routes/swipes';
import matchRoutes from './routes/matches';
import chatRoutes from './routes/chat';
import subscriptionRoutes from './routes/subscriptions';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swipes', swipeRoutes(io));
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes(io));
app.use('/api/subscriptions', subscriptionRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io
setupChatSocket(io);

// Initialize database and start server
const PORT = parseInt(process.env.PORT || '3000');

const initDatabase = async () => {
    try {
        // Create database if not exists
        const tempPool = new (require('pg').Pool)({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || '123Password',
            database: 'postgres',
        });

        try {
            await tempPool.query(`CREATE DATABASE deeplyy_dating`);
            console.log('Database "deeplyy_dating" created');
        } catch (err: any) {
            if (err.code === '42P04') {
                console.log('Database "deeplyy_dating" already exists');
            } else {
                throw err;
            }
        }
        await tempPool.end();

        // Run schema
        const schemaPath = path.resolve(__dirname, '../sql/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await query(schema);
        console.log('Database schema applied');

        // Run seed (reloads seed data on startup, updating interests/bios)
        const seedPath = path.resolve(__dirname, '../sql/seed.sql');
        const seed = fs.readFileSync(seedPath, 'utf-8');
        await query(seed);
        console.log('Seed data loaded successfully');

    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
};

initDatabase().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`\nDeeplyy Dating API Server`);
        console.log(`   ├── REST:   http://localhost:${PORT}/api`);
        console.log(`   ├── Socket: http://localhost:${PORT}`);
        console.log(`   └── Health: http://localhost:${PORT}/api/health\n`);
    });
});

export { app, httpServer, io };
