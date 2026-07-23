import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteDialog from "../../components/admin/DeleteDialog";
import RestockModal from "../../components/admin/RestockModal";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Toast from "../../components/common/Toast";
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
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  function notify(message, type = "success") {
    setToast({ message, type });
  }

  async function loadVehicles() {
    setLoading(true);
    try {
      setVehicles(await getAllVehicles());
    } catch (err) {
      setError("Unable to load vehicles");
      notify("Unable to load vehicles", "error");
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
    setActionLoading(`purchase-${vehicle.id}`);
    try {
      const updated = await purchaseVehicle(vehicle.id);
      setVehicles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      notify("Vehicle purchased");
    } catch (err) {
      notify("Unable to purchase vehicle", "error");
    } finally {
      setActionLoading("");
    }
  }

  async function handleRestock(quantity) {
    setActionLoading(`restock-${restockTarget.id}`);
    try {
      const updated = await restockVehicle(restockTarget.id, quantity);
      setVehicles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setRestockTarget(null);
      notify("Vehicle restocked");
    } catch (err) {
      notify("Unable to restock vehicle", "error");
    } finally {
      setActionLoading("");
    }
  }

  async function handleDelete() {
    setActionLoading(`delete-${deleteTarget.id}`);
    try {
      await deleteVehicle(deleteTarget.id);
      setVehicles((current) => current.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      notify("Vehicle deleted");
    } catch (err) {
      notify("Unable to delete vehicle", "error");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <main className="space-y-5 px-4 py-6 sm:px-6">
      <Toast message={toast?.message} type={toast?.type} />
      <Card className="flex flex-col justify-between gap-3 p-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-600">Manage dealership inventory.</p>
        </div>
        <Button onClick={() => navigate("/vehicles/new")} type="button">Add Vehicle</Button>
      </Card>
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
          actionLoading={actionLoading}
        />
      )}
      <DeleteDialog vehicle={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <RestockModal vehicle={restockTarget} onCancel={() => setRestockTarget(null)} onConfirm={handleRestock} />
    </main>
  );
}
