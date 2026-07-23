import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DeleteDialog from "../../components/admin/DeleteDialog";
import PurchaseDialog from "../../components/admin/PurchaseDialog";
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
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [restockTarget, setRestockTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [actionLoading, setActionLoading] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("make-asc");
  const [page, setPage] = useState(1);

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

  const makes = [...new Set(vehicles.map((vehicle) => vehicle.make).filter(Boolean))];
  const models = [...new Set(vehicles.map((vehicle) => vehicle.model).filter(Boolean))];
  const categories = [...new Set(vehicles.map((vehicle) => vehicle.category).filter(Boolean))];

  const filteredVehicles = vehicles
    .filter((vehicle) => !makeFilter || vehicle.make === makeFilter)
    .filter((vehicle) => !modelFilter || vehicle.model === modelFilter)
    .filter((vehicle) => !categoryFilter || vehicle.category === categoryFilter)
    .filter((vehicle) => {
      if (!priceFilter) return true;
      if (priceFilter === "under-1000000") return Number(vehicle.price) < 1000000;
      if (priceFilter === "1000000-2000000") return Number(vehicle.price) >= 1000000 && Number(vehicle.price) <= 2000000;
      return Number(vehicle.price) > 2000000;
    })
    .sort((a, b) => {
      if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
      if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
      if (sortBy === "stock-desc") return Number(b.quantity) - Number(a.quantity);
      return String(a.make).localeCompare(String(b.make));
    });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const pagedVehicles = filteredVehicles.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [makeFilter, modelFilter, categoryFilter, priceFilter, sortBy, query]);

  async function handlePurchase() {
    setActionLoading(`purchase-${purchaseTarget.id}`);
    try {
      const updated = await purchaseVehicle(purchaseTarget.id);
      setVehicles((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setPurchaseTarget(null);
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
      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_repeat(5,1fr)]">
        <SearchBar value={query} onChange={setQuery} />
        <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="make-filter">
          Filter by make
          <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="make-filter" value={makeFilter} onChange={(event) => setMakeFilter(event.target.value)}>
            <option value="">All makes</option>
            {makes.map((make) => <option key={make} value={make}>{make}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="model-filter">
          Filter by model
          <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="model-filter" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)}>
            <option value="">All models</option>
            {models.map((model) => <option key={model} value={model}>{model}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="category-filter">
          Filter by category
          <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="price-filter">
          Filter by price
          <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="price-filter" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
            <option value="">All prices</option>
            <option value="under-1000000">Under Rs. 10 lakh</option>
            <option value="1000000-2000000">Rs. 10-20 lakh</option>
            <option value="over-2000000">Over Rs. 20 lakh</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="sort-inventory">
          Sort inventory
          <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="sort-inventory" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="make-asc">Make A-Z</option>
            <option value="price-asc">Price low-high</option>
            <option value="price-desc">Price high-low</option>
            <option value="stock-desc">Stock high-low</option>
          </select>
        </label>
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {loading ? (
        <Loader />
      ) : (
        <>
          <VehicleTable
            vehicles={pagedVehicles}
            onDelete={setDeleteTarget}
            onEdit={(vehicle) => navigate(`/vehicles/${vehicle.id}/edit`)}
            onPurchase={setPurchaseTarget}
            onRestock={setRestockTarget}
            actionLoading={actionLoading}
          />
          <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button" variant="secondary">
                Previous page
              </Button>
              <Button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button" variant="secondary">
                Next page
              </Button>
            </div>
          </div>
        </>
      )}
      <PurchaseDialog
        loading={actionLoading === `purchase-${purchaseTarget?.id}`}
        vehicle={purchaseTarget}
        onCancel={() => setPurchaseTarget(null)}
        onConfirm={handlePurchase}
      />
      <DeleteDialog vehicle={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      <RestockModal vehicle={restockTarget} onCancel={() => setRestockTarget(null)} onConfirm={handleRestock} />
    </main>
  );
}
