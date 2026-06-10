import { query } from './src/config/database';

async function run() {
    try {
        const email = 'I2.personal@proton.me';
        // Delete related profile first (assuming ON DELETE CASCADE might not be set up)
        // Wait, actually, let's check what tables exist or just try deleting user.
        // Usually deleting the user is enough if ON DELETE CASCADE is set.
        const userRes = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (userRes.rows.length > 0) {
            const userId = userRes.rows[0].id;
            console.log(`Found user with ID: ${userId}`);
            
            // Delete from profiles
            await query('DELETE FROM profiles WHERE user_id = $1', [userId]).catch(() => console.log('No profile to delete'));
            
            // Delete from photos
            await query('DELETE FROM photos WHERE user_id = $1', [userId]).catch(() => console.log('No photos to delete'));
            
            // Delete from users
            const res = await query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            console.log('Deleted user:', res.rows);
        } else {
            console.log('User not found.');
        }
    } catch (e) {
        console.error('Error deleting user:', e);
    } finally {
        process.exit(0);
    }
}
run();
