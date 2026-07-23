import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import Home from "../../pages/user/Home";
import * as vehicleService from "../../services/vehicleService";

const vehicles = [
  { id: 1, make: "Honda", model: "City", category: "Sedan", year: 2023, price: 1325000, quantity: 5 },
  { id: 2, make: "Hyundai", model: "Creta", category: "SUV", year: 2024, price: 1450000, quantity: 4 },
  { id: 3, make: "MG", model: "Hector", category: "SUV", year: 2023, price: 2140000, quantity: 0 },
  { id: 4, make: "Maruti Suzuki", model: "Swift", category: "Hatchback", year: 2024, price: 725000, quantity: 6 },
  { id: 5, make: "Tata", model: "Nexon", category: "Compact SUV", year: 2023, price: 1180000, quantity: 3 },
  { id: 6, make: "Toyota", model: "Innova Crysta", category: "MPV", year: 2024, price: 2450000, quantity: 1 },
  { id: 7, make: "Kia", model: "Seltos", category: "SUV", year: 2024, price: 1630000, quantity: 2 },
];

describe("User Home", () => {
  it("renders premium inventory sections with filters, sorting and pagination", async () => {
    const user = userEvent.setup();
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);
    vi.spyOn(vehicleService, "searchVehicle").mockResolvedValue([vehicles[1]]);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/finding your next car/i)).toBeInTheDocument();
    expect(screen.getByText(/loading vehicles/i)).toBeInTheDocument();
    expect(await screen.findByText(/featured cars/i)).toBeInTheDocument();
    expect(screen.getByText(/popular categories/i)).toBeInTheDocument();
    expect(screen.getByText(/featured brands/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search vehicles/i), "Creta");

    await waitFor(() => {
      expect(vehicleService.searchVehicle).toHaveBeenCalledWith("Creta");
    });

    expect(await screen.findByText("Hyundai Creta")).toBeInTheDocument();

    await user.clear(screen.getByLabelText(/search vehicles/i));
    await user.selectOptions(screen.getByLabelText(/filter by make/i), "Honda");
    expect(screen.getByText("Honda City")).toBeInTheDocument();
    expect(screen.queryByText("Hyundai Creta")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter by make/i), "");
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "SUV");
    expect(screen.getByText("Hyundai Creta")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter by price/i), "over-2000000");
    expect(screen.getByText("MG Hector")).toBeInTheDocument();
    expect(screen.queryByText("Hyundai Creta")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText(/filter by price/i), "");
    await user.selectOptions(screen.getByLabelText(/sort cars/i), "price-desc");
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });

  it("shows an empty state when filters match no vehicles", async () => {
    const user = userEvent.setup();
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await screen.findByText("Honda City");
    await user.selectOptions(screen.getByLabelText(/filter by make/i), "Honda");
    await user.selectOptions(screen.getByLabelText(/filter by category/i), "SUV");

    expect(screen.getByText(/no cars match your filters/i)).toBeInTheDocument();
  });

  it("links vehicle cards to the details page", async () => {
    vi.spyOn(vehicleService, "getAllVehicles").mockResolvedValue(vehicles.slice(0, 1));

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const card = await screen.findByRole("article", { name: /honda city/i });
    expect(within(card).getByRole("link", { name: /view details/i })).toHaveAttribute("href", "/catalog/1");
  });
});
