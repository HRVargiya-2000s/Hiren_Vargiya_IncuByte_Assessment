import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import VehicleTable from "../../components/vehicle/VehicleTable";

const vehicles = [
  { id: 1, make: "Toyota", model: "Camry", category: "Sedan", year: 2024, price: 10000, quantity: 2 },
  { id: 2, make: "Ford", model: "Focus", category: "Hatchback", year: 2020, price: 7000, quantity: 0 },
];

describe("VehicleTable", () => {
  it("renders vehicles with purchase, restock, edit and delete actions", async () => {
    const user = userEvent.setup();
    const onPurchase = vi.fn();
    const onRestock = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <VehicleTable
        vehicles={vehicles}
        onPurchase={onPurchase}
        onRestock={onRestock}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText("Toyota")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /purchase ford focus/i })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /purchase toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /restock toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /edit toyota camry/i }));
    await user.click(screen.getByRole("button", { name: /delete toyota camry/i }));

    expect(onPurchase).toHaveBeenCalledWith(vehicles[0]);
    expect(onRestock).toHaveBeenCalledWith(vehicles[0]);
    expect(onEdit).toHaveBeenCalledWith(vehicles[0]);
    expect(onDelete).toHaveBeenCalledWith(vehicles[0]);
  });
});
