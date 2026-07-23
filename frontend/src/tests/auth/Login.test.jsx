import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import Login from "../../pages/auth/Login";
import * as authService from "../../services/authService";

describe("Login Page", () => {
  it("renders Login heading", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("renders Email input", () => {
    render(<Login />);

    expect(
      screen.getByLabelText(/email/i)
    ).toBeInTheDocument();
  });

  it("renders Password input", () => {
    render(<Login />);

    expect(
      screen.getByLabelText(/password/i)
    ).toBeInTheDocument();
  });

  it("renders Login button", () => {
    render(<Login />);

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
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

  it("calls loginUser with email and password on submit", async () => {
    const user = userEvent.setup();

    const loginSpy = vi
      .spyOn(authService, "loginUser")
      .mockResolvedValue({
        token: "fake-token",
        user: {
          id: 1,
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
});