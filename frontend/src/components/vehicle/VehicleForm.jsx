import { useState } from "react";

import Button from "../common/Button";
import Input from "../common/Input";

const emptyVehicle = {
  make: "",
  model: "",
  category: "",
  year: "",
  price: "",
  quantity: "",
  imageUrl: "",
};

export default function VehicleForm({ initialVehicle, onSubmit, loading = false }) {
  const [vehicle, setVehicle] = useState(initialVehicle || emptyVehicle);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setVehicle((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!vehicle.make.trim() || !vehicle.model.trim() || !vehicle.category.trim() || !vehicle.price || vehicle.quantity === "") {
      setError("Make, model, category, price and quantity are required");
      return;
    }

    if (vehicle.year && Number(vehicle.year) < 1886) {
      setError("Year must be 1886 or later");
      return;
    }

    if (Number(vehicle.price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (!Number.isInteger(Number(vehicle.quantity)) || Number(vehicle.quantity) < 0) {
      setError("Quantity must be a whole number of 0 or more");
      return;
    }

    onSubmit({
      make: vehicle.make.trim(),
      model: vehicle.model.trim(),
      category: vehicle.category.trim(),
      year: vehicle.year ? Number(vehicle.year) : new Date().getFullYear(),
      price: Number(vehicle.price),
      quantity: Number(vehicle.quantity),
      imageUrl: vehicle.imageUrl?.trim() || "",
    });
  }

  return (
    <form className="grid max-w-2xl gap-4 rounded-lg bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {vehicle.imageUrl && (
        <img
          alt={`${vehicle.make || "Vehicle"} preview`}
          className="h-48 w-full rounded-lg border border-slate-200 object-cover"
          src={vehicle.imageUrl}
        />
      )}
      <Input id="make" label="Make" value={vehicle.make} onChange={(event) => updateField("make", event.target.value)} />
      <Input id="model" label="Model" value={vehicle.model} onChange={(event) => updateField("model", event.target.value)} />
      <Input id="category" label="Category" value={vehicle.category} onChange={(event) => updateField("category", event.target.value)} />
      <Input id="year" label="Year" min="1886" type="number" value={vehicle.year} onChange={(event) => updateField("year", event.target.value)} />
      <Input id="price" label="Price" min="1" type="number" value={vehicle.price} onChange={(event) => updateField("price", event.target.value)} />
      <Input id="quantity" label="Quantity" min="0" step="1" type="number" value={vehicle.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
      <Input id="imageUrl" label="Car image URL" placeholder="https://example.com/car.jpg" value={vehicle.imageUrl || ""} onChange={(event) => updateField("imageUrl", event.target.value)} />
      <Button disabled={loading} type="submit">{loading ? "Saving..." : "Save Vehicle"}</Button>
    </form>
  );
}
