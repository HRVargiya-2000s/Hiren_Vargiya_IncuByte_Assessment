import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteDialog from "../../components/admin/DeleteDialog";
import RestockModal from "../../components/admin/RestockModal";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import VehicleTable from "../../components/vehicle/VehicleTable";
import {
  deleteVehicle,
  getAllVehicles,
  purchaseVehicle,
  restockVehicle,
  searchVehicle,
} from "../../services/vehicleService";

export default function ManageVehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);

  async function loadVehicles() {
    setLoading(true);
    try {
      setVehicles(await getAllVehicles());
    } catch (err) {
      setError("Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        loadVehicles();
        return;
      }

      setVehicles(await searchVehicle(query.trim()));
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  async function handlePurchase(vehicle) {
    const updated = await purchaseVehicle(vehicle.id);
    setVehicles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function handleRestock(quantity) {
    const updated = await restockVehicle(restockTarget.id, quantity);
    setVehicles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setRestockTarget(null);
  }

  async function handleDelete() {
    await deleteVehicle(deleteTarget.id);
    setVehicles((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <main className="space-y-5 px-4 py-6 sm:px-6">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-600">Manage dealership inventory.</p>
        </div>
        <Button onClick={() => navigate("/vehicles/new")} type="button">Add Vehicle</Button>
      </div>
      <SearchBar value={query} onChange={setQuery} />
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onDelete={setDeleteTarget}
          onEdit={(vehicle) => navigate(`/vehicles/${vehicle.id}/edit`)}
          onPurchase={handlePurchase}
          onRestock={setRestockTarget}
        />
      )}
      <DeleteDialog vehicle={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <RestockModal vehicle={restockTarget} onCancel={() => setRestockTarget(null)} onConfirm={handleRestock} />
    </main>
  );
}
