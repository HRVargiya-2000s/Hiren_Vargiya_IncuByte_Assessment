import pool from "../config/db.js";

export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email.trim()]
  );

  return result.rows[0];
}

export async function createUser(
  name,
  email,
  password,
  role = "user"
) {
  const result = await pool.query(
    `
    INSERT INTO users
      (name, email, password, role)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      id,
      name,
      email,
      role
    `,
    [name.trim(), email.trim().toLowerCase(), password, role]
  );

  return result.rows[0];
}

export async function getAllUsers() {
  const result = await pool.query(
    "SELECT id, name, email, role FROM users ORDER BY name ASC"
  );
  return result.rows;
}

export async function updateUserRole(id, role) {
  const result = await pool.query(
    `
    UPDATE users
    SET role = $1
    WHERE id = $2
    RETURNING id, name, email, role
    `,
    [role, id]
  );
  return result.rows[0];
}
