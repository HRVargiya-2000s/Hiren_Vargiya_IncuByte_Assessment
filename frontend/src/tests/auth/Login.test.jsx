import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import Login from "../../pages/auth/Login";
import MockAdapter from "axios-mock-adapter";
import api from "../../api/axios";
import { loginUser } from "../../services/authService";

import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import Login from "../../pages/auth/Login";
import * as authService from "../../services/auth.service";

describe("Login Page", () => {
  it("renders Login heading", () => {
    render(<Login />);

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders Email input", () => {
    render(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("renders Password input", () => {
    render(<Login />);

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});

it("renders Login button", () => {
  render(<Login />);

  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

it("updates email input when user types", async () => {
  const user = userEvent.setup();

  render(<Login />);

  const emailInput = screen.getByLabelText(/email/i);

  await user.type(emailInput, "admin@test.com");

  expect(emailInput).toHaveValue("admin@test.com");
});

it("updates password input when user types", async () => {
  const user = userEvent.setup();

  render(<Login />);

  const passwordInput = screen.getByLabelText(/password/i);

  await user.type(passwordInput, "password123");

  expect(passwordInput).toHaveValue("password123");
});

describe("Auth Service", () => {
  it("logs in successfully", async () => {
    const mock = new MockAdapter(api);

    mock.onPost("/auth/login").reply(200, {
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

it("calls loginUser with email and password on submit", async () => {
  const user = userEvent.setup();

  const loginSpy = vi
    .spyOn(authService, "loginUser")
    .mockResolvedValue({
      token: "fake-jwt-token",
      user: {
        id: 1,
        name: "Admin",
        email: "admin@test.com",
      },
    });

  render(<Login />);

  await user.type(
    screen.getByLabelText(/email/i),
    "admin@test.com"
  );

  await user.type(
    screen.getByLabelText(/password/i),
    "password123"
  );

  await user.click(
    screen.getByRole("button", { name: /login/i })
  );

  expect(loginSpy).toHaveBeenCalledWith({
    email: "admin@test.com",
    password: "password123",
  });
});
Expected Result

Run:

npx vitest

Expected:

❌ calls loginUser with email and password on submit

Perfect! That's our RED.

🟢 GREEN

Update your Login.jsx:

import { useState } from "react";
import { loginUser } from "../../services/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await loginUser({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}