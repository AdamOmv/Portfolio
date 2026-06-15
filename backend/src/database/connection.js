import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'portfolio_user',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_adomv',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log('✓ MySQL connected');
  } catch (err) {
    console.error('✗ MySQL connection failed:', err.message);
    process.exit(1);
  }
}

export default pool;
