import { describe, expect, test } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import app from "../../app.js";
import { createUser } from "../../services/auth.service.js";

async function getAuthToken(role = "user") {
  const user = {
    name: "Hiren",
    email: `${role}@example.com`,
    password: "Password123",
    role,
  };

  if (role === "admin") {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await createUser(
      user.name,
      user.email,
      hashedPassword,
      role
    );
  } else {
    await request(app).post("/api/auth/register").send(user);
  }

  const login = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  return login.body.token;
}

async function createVehicle(token, overrides = {}) {
  const response = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${token}`)
    .send({
      make: "Toyota",
      model: "Fortuner",
      category: "SUV",
      price: 4500000,
      quantity: 5,
      ...overrides,
    });

  return response.body;
}

describe("Vehicle API", () => {
  test("should return all vehicles", async () => {
    const token = await getAuthToken();
    await createVehicle(token);

    const response = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].make).toBe("Toyota");
  });

  test("should search vehicles by make or model", async () => {
    const token = await getAuthToken();
    await createVehicle(token, { make: "Toyota", model: "Fortuner" });
    await createVehicle(token, { make: "Honda", model: "City", category: "Sedan" });

    const response = await request(app)
      .get("/api/vehicles/search?q=city")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].make).toBe("Honda");
    expect(response.body[0].model).toBe("City");
  });

  test("should update a vehicle", async () => {
    const token = await getAuthToken();
    const vehicle = await createVehicle(token);

    const response = await request(app)
      .put(`/api/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Mahindra",
        model: "Scorpio",
        category: "SUV",
        price: 2200000,
        quantity: 3,
      });

    expect(response.status).toBe(200);
    expect(response.body.make).toBe("Mahindra");
    expect(response.body.quantity).toBe(3);
  });

  test("should delete a vehicle", async () => {
    const token = await getAuthToken("admin");
    const vehicle = await createVehicle(token);

    const response = await request(app)
      .delete(`/api/vehicles/${vehicle.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);

    const vehicles = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(vehicles.body).toHaveLength(0);
  });

  test("should decrease quantity by one when purchasing a vehicle", async () => {
    const token = await getAuthToken();
    const vehicle = await createVehicle(token, { quantity: 2 });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(1);
  });

  test("should return an error when purchasing a vehicle with zero quantity", async () => {
    const token = await getAuthToken();
    const vehicle = await createVehicle(token, { quantity: 0 });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Vehicle quantity is 0",
    });
  });

  test("should increase quantity when restocking a vehicle", async () => {
    const token = await getAuthToken("admin");
    const vehicle = await createVehicle(token, { quantity: 2 });

    const response = await request(app)
      .post(`/api/vehicles/${vehicle.id}/restock`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        quantity: 4,
      });

    expect(response.status).toBe(200);
    expect(response.body.quantity).toBe(6);
  });
});
