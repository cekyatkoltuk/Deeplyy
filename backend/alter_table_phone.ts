import { query } from './src/config/database';

async function run() {
    try {
        await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20) UNIQUE');
        console.log('Added phone_number column successfully.');
    } catch (e) {
        console.error('Error altering table:', e);
    } finally {
        process.exit(0);
    }
}
run();
