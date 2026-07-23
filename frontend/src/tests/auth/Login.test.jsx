import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Login from "../../pages/auth/Login";

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
});

it("renders Login button", () => {
  render(<Login />);

  expect(
    screen.getByRole("button", { name: /login/i })
  ).toBeInTheDocument();
});