import pool from '../database/connection.js';

const PUBLIC_KEYS = [
  'site_title', 'hero_name', 'hero_tagline', 'hero_description',
  'hero_primary_cta', 'hero_secondary_cta',
  'about_text', 'about_specialty', 'about_main_stack', 'about_approach',
  'contact_title', 'contact_text',
  'logo_url', 'favicon_url',
  'github_url', 'linkedin_url', 'twitter_url', 'email_contact', 'cv_url',
  'years_experience', 'footer_text',
];

export const SiteSetting = {
  async findPublic() {
    const placeholders = PUBLIC_KEYS.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT key_name, value, type FROM site_settings WHERE key_name IN (${placeholders})`,
      PUBLIC_KEYS
    );
    return toObject(rows);
  },

  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM site_settings ORDER BY key_name`);
    return rows;
  },

  async batchUpdate(data) {
    const entries = Object.entries(data);
    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO site_settings (key_name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
        [key, value == null ? null : String(value)]
      );
    }
    return SiteSetting.findAll();
  },
};

function toObject(rows) {
  return rows.reduce((acc, row) => {
    let val = row.value;
    if (row.type === 'boolean') val = val === 'true';
    else if (row.type === 'number') val = Number(val);
    else if (row.type === 'json') {
      try {
        val = JSON.parse(val);
      } catch {
        // keep original string value
      }
    }
    acc[row.key_name] = val;
    return acc;
  }, {});
}
