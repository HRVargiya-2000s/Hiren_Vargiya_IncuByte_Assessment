import { formatCurrency } from "../../utils/currency";
import { getVehicleImage } from "../../utils/vehicleImages";

export default function VehicleCard({ vehicle }) {
  const image = getVehicleImage(vehicle);
  const quantity = Number(vehicle.quantity || 0);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {image ? (
        <img
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-44 w-full object-cover"
          src={image}
        />
      ) : (
        <div className="grid h-44 place-items-center bg-slate-100 text-sm font-medium text-slate-500">
          {vehicle.make} {vehicle.model}
        </div>
      )}
      <div className="space-y-3 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-sm text-slate-600">
            {vehicle.category} • {vehicle.year}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xl font-semibold text-slate-950">
            {formatCurrency(vehicle.price)}
          </p>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            quantity === 0
              ? "bg-red-50 text-red-700"
              : quantity <= 2
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
          }`}>
            {quantity === 0 ? "Out of stock" : `${quantity} available`}
          </span>
        </div>
      </div>
    </article>
  );
}
