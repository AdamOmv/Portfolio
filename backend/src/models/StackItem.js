import pool from '../database/connection.js';

export const StackItem = {
  async findAll({ publicOnly = false } = {}) {
    const [rows] = await pool.query(
      `SELECT * FROM stack_items ${publicOnly ? 'WHERE is_active = 1' : ''} ORDER BY sort_order ASC, name ASC`
    );
    return rows.map(parseStackItem);
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM stack_items WHERE id = ?`, [id]);
    return rows[0] ? parseStackItem(rows[0]) : null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO stack_items (name, category, icon_slug, proficiency, is_main, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.category || 'other',
        data.icon_slug || null,
        data.proficiency ?? 80,
        data.is_main ? 1 : 0,
        'is_active' in data ? (data.is_active ? 1 : 0) : 1,
        data.sort_order || 0,
      ]
    );
    return StackItem.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    const allowed = ['name', 'category', 'icon_slug', 'proficiency', 'is_main', 'is_active', 'sort_order'];

    for (const key of allowed) {
      if (key in data) {
        fields.push(`${key} = ?`);
        values.push(key === 'is_main' || key === 'is_active' ? (data[key] ? 1 : 0) : data[key]);
      }
    }

    if (fields.length === 0) return StackItem.findById(id);

    values.push(id);
    await pool.query(`UPDATE stack_items SET ${fields.join(', ')} WHERE id = ?`, values);
    return StackItem.findById(id);
  },

  async delete(id) {
    await pool.query(`DELETE FROM stack_items WHERE id = ?`, [id]);
  },
};

function parseStackItem(row) {
  return {
    ...row,
    is_main: Boolean(row.is_main),
    is_active: 'is_active' in row ? Boolean(row.is_active) : true,
  };
}
