import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Check, AlertTriangle, ShieldCheck, 
  Clock, Calendar, Sparkles, Star,
  Truck, CornerDownLeft, Tag, HelpCircle
} from "lucide-react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import Toast from "../../components/common/Toast";
import VehicleGrid from "../../components/vehicle/VehicleGrid";
import Footer from "../../components/common/Footer";
import { getAllVehicles, purchaseVehicle } from "../../services/vehicleService";
import { formatCurrency } from "../../utils/currency";
import { getVehicleImage } from "../../utils/vehicleImages";

function buildDescription(vehicle) {
  return `${vehicle.make} ${vehicle.model} is a premium ${vehicle.category} engineered for confident daily driving, elite comfort and high fuel efficiency. This listing represents live verified stock ready for delivery.`;
}

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState("confirm"); // "confirm", "processing", "success", "error"
  const [toast, setToast] = useState(null);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const loadVehicleDetails = async () => {
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
  };

  useEffect(() => {
    loadVehicleDetails();
  }, [id]);

  const quantity = Number(vehicle?.quantity || 0);
  const image = vehicle ? getVehicleImage(vehicle) : "";

  const galleryImages = useMemo(() => {
    return [
      image,
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80"
    ];
  }, [image]);

  const relatedVehicles = useMemo(() => {
    if (!vehicle) return [];
    return vehicles
      .filter((item) => String(item.id) !== String(vehicle.id))
      .filter((item) => item.category === vehicle.category || item.make === vehicle.make)
      .slice(0, 3);
  }, [vehicles, vehicle]);

  const handleOpenPurchase = () => {
    if (quantity === 0) return;
    setPurchaseStep("confirm");
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchaseStep("processing");
    try {
      const updated = String(vehicle.id).startsWith("sample-")
        ? { ...vehicle, quantity: Math.max(0, Number(vehicle.quantity) - 1) }
        : await purchaseVehicle(vehicle.id);

      setVehicle(updated);
      setVehicles((current) => current.map((item) => (String(item.id) === String(updated.id) ? updated : item)));
      setToast({ message: "Purchase completed", type: "success" });
      setPurchaseStep("success");
      
      // Auto-navigate to catalog after showing Purchase completed message
      setTimeout(() => {
        setShowPurchaseModal(false);
        navigate("/catalog");
      }, 300);

    } catch (err) {
      setPurchaseStep("error");
      setToast({ message: "Unable to complete purchase", type: "error" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader label="Loading vehicle details..." />
      </div>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-sm font-semibold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" /> {error}
        </div>
      </main>
    );
  }

  if (!vehicle) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-center space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-md">
          <h1 className="text-3xl font-extrabold text-slate-900">Vehicle not found</h1>
          <p className="mt-2 text-sm text-slate-500">The vehicle may have been sold or removed. Please check the current catalog.</p>
          <div className="pt-6">
            <Link className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-6 text-sm font-bold text-white transition hover:bg-cyan-500 hover:text-slate-950" to="/catalog">
              Back to Catalog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      <Toast message={toast?.message} type={toast?.type} />
      
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-600 hover:text-cyan-800 transition" to="/catalog">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 space-y-12">
        <section className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Gallery display */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 aspect-[4/3] shadow-md border border-slate-100">
              <img
                alt={`${vehicle.make} ${vehicle.model}`}
                className="h-full w-full object-cover"
                src={galleryImages[activeImageIndex]}
              />
              <div className="absolute top-4 left-4 rounded-full bg-slate-950/80 border border-white/15 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                <span>{vehicle.year}</span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {galleryImages.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-slate-100 transition cursor-pointer hover:opacity-90 ${
                    activeImageIndex === idx ? "border-cyan-500 shadow-md" : "border-slate-200"
                  }`}
                  type="button"
                >
                  <img alt="" className="h-full w-full object-cover" src={thumb} />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              
              <div>
                <span className="inline-flex items-center rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-800 ring-1 ring-inset ring-cyan-600/10 uppercase tracking-wider">
                  {vehicle.category}
                </span>
                
                <h1 className="mt-2 text-3xl font-bold text-slate-950">
                  {vehicle.make} {vehicle.model}
                </h1>
                
                <div className="mt-4 flex items-center justify-between border-b border-slate-100 pb-4">
                  <p className="text-3xl font-semibold text-slate-950">{formatCurrency(vehicle.price)}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                      {vehicle.year}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ring-inset ${
                        quantity === 0
                          ? "bg-red-50 text-red-700 ring-red-600/10"
                          : quantity <= 2
                            ? "bg-amber-50 text-amber-700 ring-amber-600/15"
                            : "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                      }`}
                    >
                      {quantity === 0 ? "Out of stock" : `${quantity} in stock`}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">{buildDescription(vehicle)}</p>

              {/* Specification Specs List */}
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
                  <p className="text-xs font-semibold uppercase text-slate-500">Stock Count</p>
                  <p className="font-semibold text-slate-900">{quantity} units</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
                  <p className="font-semibold text-slate-900">{quantity > 0 ? "Available" : "Sold Out"}</p>
                </div>
              </div>

              {/* Specifications Block */}
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
            </div>

            {/* Confirm/Reserve Button */}
            <div className="pt-8">
              <Button
                className="w-full text-base font-bold shadow text-white transition duration-300"
                disabled={quantity === 0}
                onClick={handleOpenPurchase}
                type="button"
              >
                {quantity === 0 ? "Out of stock" : `Purchase ${vehicle.make} ${vehicle.model}`}
              </Button>
            </div>

          </div>
        </section>

        {/* Related Vehicles panel */}
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-900">Related Vehicles</h2>
          <VehicleGrid vehicles={relatedVehicles} />
        </section>
      </main>

      {/* Modal confirmation booking portal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => purchaseStep !== "processing" && setShowPurchaseModal(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
            >
              
              {/* STEP 1: Confirm purchase details */}
              {purchaseStep === "confirm" && (
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-slate-950" role="heading">Confirm purchase</h3>
                  
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 text-left">
                      This will reduce available stock from {vehicle.quantity} to {Number(vehicle.quantity) - 1}.
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => setShowPurchaseModal(false)} 
                      type="button" 
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleConfirmPurchase} 
                      type="button"
                    >
                      Confirm Purchase
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: Processing state */}
              {purchaseStep === "processing" && (
                <div className="py-10 text-center space-y-4">
                  <div className="relative mx-auto h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-950">Securing Booking</h3>
                    <p className="text-xs text-slate-500">Updating live inventory & verifying credit line...</p>
                  </div>
                </div>
              )}

              {/* STEP 3: Success state */}
              {purchaseStep === "success" && (
                <div className="text-center py-6 space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-10 w-10" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-950">Purchase completed</h3>
                    <p className="text-xs text-slate-500 px-6 max-w-sm mx-auto">
                      Congratulations! You have successfully reserved the vehicle.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: Error state */}
              {purchaseStep === "error" && (
                <div className="text-center py-6 space-y-5">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-950">Purchase Failed</h3>
                    <p className="text-sm text-slate-500">
                      An error occurred while connecting to our database.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPurchaseModal(false)}
                      className="flex-1 min-h-11 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                      type="button"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleConfirmPurchase}
                      className="flex-1 min-h-11 rounded-lg bg-rose-600 text-white text-sm font-bold hover:bg-rose-500"
                      type="button"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
