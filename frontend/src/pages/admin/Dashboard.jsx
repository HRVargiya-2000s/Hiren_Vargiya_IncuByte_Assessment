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
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Recent Inventory</h2>
        <VehicleTable vehicles={vehicles.slice(0, 5)} />
      </section>
    </main>
  );
}
