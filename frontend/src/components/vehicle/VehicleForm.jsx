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

export default function VehicleForm({ initialVehicle, onSubmit }) {
  const [vehicle, setVehicle] = useState(initialVehicle || emptyVehicle);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setVehicle((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!vehicle.make || !vehicle.model || !vehicle.category || !vehicle.price || vehicle.quantity === "") {
      setError("Make, model, category, price and quantity are required");
      return;
    }

    onSubmit({
      make: vehicle.make,
      model: vehicle.model,
      category: vehicle.category,
      year: Number(vehicle.year),
      price: Number(vehicle.price),
      quantity: Number(vehicle.quantity),
      imageUrl: vehicle.imageUrl || "",
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
      <Input id="year" label="Year" type="number" value={vehicle.year} onChange={(event) => updateField("year", event.target.value)} />
      <Input id="price" label="Price" type="number" value={vehicle.price} onChange={(event) => updateField("price", event.target.value)} />
      <Input id="quantity" label="Quantity" type="number" value={vehicle.quantity} onChange={(event) => updateField("quantity", event.target.value)} />
      <Input id="imageUrl" label="Car image URL" placeholder="https://example.com/car.jpg" value={vehicle.imageUrl || ""} onChange={(event) => updateField("imageUrl", event.target.value)} />
      <Button type="submit">Save Vehicle</Button>
    </form>
  );
}
