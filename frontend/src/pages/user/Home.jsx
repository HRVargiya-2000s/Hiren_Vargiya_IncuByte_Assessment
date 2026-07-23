import { useEffect, useMemo, useState } from "react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import VehicleGrid from "../../components/vehicle/VehicleGrid";
import { getAllVehicles, searchVehicle } from "../../services/vehicleService";
import { formatCurrency } from "../../utils/currency";

const pageSize = 6;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function matchesPrice(vehicle, priceFilter) {
  const price = Number(vehicle.price || 0);

  if (!priceFilter) return true;
  if (priceFilter === "under-1000000") return price < 1000000;
  if (priceFilter === "1000000-2000000") return price >= 1000000 && price <= 2000000;

  return price > 2000000;
}

function sortVehicles(vehicles, sortBy) {
  return [...vehicles].sort((a, b) => {
    if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
    if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
    if (sortBy === "stock-desc") return Number(b.quantity) - Number(a.quantity);
    if (sortBy === "year-desc") return Number(b.year || 0) - Number(a.year || 0);

    return `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
  });
}

function HomeSkeleton() {
  return (
    <section aria-busy="true" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="mb-4 text-sm font-medium text-slate-600">Loading vehicles...</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div className="space-y-3 rounded-lg border border-slate-200 p-4" data-testid="skeleton-row" key={item}>
            <div className="h-36 animate-pulse rounded-md bg-slate-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [query, setQuery] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
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

  useEffect(() => {
    setPage(1);
  }, [query, makeFilter, categoryFilter, priceFilter, sortBy]);

  const makes = useMemo(() => unique(vehicles.map((vehicle) => vehicle.make)), [vehicles]);
  const categories = useMemo(() => unique(vehicles.map((vehicle) => vehicle.category)), [vehicles]);
  const brands = makes.slice(0, 6);

  const filteredVehicles = useMemo(() => {
    const filtered = vehicles
      .filter((vehicle) => !makeFilter || vehicle.make === makeFilter)
      .filter((vehicle) => !categoryFilter || vehicle.category === categoryFilter)
      .filter((vehicle) => matchesPrice(vehicle, priceFilter));

    return sortVehicles(filtered, sortBy);
  }, [vehicles, makeFilter, categoryFilter, priceFilter, sortBy]);

  const featuredVehicles = sortVehicles(vehicles, "year-desc").slice(0, 3);
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const pagedVehicles = filteredVehicles.slice((page - 1) * pageSize, page * pageSize);
  const lowestPrice = vehicles.length
    ? Math.min(...vehicles.map((vehicle) => Number(vehicle.price || 0)))
    : 0;

  return (
    <main className="space-y-8 px-4 py-6 sm:px-6">
      <section className="overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
        <div className="grid min-h-[360px] gap-6 bg-[linear-gradient(90deg,rgba(2,6,23,0.96),rgba(8,47,73,0.82)),url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Premium dealership inventory</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Finding your next car starts here</h1>
            <p className="text-base text-slate-200 sm:text-lg">
              Explore verified cars with live stock, transparent rupee pricing, and a smooth purchase journey.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-300" href="#browse">
                Browse Cars
              </a>
              <a className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10" href="/vehicles">
                Sell or Manage
              </a>
            </div>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-slate-200">Inventory starts from</p>
            <p className="text-3xl font-bold">{formatCurrency(lowestPrice)}</p>
            <p className="text-sm text-slate-300">{vehicles.length} cars available across {categories.length} categories</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Featured Cars</h2>
              <p className="text-sm text-slate-600">Handpicked options from the latest inventory.</p>
            </div>
          </div>
          {loading ? <HomeSkeleton /> : <VehicleGrid vehicles={featuredVehicles} />}
        </div>
        <div className="grid gap-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Popular Categories</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  type="button"
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Featured Brands</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <button
                  className="rounded-md bg-slate-50 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800"
                  key={brand}
                  onClick={() => setMakeFilter(brand)}
                  type="button"
                >
                  {brand}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="space-y-5" id="browse">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Browse Inventory</h2>
          <p className="text-sm text-slate-600">Search, filter and compare cars ready for purchase.</p>
        </div>

        <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <SearchBar value={query} onChange={setQuery} />
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="user-make-filter">
            Filter by make
            <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="user-make-filter" value={makeFilter} onChange={(event) => setMakeFilter(event.target.value)}>
              <option value="">All makes</option>
              {makes.map((make) => <option key={make} value={make}>{make}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="user-category-filter">
            Filter by category
            <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="user-category-filter" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="user-price-filter">
            Filter by price
            <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="user-price-filter" value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
              <option value="">All prices</option>
              <option value="under-1000000">Under Rs. 10 lakh</option>
              <option value="1000000-2000000">Rs. 10-20 lakh</option>
              <option value="over-2000000">Over Rs. 20 lakh</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="user-sort">
            Sort cars
            <select className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2" id="user-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="year-desc">Newest first</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
              <option value="stock-desc">Stock high-low</option>
            </select>
          </label>
        </div>

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {loading ? (
          <Loader label="Loading vehicles..." />
        ) : (
          <>
            {pagedVehicles.length ? (
              <VehicleGrid vehicles={pagedVehicles} />
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">No cars match your filters</h3>
                <p className="mt-1 text-sm text-slate-600">Try a different make, category or price range.</p>
              </div>
            )}
            <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button" variant="secondary">
                  Previous page
                </Button>
                <Button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} type="button" variant="secondary">
                  Next page
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
