import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import VehicleGrid from "../../components/vehicle/VehicleGrid";
import { getAllVehicles, searchVehicle } from "../../services/vehicleService";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      setLoading(true);
      setError("");

      try {
        const data = query.trim()
          ? await searchVehicle(query.trim())
          : await getAllVehicles();

        setVehicles(data);
      } catch (err) {
        setError("Unable to load vehicles");
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(loadVehicles, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <main className="space-y-5 px-4 py-6 sm:px-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Available Cars</h1>
        <p className="text-sm text-slate-600">Browse dealership inventory and current stock.</p>
      </section>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {loading ? <Loader /> : <VehicleGrid vehicles={vehicles} />}
    </main>
  );
}
