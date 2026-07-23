import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import VehicleDetails from "../../pages/user/VehicleDetails";
import * as vehicleService from "../../services/vehicleService";

const vehicles = [
  { id: 1, make: "Honda", model: "City", category: "Sedan", year: 2023, price: 1325000, quantity: 2 },
  { id: 2, make: "Hyundai", model: "Verna", category: "Sedan", year: 2024, price: 1540000, quantity: 3 },
  { id: 3, make: "MG", model: "Hector", category: "SUV", year: 2023, price: 2140000, quantity: 0 },
];

function renderDetails(path = "/catalog/1") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/catalog/:id" element={<VehicleDetails />} />
        <Route path="/catalog" element={<p>Catalog page</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Vehicle Details", () => {
  it("shows vehicle details, specifications and related vehicles", async () => {
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);

    renderDetails();

    expect(screen.getByText(/loading vehicle details/i)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: /honda city/i })).toBeInTheDocument();
    expect(screen.getByText("Sedan")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("₹13,25,000")).toBeInTheDocument();
    expect(screen.getByText(/specifications/i)).toBeInTheDocument();
    expect(screen.getByText(/related vehicles/i)).toBeInTheDocument();
    expect(screen.getByText("Hyundai Verna")).toBeInTheDocument();
  });

  it("confirms purchase, updates stock, shows toast and navigates to catalog", async () => {
    const user = userEvent.setup();
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);
    vi.spyOn(vehicleService, "purchaseVehicle").mockResolvedValue({ ...vehicles[0], quantity: 1 });

    renderDetails();

    await screen.findByRole("heading", { name: /honda city/i });
    await user.click(screen.getByRole("button", { name: /purchase honda city/i }));
    expect(screen.getByRole("heading", { name: /confirm purchase/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^confirm purchase$/i }));

    await waitFor(() => {
      expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith(1);
    });

    expect(await screen.findByText(/purchase completed/i)).toBeInTheDocument();
    expect(await screen.findByText("Catalog page")).toBeInTheDocument();
  });

  it("disables purchase when stock is zero", async () => {
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);

    renderDetails("/catalog/3");

    expect(await screen.findByRole("heading", { name: /mg hector/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /out of stock/i })).toBeDisabled();
  });
});
