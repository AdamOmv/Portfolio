import dotenv from 'dotenv';
import pool from '../database/connection.js';
import { AdminUser } from '../models/AdminUser.js';

dotenv.config();

async function run() {
  const [, , username, email, password] = process.argv;

  if (!username || !email || !password) {
    console.error('Usage: npm run create-admin -- <username> <email> <password>');
    process.exit(1);
  }

  const existing = await AdminUser.findByUsername(username);
  if (existing) {
    console.error('An admin with this username or email already exists.');
    process.exit(1);
  }

  const id = await AdminUser.createInitial(username, email, password);
  console.log(`Admin user created with id ${id}`);
  await pool.end();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
