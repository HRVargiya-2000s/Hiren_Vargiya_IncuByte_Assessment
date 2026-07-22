import { describe, test, expect } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import app from "../../app.js";
import { createUser } from "../../services/auth.service.js";

describe("User Login", () => {
  test("should login successfully", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hiren",
        email: "hiren@example.com",
        password: "Password123",
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "hiren@example.com",
        password: "Password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("should include user role in JWT", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    await createUser(
      "Admin User",
      "admin@example.com",
      hashedPassword,
      "admin"
    );

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "Password123",
      });

    const decodedToken = jwt.verify(
      response.body.token,
      process.env.JWT_SECRET
    );

    expect(response.status).toBe(200);
    expect(decodedToken.role).toBe("admin");
  });
});
