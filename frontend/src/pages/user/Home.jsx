import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Car, Shield, Award, Sparkles, Navigation, 
  ArrowRight, Search, SlidersHorizontal, Star, 
  ChevronRight, Calendar, UserCheck, MessageSquare, Play
} from "lucide-react";

import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import VehicleGrid from "../../components/vehicle/VehicleGrid";
import ThreeCarShowcase from "../../components/vehicle/ThreeCarShowcase";
import Footer from "../../components/common/Footer";
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
      <p className="mb-4 text-sm font-medium text-slate-600">Loading inventory data...</p>
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

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Aravind Swamy",
      role: "Business Executive",
      comment: "The transparent pricing structure and seamless purchase click on the Nexon made this the absolute easiest car delivery I have ever experienced. Outstanding premium service!",
      rating: 5
    },
    {
      name: "Rohini Sen",
      role: "Software Architect",
      comment: "Seeing the exact vehicle inventory specifications matching the local database gave me total confidence. The interactive details are flawless.",
      rating: 5
    },
    {
      name: "Vikram Malhotra",
      role: "Automotive Enthusiast",
      comment: "The tech integration, from the luxury 3D configurator to transparent checkout process, matches global standards. Truly a stellar platform.",
      rating: 5
    }
  ];

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

  const makes = useMemo(() => unique(vehicles.map((v) => v.make)), [vehicles]);
  const categories = useMemo(() => unique(vehicles.map((v) => v.category)), [vehicles]);
  const brands = makes.slice(0, 6);

  const filteredVehicles = useMemo(() => {
    const filtered = vehicles
      .filter((v) => !makeFilter || v.make === makeFilter)
      .filter((v) => !categoryFilter || v.category === categoryFilter)
      .filter((v) => matchesPrice(v, priceFilter));
    return sortVehicles(filtered, sortBy);
  }, [vehicles, makeFilter, categoryFilter, priceFilter, sortBy]);

  const featuredVehicles = useMemo(() => {
    if (vehicles.length <= 2) return [];
    const filtered = vehicles
      .filter((v) => !makeFilter || v.make === makeFilter)
      .filter((v) => !categoryFilter || v.category === categoryFilter)
      .filter((v) => matchesPrice(v, priceFilter));
    return sortVehicles(filtered, "year-desc").slice(0, 3);
  }, [vehicles, makeFilter, categoryFilter, priceFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / pageSize));
  const pagedVehicles = filteredVehicles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* 1. Full-screen Hero Section */}
      <section className="relative h-[95vh] w-full overflow-hidden bg-slate-950 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1920&q=90')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-slate-900/40" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-4 py-12 sm:px-6 lg:px-8">
          <div className="my-auto max-w-2xl space-y-6 pt-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-cyan-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Electrifying Luxury
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-none text-white">
              Finding your next car <br />
              <span className="text-cyan-400 font-light">starts here</span>
            </h1>
            <p className="max-w-md text-base text-slate-300 sm:text-lg leading-relaxed">
              Experience the pinnacle of engineering. Meet the next generation of verified performance cars with real-time stock availability.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#browse" 
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-cyan-500 px-6 text-sm font-bold text-slate-950 transition duration-300 hover:scale-105 hover:bg-cyan-400 shadow-lg shadow-cyan-500/25"
              >
                Browse Cars
              </a>
              <a 
                href="#three-showcase-section" 
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur transition duration-300 hover:bg-white/20"
              >
                Explore 3D Config
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-8">
            <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md max-w-sm">
              <div className="relative flex h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=150&q=80" 
                  alt="Interior trailer screenshot" 
                  className="w-full object-cover opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500 text-slate-950">
                    <Play className="h-3.5 w-3.5 fill-slate-950 ml-0.5" />
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">See The Trailer</span>
                <p className="text-xs font-semibold text-white leading-tight">Enjoy new features & car advantages</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="text-center sm:text-right">
                <p className="text-2xl font-black text-cyan-400 leading-none">{vehicles.length || "12"}+</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Live Stock</p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="text-center sm:text-right text-white">
                <p className="text-2xl font-black text-white leading-none">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Verified Prices</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Grid section */}
      <section className="-mt-10 relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl grid grid-cols-2 md:grid-cols-6 gap-6 items-center justify-items-center">
          {brands.map((brand) => (
            <button
              onClick={() => {
                setMakeFilter(brand);
                window.location.hash = "#browse";
              }}
              key={brand}
              type="button"
              className="group flex flex-col items-center gap-2 text-slate-500 transition duration-300 hover:text-cyan-600 cursor-pointer"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 transition group-hover:bg-cyan-50">
                <Car className="h-6 w-6 text-slate-600 transition group-hover:text-cyan-500" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-700 group-hover:text-cyan-600">{brand}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Cars and Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* Main Featured list */}
          <div className="space-y-6 lg:col-span-2">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Featured Cars</h2>
              <p className="text-sm text-slate-600 pt-1">Handpicked options from our premium inventory.</p>
            </div>
            
            {loading ? <HomeSkeleton /> : <VehicleGrid vehicles={featuredVehicles} />}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Popular Categories</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition border ${
                      categoryFilter === category
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-cyan-400 hover:text-cyan-600"
                    }`}
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    type="button"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </section>
            
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Featured Brands</h2>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <button
                    className={`rounded-lg px-3 py-2 text-left text-xs font-semibold transition ${
                      makeFilter === brand
                        ? "bg-cyan-50 text-cyan-800 ring-1 ring-cyan-500/20"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
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

        </div>
      </section>

      {/* 4. 3D Car Showcase Section */}
      <section id="three-showcase-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-white shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center p-8 sm:p-14">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Navigation className="h-3.5 w-3.5" /> Interactive Holograph
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
                NOVA <span className="font-light text-cyan-400">ONE</span>
              </h2>
              <p className="text-2xl font-light text-slate-300 leading-tight">
                Developed for the experience of electrical power.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Click and drag to orbit. Scroll to zoom. The digital blueprint configures custom suspension, aerogrid layout, and chassis weight ratios in live simulation.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setCategoryFilter("SUV");
                    window.location.hash = "#browse";
                  }}
                  className="group inline-flex items-center gap-2 bg-white px-5 py-3 rounded-lg text-sm font-bold text-slate-950 transition duration-300 hover:bg-cyan-400 hover:text-slate-950"
                  type="button"
                >
                  Explore Features <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            
            <div className="relative rounded-2xl bg-slate-900/50 border border-white/5 p-2 shadow-inner">
              <ThreeCarShowcase />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-300 border border-white/10">
                  🖱️ Use mouse to spin 3D chassis
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefits / Why Choose us */}
      <section id="why-choose-us" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600">Our Value</span>
          <h2 className="text-3xl font-extrabold text-slate-950">Why Choose Nova One</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We provide a fully secure and optimized ecosystem that ensures your vehicle buying experience is top-tier from comparison to final delivery.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Shield className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">100% Certified Inspection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every vehicle undergoes a detailed 150-point diagnostics check matching manufacturer specifications before seeding into inventory list.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Award className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">No Haggling. Transparent Pricing</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Fixed local pricing displays with no hidden fees or commissions. Our Indian Rupee conversion updates instantly across all views.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Calendar className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-bold text-slate-900">Instant Digital Checkout</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Lock in your vehicle purchase directly. Stock counts reduce instantly in our central database, guarding against duplicate bookings.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Testimonial Carousel */}
      <section className="bg-slate-950 text-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-8">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex justify-center gap-1.5 items-center">
            <MessageSquare className="h-4 w-4" /> Guest Feedback
          </span>
          
          <div className="min-h-[140px]">
            <p className="text-lg sm:text-2xl font-light italic leading-relaxed text-slate-200">
              "{testimonials[activeTestimonial].comment}"
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-bold text-white">{testimonials[activeTestimonial].name}</h4>
            <p className="text-xs text-slate-400 uppercase tracking-widest">{testimonials[activeTestimonial].role}</p>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? "w-6 bg-cyan-500" : "w-2.5 bg-slate-700"
                }`}
                aria-label={`Testimonial slide ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Catalog / Browse Inventory */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 space-y-8 scroll-mt-10" id="browse">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Browse Inventory</h2>
            <p className="text-sm text-slate-600 pt-1">Search, filter and compare cars ready for purchase.</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4 lg:grid-cols-5 items-end">
          <div className="md:col-span-1 lg:col-span-2">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          
          <label className="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="user-makeup">
            Filter by make
            <select 
              className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:outline-none" 
              id="user-makeup" 
              value={makeFilter} 
              onChange={(e) => setMakeFilter(e.target.value)}
              aria-label="Filter by make"
            >
              <option value="">All makes</option>
              {makes.map((make) => <option key={make} value={make}>{make}</option>)}
            </select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="user-category">
            Filter by category
            <select 
              className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:outline-none" 
              id="user-category" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="user-price">
            Filter by price
            <select 
              className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:outline-none" 
              id="user-price" 
              value={priceFilter} 
              onChange={(e) => setPriceFilter(e.target.value)}
              aria-label="Filter by price"
            >
              <option value="">All prices</option>
              <option value="under-1000000">Under Rs. 10 lakh</option>
              <option value="1000000-2000000">Rs. 10-20 lakh</option>
              <option value="over-2000000">Over Rs. 20 lakh</option>
            </select>
          </label>

          <label className="grid gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider" htmlFor="user-sort">
            Sort cars
            <select 
              className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 focus:border-cyan-500 focus:outline-none" 
              id="user-sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort cars"
            >
              <option value="featured">Featured</option>
              <option value="year-desc">Newest first</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
              <option value="stock-desc">Stock high-low</option>
            </select>
          </label>
        </div>

        {error && <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}

        {loading ? (
          <Loader label="Loading vehicles..." />
        ) : (
          <>
            <AnimatePresence mode="popLayout">
              {pagedVehicles.length ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleGrid vehicles={pagedVehicles} />
                </motion.div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-inner">
                  <Car className="h-10 w-10 mx-auto text-slate-400 mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">No cars match your filters</h3>
                  <p className="mt-1 text-sm text-slate-500">Try a different make, category or price range.</p>
                </div>
              )}
            </AnimatePresence>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm sm:flex-row">
                <span className="font-medium">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <Button 
                    disabled={page === 1} 
                    onClick={() => setPage((current) => Math.max(1, current - 1))} 
                    type="button" 
                    variant="secondary"
                  >
                    Previous page
                  </Button>
                  <Button 
                    disabled={page === totalPages} 
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))} 
                    type="button" 
                    variant="secondary"
                  >
                    Next page
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* 8. Call To Action */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-cyan-900/50 via-slate-900 to-slate-950" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-none text-white">
            Ready to find your <br />Dream Machine?
          </h2>
          <p className="max-w-xl mx-auto text-base text-slate-400 leading-relaxed">
            Our catalog is fully synchronized with live inventory stock. Reserve your choice instantly with absolute peace of mind.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a href="#browse" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-bold text-slate-950 hover:bg-cyan-400 hover:text-slate-950 transition">
              Get Started Now
            </a>
            <a href="#why-choose-us" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 text-sm font-bold text-white hover:bg-white/10 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
