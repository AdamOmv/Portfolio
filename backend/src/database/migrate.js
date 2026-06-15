import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'portfolio_user',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_adomv',
    multipleStatements: true,
  });

  // Create migrations tracking table if it doesn't exist
  await conn.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const files = [
    '001_initial_schema.sql',
    '002_seed_data.sql',
    '003_stack_activation_and_content.sql',
    '004_branding_settings.sql',
  ];

  // Get already applied migrations
  const [rows] = await conn.query('SELECT filename FROM _migrations');
  const applied = new Set(rows.map(r => r.filename));

  // If tracking table is empty but DB already exists (previous install without tracking),
  // mark all existing migrations as applied to avoid replaying seed data
  if (applied.size === 0) {
    const [tables] = await conn.query(
      `SELECT COUNT(*) as cnt FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name = 'site_settings'`
    );
    if (tables[0].cnt > 0) {
      console.log('Existing DB detected without migration tracking — marking all migrations as applied.');
      for (const file of files) {
        await conn.query('INSERT IGNORE INTO _migrations (filename) VALUES (?)', [file]);
        applied.add(file);
      }
    }
  }

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping migration (already applied): ${file}`);
      continue;
    }
    const filePath = resolve(__dirname, 'migrations', file);
    const sql = readFileSync(filePath, 'utf8');
    console.log(`Running migration: ${file}`);
    await conn.query(sql);
    await conn.query('INSERT INTO _migrations (filename) VALUES (?)', [file]);
    console.log(`✓ ${file} done`);
  }

  await conn.end();
  console.log('All migrations completed.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
