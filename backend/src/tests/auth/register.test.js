import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { findUserByEmail } from "../../services/auth.service.js";

describe("User Registration", () => {
  test("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hiren",
        email: "hiren@example.com",
        password: "Password123",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message");
  });

  test("should ignore role and register public users with user role", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Admin User",
        email: "admin@example.com",
        password: "Password123",
        role: "admin",
      });

    const user = await findUserByEmail("admin@example.com");

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "User registered successfully",
    });
    expect(user.role).toBe("user");
  });

  test("should return 400 when required fields are missing", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "All fields are required",
    });
  });

  test("should return 409 if email already exists", async () => {
    const user = {
      name: "Hiren",
      email: "hiren@example.com",
      password: "Password123",
    };

    await request(app)
      .post("/api/auth/register")
      .send(user);

    const response = await request(app)
      .post("/api/auth/register")
      .send(user);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      message: "Email already exists",
    });
  });

  test("should return 400 for invalid email format", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hiren",
        email: "invalid-email",
        password: "Password123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid email format",
    });
  });
});
