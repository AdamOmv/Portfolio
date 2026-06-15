import pool from '../database/connection.js';

export const Project = {
  async findAllPublished() {
    const [rows] = await pool.query(
      `SELECT id, slug, title, subtitle, description, long_description, cover_url, tech_tags, live_url, github_url, status, featured, sort_order, year
       FROM projects WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC`
    );
    return rows.map(parseProject);
  },

  async findFeatured() {
    const [rows] = await pool.query(
      `SELECT id, slug, title, subtitle, description, long_description, cover_url, tech_tags, live_url, github_url, status, featured, sort_order, year
       FROM projects WHERE status = 'published' AND featured = 1 ORDER BY sort_order ASC LIMIT 6`
    );
    return rows.map(parseProject);
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT * FROM projects WHERE slug = ? AND status = 'published'`,
      [slug]
    );
    return rows[0] ? parseProject(rows[0]) : null;
  },

  async findAll() {
    const [rows] = await pool.query(
      `SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`
    );
    return rows.map(parseProject);
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM projects WHERE id = ?`, [id]);
    return rows[0] ? parseProject(rows[0]) : null;
  },

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO projects (slug, title, subtitle, description, long_description, cover_url, images, tech_tags, live_url, github_url, status, featured, sort_order, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.slug, data.title, data.subtitle || null, data.description || null,
        data.long_description || null, data.cover_url || null,
        JSON.stringify(data.images || []), JSON.stringify(data.tech_tags || []),
        data.live_url || null, data.github_url || null,
        data.status || 'draft', data.featured ? 1 : 0,
        data.sort_order || 0, data.year || null,
      ]
    );
    return Project.findById(result.insertId);
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    const allowed = ['slug','title','subtitle','description','long_description','cover_url','live_url','github_url','status','featured','sort_order','year'];
    for (const key of allowed) {
      if (key in data) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
    if ('images' in data) { fields.push('images = ?'); values.push(JSON.stringify(data.images)); }
    if ('tech_tags' in data) { fields.push('tech_tags = ?'); values.push(JSON.stringify(data.tech_tags)); }

    if (fields.length === 0) return Project.findById(id);
    values.push(id);
    await pool.query(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
    return Project.findById(id);
  },

  async delete(id) {
    await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);
  },
};

function parseProject(row) {
  return {
    ...row,
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    tech_tags: typeof row.tech_tags === 'string' ? JSON.parse(row.tech_tags) : (row.tech_tags || []),
    featured: Boolean(row.featured),
  };
}
