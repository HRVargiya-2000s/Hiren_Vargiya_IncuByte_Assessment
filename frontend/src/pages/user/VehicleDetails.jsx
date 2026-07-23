import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import Toast from "../../components/common/Toast";
import VehicleGrid from "../../components/vehicle/VehicleGrid";
import { getAllVehicles, purchaseVehicle } from "../../services/vehicleService";
import { formatCurrency } from "../../utils/currency";
import { getVehicleImage } from "../../utils/vehicleImages";

function buildDescription(vehicle) {
  return `${vehicle.make} ${vehicle.model} is a ${vehicle.category} built for confident daily driving, strong comfort and practical ownership. This listing reflects live dealership stock and transparent rupee pricing.`;
}

function stockClass(quantity) {
  if (quantity === 0) return "bg-red-50 text-red-700";
  if (quantity <= 2) return "bg-amber-50 text-amber-700";

  return "bg-emerald-50 text-emerald-700";
}

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchaseTarget, setPurchaseTarget] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicle() {
      setLoading(true);
      setError("");

      try {
        const data = await getAllVehicles();
        const selected = data.find((item) => String(item.id) === String(id));

        setVehicles(data);
        setVehicle(selected || null);
      } catch (err) {
        setError("Unable to load vehicle details");
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id]);

  const quantity = Number(vehicle?.quantity || 0);
  const image = vehicle ? getVehicleImage(vehicle) : "";
  const relatedVehicles = useMemo(() => {
    if (!vehicle) return [];

    return vehicles
      .filter((item) => String(item.id) !== String(vehicle.id))
      .filter((item) => item.category === vehicle.category || item.make === vehicle.make)
      .slice(0, 3);
  }, [vehicles, vehicle]);

  async function handleConfirmPurchase() {
    if (!purchaseTarget) return;

    setPurchaseLoading(true);

    try {
      const updated = String(purchaseTarget.id).startsWith("sample-")
        ? { ...purchaseTarget, quantity: Math.max(0, Number(purchaseTarget.quantity) - 1) }
        : await purchaseVehicle(purchaseTarget.id);

      setVehicle(updated);
      setVehicles((current) => current.map((item) => (String(item.id) === String(updated.id) ? updated : item)));
      setPurchaseTarget(null);
      setToast({ message: "Purchase completed", type: "success" });
      setTimeout(() => navigate("/catalog"), 250);
    } catch (err) {
      setToast({ message: "Unable to complete purchase", type: "error" });
    } finally {
      setPurchaseLoading(false);
    }
  }

  if (loading) return <Loader />;

  if (error) {
    return (
      <main className="px-4 py-6 sm:px-6">
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="space-y-4 px-4 py-6 sm:px-6">
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Vehicle not found</h1>
          <p className="mt-1 text-sm text-slate-600">This car may no longer be available.</p>
          <Link className="mt-4 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white" to="/catalog">
            Back to Catalog
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8 px-4 py-6 sm:px-6">
      <Toast message={toast?.message} type={toast?.type} />

      <Link className="text-sm font-semibold text-cyan-700 hover:text-cyan-900" to="/catalog">
        Back to catalog
      </Link>

      <section className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {image ? (
            <img
              alt={`${vehicle.make} ${vehicle.model}`}
              className="h-[420px] w-full rounded-lg object-cover"
              src={image}
            />
          ) : (
            <div className="grid h-[420px] place-items-center rounded-lg bg-slate-100 text-slate-500">
              {vehicle.make} {vehicle.model}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div className="h-24 rounded-md border border-slate-200 bg-slate-50" key={item}>
                {image && <img alt="" className="h-full w-full rounded-md object-cover" src={image} />}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">{vehicle.category}</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">{vehicle.make} {vehicle.model}</h1>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{formatCurrency(vehicle.price)}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${stockClass(quantity)}`}>
              {quantity === 0 ? "Out of stock" : `${quantity} in stock`}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
              {vehicle.year}
            </span>
          </div>

          <p className="text-sm leading-6 text-slate-600">{buildDescription(vehicle)}</p>

          <div className="grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Make</p>
              <p className="font-semibold text-slate-900">{vehicle.make}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Model</p>
              <p className="font-semibold text-slate-900">{vehicle.model}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
              <p className="font-semibold text-slate-900">{vehicle.category}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Stock</p>
              <p className="font-semibold text-slate-900">{quantity}</p>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Specifications</h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-slate-500">Fuel Type</dt>
                <dd className="font-semibold text-slate-900">Petrol</dd>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-slate-500">Transmission</dt>
                <dd className="font-semibold text-slate-900">Automatic</dd>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-slate-500">Warranty</dt>
                <dd className="font-semibold text-slate-900">Dealer verified</dd>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <dt className="text-slate-500">Delivery</dt>
                <dd className="font-semibold text-slate-900">Ready stock</dd>
              </div>
            </dl>
          </section>

          <Button
            className="w-full"
            disabled={quantity === 0}
            onClick={() => setPurchaseTarget(vehicle)}
            type="button"
          >
            {quantity === 0 ? "Out of stock" : `Purchase ${vehicle.make} ${vehicle.model}`}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Related Vehicles</h2>
        <VehicleGrid vehicles={relatedVehicles} />
      </section>

      {purchaseTarget && (
        <Modal title="Confirm purchase" onClose={() => setPurchaseTarget(null)}>
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {purchaseTarget.make} {purchaseTarget.model}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                This will reduce available stock from {purchaseTarget.quantity} to {Number(purchaseTarget.quantity) - 1}.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button disabled={purchaseLoading} onClick={() => setPurchaseTarget(null)} type="button" variant="secondary">
                Cancel
              </Button>
              <Button disabled={purchaseLoading} onClick={handleConfirmPurchase} type="button">
                {purchaseLoading ? "Purchasing..." : "Confirm Purchase"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}
