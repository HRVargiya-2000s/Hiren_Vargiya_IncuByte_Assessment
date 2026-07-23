import { NavLink } from "react-router-dom";

import Button from "./Button";

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const linkClass = ({ isActive }) =>
    `relative rounded-md px-3 py-2 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
      isActive
        ? "bg-slate-950 text-white shadow-sm"
        : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-bold text-slate-950">Car Inventory</p>
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">
              Dealership Admin
            </p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-right lg:hidden">
            <p className="text-xs font-semibold text-slate-900">{user.name || "User"}</p>
            <p className="text-[11px] uppercase text-slate-500">{user.role || "user"}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <NavLink className={linkClass} to="/dashboard">
            Dashboard
          </NavLink>
          <NavLink className={linkClass} to="/vehicles">
            Vehicles
          </NavLink>
          <NavLink className={linkClass} to="/vehicles/new">
            Add Vehicle
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-right">
            <p className="text-sm font-semibold text-slate-900">{user.name || "User"}</p>
            <p className="text-xs uppercase text-slate-500">{user.role || "user"}</p>
          </div>
          <Button onClick={onLogout} type="button" variant="secondary">
            Logout
          </Button>
        </div>

        <Button className="lg:hidden" onClick={onLogout} type="button" variant="secondary">
          Logout
        </Button>
      </div>
    </header>
  );
}
