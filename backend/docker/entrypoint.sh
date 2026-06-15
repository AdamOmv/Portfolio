#!/bin/sh
set -eu

echo "Waiting for MySQL on ${DB_HOST}:${DB_PORT}..."
until node --input-type=module -e "import mysql from 'mysql2/promise'; const conn = await mysql.createConnection({host: process.env.DB_HOST, port: Number(process.env.DB_PORT), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME}); await conn.end();"; do
  sleep 2
done

echo "Running migrations..."
npm run migrate

if [ -n "${ADMIN_USERNAME:-}" ] && [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  echo "Ensuring admin user exists..."
  node src/scripts/ensureAdmin.js
fi

echo "Starting API..."
exec npm start

