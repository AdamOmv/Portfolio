import dotenv from 'dotenv';
import pool from '../database/connection.js';
import { AdminUser } from '../models/AdminUser.js';

dotenv.config();

async function run() {
  const username = process.env.ADMIN_USERNAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !email || !password) {
    console.log('ADMIN_* variables not set. Skipping admin bootstrap.');
    await pool.end();
    return;
  }

  const existing = await AdminUser.findByUsername(username);
  if (existing) {
    console.log(`Admin user "${username}" already exists.`);
    await pool.end();
    return;
  }

  const id = await AdminUser.createInitial(username, email, password);
  console.log(`Admin user created with id ${id}.`);
  await pool.end();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

