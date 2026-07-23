import { getVehicleImage } from "../../utils/vehicleImages";
import { formatCurrency } from "../../utils/currency";

function ActionMenu({
  vehicle,
  onPurchase,
  onRestock,
  onEdit,
  onDelete,
  actionLoading,
}) {
  const quantity = Number(vehicle.quantity);
  const purchaseLoading = actionLoading === `purchase-${vehicle.id}`;
  const restockLoading = actionLoading === `restock-${vehicle.id}`;
  const deleteLoading = actionLoading === `delete-${vehicle.id}`;
  const itemClass =
    "w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none";

  return (
    <details className="group relative inline-block">
      <summary className="inline-flex min-h-9 cursor-pointer list-none items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white shadow-sm outline-none transition hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-slate-500">
        Actions
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
        <div className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
          <button
            className={`${itemClass} bg-white text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
            disabled={quantity === 0 || purchaseLoading}
            onClick={() => onPurchase?.(vehicle)}
            type="button"
          >
            {purchaseLoading ? "Buying..." : "Buy"}
          </button>
          <button
            className={`${itemClass} bg-white text-slate-900 shadow-sm disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
            disabled={restockLoading}
            onClick={() => onRestock?.(vehicle)}
            type="button"
          >
            {restockLoading ? "Adding..." : "Restock"}
          </button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1">
          <button
            className={`${itemClass} text-slate-700`}
            aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
            onClick={() => onEdit?.(vehicle)}
            type="button"
          >
            Edit
          </button>
          <button
            className={`${itemClass} text-red-700 hover:bg-red-50 focus:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
            disabled={deleteLoading}
            onClick={() => onDelete?.(vehicle)}
            type="button"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </details>
  );
}

export default function VehicleTable({
  vehicles = [],
  onPurchase,
  onRestock,
  onEdit,
  onDelete,
  actionLoading = "",
  compact = false,
}) {
  if (!vehicles.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        No vehicles found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className={`${compact ? "min-w-[620px]" : "min-w-[900px]"} w-full table-fixed border-collapse text-left text-sm`}>
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="w-24 px-4 py-3">Image</th>
            <th className="w-32 px-4 py-3">Make</th>
            <th className="w-32 px-4 py-3">Model</th>
            <th className="w-32 px-4 py-3">Category</th>
            <th className="w-20 px-4 py-3">Year</th>
            <th className="w-32 px-4 py-3">Price</th>
            <th className="w-32 px-4 py-3">Quantity</th>
            {!compact && <th className="w-32 px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {vehicles.map((vehicle) => (
            <tr className="align-middle hover:bg-slate-50" key={vehicle.id}>
              <td className="px-4 py-3 align-middle">
                {getVehicleImage(vehicle) ? (
                  <img
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="h-12 w-16 rounded-md border border-slate-200 object-cover"
                    src={getVehicleImage(vehicle)}
                  />
                ) : (
                  <div className="grid h-12 w-16 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
                    No image
                  </div>
                )}
              </td>
              <td className="px-4 py-3 align-middle font-medium leading-5 text-slate-900">{vehicle.make}</td>
              <td className="px-4 py-3 align-middle">{vehicle.model}</td>
              <td className="px-4 py-3 align-middle">{vehicle.category}</td>
              <td className="px-4 py-3 align-middle">{vehicle.year}</td>
              <td className="px-4 py-3 align-middle whitespace-nowrap">{formatCurrency(vehicle.price)}</td>
              <td className="px-4 py-3 align-middle">
                <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                  Number(vehicle.quantity) === 0
                    ? "bg-red-50 text-red-700"
                    : Number(vehicle.quantity) <= 2
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                }`}>
                  {Number(vehicle.quantity) === 0 ? "Out of stock" : `${vehicle.quantity} in stock`}
                </span>
              </td>
              {!compact && (
                <td className="px-4 py-3 align-middle">
                  <ActionMenu
                    actionLoading={actionLoading}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onPurchase={onPurchase}
                    onRestock={onRestock}
                    vehicle={vehicle}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
