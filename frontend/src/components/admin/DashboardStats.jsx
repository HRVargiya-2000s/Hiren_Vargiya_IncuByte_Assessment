const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function DashboardStats({ vehicles }) {
  const totalStock = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.quantity || 0), 0);
  const inventoryValue = vehicles.reduce(
    (sum, vehicle) => sum + Number(vehicle.price || 0) * Number(vehicle.quantity || 0),
    0
  );

  const stats = [
    ["Total Vehicles", vehicles.length],
    ["Total Stock", totalStock],
    ["Inventory Value", currency.format(inventoryValue)],
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map(([label, value]) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md" key={label}>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p aria-label={`${label} value`} className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
        </article>
      ))}
    </div>
  );
}
