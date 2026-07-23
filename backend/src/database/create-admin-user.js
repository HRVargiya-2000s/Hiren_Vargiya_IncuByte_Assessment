import bcrypt from "bcrypt";
import pool from "../config/db.js";

const name = process.env.ADMIN_NAME || "Admin User";
const email = process.env.ADMIN_EMAIL || "admin@example.com";
const password = process.env.ADMIN_PASSWORD || "Password123";

const hashedPassword = await bcrypt.hash(password, 10);

await pool.query(
  `
  INSERT INTO users
    (name, email, password, role)
  VALUES
    ($1, $2, $3, 'admin')
  ON CONFLICT (email)
  DO UPDATE SET
    name = EXCLUDED.name,
    password = EXCLUDED.password,
    role = 'admin'
  `,
  [name.trim(), email.trim().toLowerCase(), hashedPassword]
);

console.log(`Admin user ready: ${email.trim().toLowerCase()}`);

await pool.end();
