import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ManageVehicles from "../../pages/admin/ManageVehicles";
import * as vehicleService from "../../services/vehicleService";

describe("Manage Vehicles", () => {
  it("searches, purchases, restocks and deletes vehicles", async () => {
    const user = userEvent.setup();
    const vehicle = { id: 1, make: "Toyota", model: "Camry", category: "Sedan", year: 2024, price: 10000, quantity: 2 };

    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue([vehicle]);
    vi.spyOn(vehicleService, "searchVehicle").mockResolvedValue([vehicle]);
    vi.spyOn(vehicleService, "purchaseVehicle").mockResolvedValue({ ...vehicle, quantity: 1 });
    vi.spyOn(vehicleService, "restockVehicle").mockResolvedValue({ ...vehicle, quantity: 7 });
    vi.spyOn(vehicleService, "deleteVehicle").mockResolvedValue({});

    render(
      <MemoryRouter>
        <ManageVehicles />
      </MemoryRouter>
    );

    await screen.findByText("Toyota");
    await user.type(screen.getByLabelText(/search vehicles/i), "Camry");

    await waitFor(() => {
      expect(vehicleService.searchVehicle).toHaveBeenCalledWith("Camry");
    });

    await user.click(screen.getByRole("button", { name: /purchase toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /restock toyota camry/i }));
    await user.clear(screen.getByLabelText(/restock quantity/i));
    await user.type(screen.getByLabelText(/restock quantity/i), "5");
    await user.click(screen.getByRole("button", { name: /^restock$/i }));
    await user.click(screen.getByRole("button", { name: /delete toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete/i }));

    expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith(1);
    expect(vehicleService.restockVehicle).toHaveBeenCalledWith(1, 5);
    expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(1);
  });
});
