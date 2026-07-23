import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AddVehicle from "../../pages/admin/AddVehicle";
import EditVehicle from "../../pages/admin/EditVehicle";
import * as vehicleService from "../../services/vehicleService";

describe("Vehicle forms", () => {
  it("adds a vehicle", async () => {
    const user = userEvent.setup();
    vi.spyOn(vehicleService, "addVehicle").mockResolvedValue({ id: 1 });

    render(
      <MemoryRouter>
        <AddVehicle />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/make/i), "Toyota");
    await user.type(screen.getByLabelText(/model/i), "Camry");
    await user.type(screen.getByLabelText(/category/i), "Sedan");
    await user.type(screen.getByLabelText(/year/i), "2024");
    await user.type(screen.getByLabelText(/price/i), "10000");
    await user.type(screen.getByLabelText(/quantity/i), "2");
    await user.click(screen.getByRole("button", { name: /save vehicle/i }));

    await waitFor(() => {
      expect(vehicleService.addVehicle).toHaveBeenCalledWith({
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        year: 2024,
        price: 10000,
        quantity: 2,
      });
    });
  });

  it("edits a vehicle", async () => {
    const user = userEvent.setup();
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue([
      { id: 1, make: "Toyota", model: "Camry", category: "Sedan", year: 2024, price: 10000, quantity: 2 },
    ]);
    vi.spyOn(vehicleService, "updateVehicle").mockResolvedValue({ id: 1 });

    render(
      <MemoryRouter initialEntries={["/vehicles/1/edit"]}>
        <EditVehicle />
      </MemoryRouter>
    );

    const price = await screen.findByLabelText(/price/i);
    await user.clear(price);
    await user.type(price, "11000");
    await user.click(screen.getByRole("button", { name: /save vehicle/i }));

    await waitFor(() => {
      expect(vehicleService.updateVehicle).toHaveBeenCalledWith("1", {
        make: "Toyota",
        model: "Camry",
        category: "Sedan",
        year: 2024,
        price: 11000,
        quantity: 2,
      });
    });
  });
});
