import { describe, test, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Health Check API", () => {
  test("GET / should return API running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      message: "Car Dealership Inventory API is running 🚗",
    });
  });
});