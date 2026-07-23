import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Dashboard from "../../pages/admin/Dashboard";
import * as vehicleService from "../../services/vehicleService";

describe("Dashboard", () => {
  it("shows inventory stats and recent inventory", async () => {
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue([
      { id: 1, make: "Toyota", model: "Camry", category: "Sedan", year: 2024, price: 10000, quantity: 2 },
      { id: 2, make: "Honda", model: "Civic", category: "Sedan", year: 2023, price: 12000, quantity: 3 },
    ]);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/total vehicles/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/total vehicles value/i)).toHaveTextContent("2");
    expect(screen.getByLabelText(/total stock value/i)).toHaveTextContent("5");
    expect(screen.getByLabelText(/available stock value/i)).toHaveTextContent("5");
    expect(screen.getByLabelText(/out of stock value/i)).toHaveTextContent("0");
    expect(screen.getByLabelText(/low stock value/i)).toHaveTextContent("1");
    expect(screen.getByLabelText(/inventory value value/i)).toHaveTextContent("$56,000");
    expect(screen.getByText(/quick actions/i)).toBeInTheDocument();
    expect(screen.getByText(/recent activity/i)).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();
  });
});
