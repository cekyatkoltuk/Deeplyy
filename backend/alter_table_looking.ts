import { query } from './src/config/database';

async function run() {
    try {
        await query('ALTER TABLE users ADD COLUMN IF NOT EXISTS looking_for VARCHAR(20)');
        console.log('Added looking_for column successfully.');
    } catch (e) {
        console.error('Error altering table:', e);
    } finally {
        process.exit(0);
    }
}
run();
