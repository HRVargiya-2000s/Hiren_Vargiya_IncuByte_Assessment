import { afterAll, beforeEach } from "vitest";
import pool from "../config/db.js";

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE vehicles, users RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});
