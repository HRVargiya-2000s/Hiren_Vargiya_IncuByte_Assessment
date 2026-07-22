import { describe, expect, test } from "vitest";
import request from "supertest";
import app from "../../app.js";

async function getAuthToken() {
  const user = {
    name: "Hiren",
    email: "hiren@example.com",
    password: "Password123",
  };

  await request(app).post("/api/auth/register").send(user);

  const login = await request(app).post("/api/auth/login").send({
    email: user.email,
    password: user.password,
  });

  return login.body.token;
}

describe("Create Vehicle", () => {
  test("should create vehicle successfully", async () => {
    const token = await getAuthToken();

    const response = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        make: "Toyota",
        model: "Fortuner",
        category: "SUV",
        price: 4500000,
        quantity: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body.make).toBe("Toyota");
    expect(response.body.category).toBe("SUV");
    expect(response.body.quantity).toBe(5);
  });
});
