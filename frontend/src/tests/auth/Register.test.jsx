import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Register from "../../pages/auth/Register";
import * as authService from "../../services/authService";

describe("Register Page", () => {
  it("validates matching passwords", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/name/i), "Hiren");
    await user.type(screen.getByLabelText(/email/i), "hiren@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Different123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("registers a user and shows success", async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, "registerUser").mockResolvedValue({
      message: "User registered successfully",
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/name/i), "Hiren");
    await user.type(screen.getByLabelText(/email/i), "hiren@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith({
        name: "Hiren",
        email: "hiren@example.com",
        password: "Password123",
      });
    });
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });
});
