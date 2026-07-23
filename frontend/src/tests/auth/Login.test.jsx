import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../../pages/auth/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
