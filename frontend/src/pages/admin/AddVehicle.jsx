import { useState } from "react";
import { useNavigate } from "react-router-dom";

import VehicleForm from "../../components/vehicle/VehicleForm";
import { addVehicle } from "../../services/vehicleService";
import { saveVehicleImage } from "../../utils/vehicleImages";

export default function AddVehicle() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSubmit(vehicle) {
    try {
      const { imageUrl, ...apiVehicle } = vehicle;
      const createdVehicle = await addVehicle(apiVehicle);
      saveVehicleImage(createdVehicle.id, imageUrl);
      navigate("/vehicles");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add vehicle");
    }
  }

  return (
    <main className="space-y-4 px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Add Vehicle</h1>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <VehicleForm onSubmit={handleSubmit} />
    </main>
  );
}
