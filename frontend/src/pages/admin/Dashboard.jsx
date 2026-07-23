import { useEffect, useState } from "react";
import DashboardStats from "../../components/admin/DashboardStats";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import VehicleTable from "../../components/vehicle/VehicleTable";
import { getAllVehicles } from "../../services/vehicleService";

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <main className="space-y-6 px-4 py-6 sm:px-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Overview of dealership inventory.</p>
      </Card>
      <DashboardStats vehicles={vehicles} />
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent Inventory</h2>
          <VehicleTable vehicles={vehicles.slice(0, 5)} />
        </section>
        <div className="space-y-5">
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <a className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800" href="/vehicles/new">
                Add a vehicle
              </a>
              <a className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800" href="/vehicles">
                Manage inventory
              </a>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {vehicles.slice(0, 3).map((vehicle) => (
                <p className="rounded-md bg-slate-50 px-3 py-2" key={vehicle.id}>
                  {vehicle.make} {vehicle.model} stock is {vehicle.quantity}.
                </p>
              ))}
              {!vehicles.length && <p>No recent activity yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
