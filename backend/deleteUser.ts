import { query } from './src/config/database';

async function run() {
    try {
        await query('DELETE FROM users WHERE email = $1', ['aytugdogan@outlook.com.tr'.toLowerCase()]);
        console.log('User deleted successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}

run();
