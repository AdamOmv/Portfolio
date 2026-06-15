import pool from '../database/connection.js';

export const ContactMessage = {
  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email, data.subject || null, data.message, data.ip || null]
    );
    return { id: result.insertId };
  },

  async findAll({ unread } = {}) {
    let sql = `SELECT * FROM contact_messages`;
    if (unread) sql += ` WHERE is_read = 0`;
    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.query(sql);
    return rows.map(r => ({ ...r, is_read: Boolean(r.is_read) }));
  },

  async markRead(id) {
    await pool.query(`UPDATE contact_messages SET is_read = 1 WHERE id = ?`, [id]);
  },

  async delete(id) {
    await pool.query(`DELETE FROM contact_messages WHERE id = ?`, [id]);
  },

  async countUnread() {
    const [rows] = await pool.query(`SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0`);
    return rows[0].count;
  },
};
