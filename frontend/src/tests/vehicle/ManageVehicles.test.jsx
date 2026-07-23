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

    await screen.findByRole("cell", { name: "Toyota" });
    await user.type(screen.getByLabelText(/search vehicles/i), "Camry");

    await waitFor(() => {
      expect(vehicleService.searchVehicle).toHaveBeenCalledWith("Camry");
    });

    await user.click(screen.getAllByText("Actions")[1]);
    await user.click(screen.getByRole("button", { name: /purchase toyota camry/i }));
    expect(screen.getByRole("heading", { name: /confirm purchase/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^confirm purchase$/i }));
    expect(await screen.findByText(/vehicle purchased/i)).toBeInTheDocument();
    await user.click(screen.getAllByText("Actions")[1]);
    await user.click(screen.getByRole("button", { name: /restock toyota camry/i }));
    expect(screen.getByText(/current stock: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/new stock: 2/i)).toBeInTheDocument();
    await user.clear(screen.getByLabelText(/restock quantity/i));
    await user.type(screen.getByLabelText(/restock quantity/i), "5");
    await user.click(screen.getByRole("button", { name: /^restock$/i }));
    expect(await screen.findByText(/vehicle restocked/i)).toBeInTheDocument();
    await user.click(screen.getAllByText("Actions")[1]);
    await user.click(screen.getByRole("button", { name: /delete toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete/i }));
    expect(await screen.findByText(/vehicle deleted/i)).toBeInTheDocument();

    expect(vehicleService.purchaseVehicle).toHaveBeenCalledWith(1);
    expect(vehicleService.restockVehicle).toHaveBeenCalledWith(1, 5);
    expect(vehicleService.deleteVehicle).toHaveBeenCalledWith(1);
  });

  it("filters, sorts and paginates inventory", async () => {
    const user = userEvent.setup();
    const vehicles = Array.from({ length: 7 }).map((_, index) => ({
      id: index + 1,
      make: index % 2 === 0 ? "Toyota" : "Honda",
      model: `Model ${index + 1}`,
      category: index % 2 === 0 ? "SUV" : "Sedan",
      year: 2020 + index,
      price: 10000 + index * 1000,
      quantity: index,
    }));

    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);
    vi.spyOn(vehicleService, "searchVehicle").mockResolvedValue(vehicles);

    render(
      <MemoryRouter>
        <ManageVehicles />
      </MemoryRouter>
    );

    await screen.findByRole("cell", { name: "Model 1" });
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /previous page/i }));

    await user.selectOptions(screen.getByLabelText(/filter by make/i), "Honda");

    expect(screen.queryByRole("cell", { name: "Model 1" })).not.toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Model 2" })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/filter by make/i), "");
    await user.selectOptions(screen.getByLabelText(/filter by model/i), "Model 3");
    expect(screen.getByRole("cell", { name: "Model 3" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "Model 2" })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/sort inventory/i), "price-desc");
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });
});
