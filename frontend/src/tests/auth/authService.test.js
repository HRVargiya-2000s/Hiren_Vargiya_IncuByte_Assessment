import { describe, it, expect } from "vitest";
import MockAdapter from "axios-mock-adapter";

import api from "../../api/axios";
import { loginUser } from "../../services/authService";

describe("Auth Service", () => {
  it("logs in successfully", async () => {
    const mock = new MockAdapter(api);

    mock.onPost("/api/auth/login").reply(200, {
      token: "fake-jwt-token",
      user: {
        id: 1,
        name: "Admin",
        email: "admin@test.com",
      },
    });

    const result = await loginUser({
      email: "admin@test.com",
      password: "password123",
    });

    expect(result.token).toBe("fake-jwt-token");
    expect(result.user.email).toBe("admin@test.com");
  });
});
