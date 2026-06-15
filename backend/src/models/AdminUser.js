import pool from '../database/connection.js';
import bcrypt from 'bcryptjs';

export const AdminUser = {
  async findByUsername(username) {
    const [rows] = await pool.query(
      `SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1`,
      [username, username]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT id, username, email, created_at FROM admin_users WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async updatePassword(id, newPassword) {
    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query(`UPDATE admin_users SET password = ? WHERE id = ?`, [hash, id]);
  },

  async verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
  },

  async createInitial(username, email, password) {
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      `INSERT INTO admin_users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hash]
    );
    return result.insertId;
  },
};
