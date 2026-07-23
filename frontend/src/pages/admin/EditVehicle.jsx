import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Loader from "../../components/common/Loader";
import VehicleForm from "../../components/vehicle/VehicleForm";
import { getAllVehicles, updateVehicle } from "../../services/vehicleService";
import { getVehicleImage, saveVehicleImage } from "../../utils/vehicleImages";

export default function EditVehicle() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const id = useMemo(() => params.id || location.pathname.match(/vehicles\/(\d+)\/edit/)?.[1], [params.id, location.pathname]);
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicle() {
      try {
        const vehicles = await getAllVehicles();
        const selectedVehicle = vehicles.find((item) => String(item.id) === String(id));
        setVehicle(selectedVehicle ? { ...selectedVehicle, imageUrl: getVehicleImage(selectedVehicle) } : null);
      } catch (err) {
        setError("Unable to load vehicle");
      }
    }

    loadVehicle();
  }, [id]);

  async function handleSubmit(payload) {
    try {
      const { imageUrl, ...apiVehicle } = payload;
      await updateVehicle(id, apiVehicle);
      saveVehicleImage(id, imageUrl);
      navigate("/vehicles");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update vehicle");
    }
  }

  if (error) return <p className="p-6 text-sm text-red-700">{error}</p>;
  if (!vehicle) return <Loader />;

  return (
    <main className="space-y-4 px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Vehicle</h1>
      <VehicleForm initialVehicle={vehicle} onSubmit={handleSubmit} />
    </main>
  );
}
