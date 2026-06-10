import { query } from './src/config/database';

async function run() {
    try {
        await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS mbti VARCHAR(4)');
        await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS enneagram VARCHAR(4)');
        console.log('Added mbti and enneagram columns successfully.');
    } catch (e) {
        console.error('Error altering table:', e);
    } finally {
        process.exit(0);
    }
}
run();
