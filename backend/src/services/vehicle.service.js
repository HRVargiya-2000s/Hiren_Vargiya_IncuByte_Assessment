import pool from "../config/db.js";

export async function createVehicle(vehicle) {
  const { make, model, category, price, quantity } = vehicle;

  const result = await pool.query(
    `INSERT INTO vehicles
     (make, model, category, price, quantity)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [make, model, category, price, quantity]
  );

  return result.rows[0];
}

export async function getAllVehicles() {
  const result = await pool.query(
    "SELECT * FROM vehicles ORDER BY id"
  );

  return result.rows;
}

export async function searchVehicles(searchTerm) {
  const result = await pool.query(
    `SELECT *
     FROM vehicles
     WHERE make ILIKE $1
        OR model ILIKE $1
        OR category ILIKE $1
     ORDER BY id`,
    [`%${searchTerm}%`]
  );

  return result.rows;
}

export async function findVehicleById(id) {
  const result = await pool.query(
    "SELECT * FROM vehicles WHERE id=$1",
    [id]
  );

  return result.rows[0];
}

export async function updateVehicle(id, vehicle) {
  const { make, model, category, price, quantity } = vehicle;

  const result = await pool.query(
    `UPDATE vehicles
     SET make=$1,
         model=$2,
         category=$3,
         price=$4,
         quantity=$5
     WHERE id=$6
     RETURNING *`,
    [make, model, category, price, quantity, id]
  );

  return result.rows[0];
}

export async function deleteVehicle(id) {
  const result = await pool.query(
    "DELETE FROM vehicles WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
}

export async function purchaseVehicle(id) {
  const result = await pool.query(
    `UPDATE vehicles
     SET quantity = quantity - 1
     WHERE id=$1
       AND quantity > 0
     RETURNING *`,
    [id]
  );

  return result.rows[0];
}

export async function restockVehicle(id, quantity) {
  const result = await pool.query(
    `UPDATE vehicles
     SET quantity = quantity + $1
     WHERE id=$2
     RETURNING *`,
    [quantity, id]
  );

  return result.rows[0];
}
