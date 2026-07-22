import pool from "./config/db.js";

try {
  const result = await pool.query("SELECT NOW()");
  console.log("✅ PostgreSQL Connected");
  console.log(result.rows[0]);
} catch (err) {
  console.error("❌ Connection Failed");
  console.error(err.message);
} finally {
  await pool.end();
}