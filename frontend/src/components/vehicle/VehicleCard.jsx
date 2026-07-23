import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, GitCompare, Landmark } from "lucide-react";
import { formatCurrency } from "../../utils/currency";
import { getVehicleImage } from "../../utils/vehicleImages";

export default function VehicleCard({ vehicle }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [compared, setCompared] = useState(false);

  const image = getVehicleImage(vehicle);
  const quantity = Number(vehicle.quantity || 0);
  const title = `${vehicle.make} ${vehicle.model}`;

  return (
    <article
      aria-label={title}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-xl"
    >
      {/* Wishlist Heart Icon (Top Right) */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        type="button"
        className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md shadow transition duration-300 ${
          wishlisted
            ? "bg-rose-500 text-white"
            : "bg-white/70 text-slate-700 hover:bg-white hover:text-rose-500"
        }`}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-4.5 w-4.5 ${wishlisted ? "fill-white" : ""}`} />
      </button>

      {/* Compare Icon (Top Left) */}
      <button
        onClick={() => setCompared(!compared)}
        type="button"
        className={`absolute top-4 left-4 z-10 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md shadow transition duration-300 ${
          compared
            ? "bg-cyan-500 text-slate-950"
            : "bg-white/70 text-slate-700 hover:bg-white hover:text-cyan-500"
        }`}
        aria-label={compared ? "Remove from compare" : "Compare vehicle"}
      >
        <GitCompare className="h-4.5 w-4.5" />
      </button>

      {/* Image Gallery Container */}
      <div className="relative h-56 overflow-hidden bg-slate-950">
        {image ? (
          <img
            alt={title}
            className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-108 group-hover:opacity-90"
            src={image}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-600/10">
              {vehicle.category}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {vehicle.year || 2024}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-950 transition duration-300 group-hover:text-cyan-600">
              {title}
            </h2>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1">
                <Landmark className="h-3 w-3" /> Est. EMI Starting
              </span>
              <p className="text-sm font-semibold text-slate-700">
                {formatCurrency(Math.round(Number(vehicle.price || 0) * 0.018))}/mo
              </p>
            </div>
            
            <div className="text-right">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                  quantity === 0
                    ? "bg-red-50 text-red-700 ring-red-600/10"
                    : quantity <= 2
                      ? "bg-amber-50 text-amber-700 ring-amber-600/15"
                      : "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                }`}
              >
                {quantity === 0 ? "Out of Stock" : `${quantity} Available`}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing & Link */}
        <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-semibold text-slate-500">Fixed Price</span>
            <p className="text-xl font-extrabold text-slate-950">
              {formatCurrency(vehicle.price)}
            </p>
          </div>
          
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-950 px-5 text-sm font-bold text-white shadow transition duration-300 hover:bg-cyan-500 hover:text-slate-950 hover:shadow-lg focus:outline-none"
            to={`/catalog/${vehicle.id}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
