import { Link } from "react-router-dom";

import { formatCurrency } from "../../utils/currency";
import { getVehicleImage } from "../../utils/vehicleImages";

export default function VehicleCard({ vehicle }) {
  const image = getVehicleImage(vehicle);
  const quantity = Number(vehicle.quantity || 0);
  const title = `${vehicle.make} ${vehicle.model}`;

  return (
    <article
      aria-label={title}
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
    >
      {image ? (
        <img
          alt={title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          src={image}
        />
      ) : (
        <div className="grid h-48 place-items-center bg-slate-100 text-sm font-medium text-slate-500">
          {title}
        </div>
      )}
      <div className="space-y-4 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-800">
              {vehicle.category}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {vehicle.year}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-slate-950">
            {formatCurrency(vehicle.price)}
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              quantity === 0
                ? "bg-red-50 text-red-700"
                : quantity <= 2
                  ? "bg-amber-50 text-amber-700"
                  : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {quantity === 0 ? "Out of stock" : `${quantity} available`}
          </span>
        </div>
        <Link
          className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          to={`/catalog/${vehicle.id}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
