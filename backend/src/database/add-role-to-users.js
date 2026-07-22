import pool from "../config/db.js";

await pool.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
`);

await pool.end();
