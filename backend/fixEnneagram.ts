import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function run() {
  try {
    await pool.query('ALTER TABLE users ALTER COLUMN enneagram TYPE VARCHAR(10);');
    console.log('Successfully altered enneagram column');
  } catch (err) {
    console.error('Error altering column:', err);
  } finally {
    await pool.end();
  }
}

run();
