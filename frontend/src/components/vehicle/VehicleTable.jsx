import Button from "../common/Button";
import { getVehicleImage } from "../../utils/vehicleImages";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function VehicleTable({
  vehicles = [],
  onPurchase,
  onRestock,
  onEdit,
  onDelete,
  actionLoading = "",
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
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Make</th>
            <th className="px-4 py-3">Model</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {vehicles.map((vehicle) => (
            <tr className="hover:bg-slate-50" key={vehicle.id}>
              <td className="px-4 py-3">
                {getVehicleImage(vehicle) ? (
                  <img
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="h-14 w-20 rounded-md border border-slate-200 object-cover"
                    src={getVehicleImage(vehicle)}
                  />
                ) : (
                  <div className="grid h-14 w-20 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-500">
                    No image
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{vehicle.make}</td>
              <td className="px-4 py-3">{vehicle.model}</td>
              <td className="px-4 py-3">{vehicle.category}</td>
              <td className="px-4 py-3">{vehicle.year}</td>
              <td className="px-4 py-3">{currency.format(Number(vehicle.price || 0))}</td>
              <td className="px-4 py-3">{vehicle.quantity}</td>
              <td className="flex flex-wrap gap-2 px-4 py-3">
                <Button aria-label={`Purchase ${vehicle.make} ${vehicle.model}`} disabled={Number(vehicle.quantity) === 0 || actionLoading === `purchase-${vehicle.id}`} onClick={() => onPurchase?.(vehicle)}>
                  {actionLoading === `purchase-${vehicle.id}` ? "Purchasing..." : "Purchase"}
                </Button>
                <Button aria-label={`Restock ${vehicle.make} ${vehicle.model}`} disabled={actionLoading === `restock-${vehicle.id}`} onClick={() => onRestock?.(vehicle)} variant="secondary">
                  {actionLoading === `restock-${vehicle.id}` ? "Restocking..." : "Restock"}
                </Button>
                <Button aria-label={`Edit ${vehicle.make} ${vehicle.model}`} onClick={() => onEdit?.(vehicle)} variant="secondary">
                  Edit
                </Button>
                <Button aria-label={`Delete ${vehicle.make} ${vehicle.model}`} disabled={actionLoading === `delete-${vehicle.id}`} onClick={() => onDelete?.(vehicle)} variant="danger">
                  {actionLoading === `delete-${vehicle.id}` ? "Deleting..." : "Delete"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
