import { NavLink } from "react-router-dom";

import Button from "./Button";

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";
  const linkClass = ({ isActive }) =>
    `relative px-4 py-3 text-base font-semibold outline-none transition after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:transition focus-visible:ring-2 focus-visible:ring-cyan-500 ${
      isActive
        ? "text-cyan-700 after:bg-cyan-600"
        : "text-slate-700 after:bg-transparent hover:text-cyan-700"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-slate-950">Car Inventory</p>
            <p className="text-xs font-medium uppercase tracking-wide text-cyan-700">
              {isAdmin ? "Dealership Admin" : "Dealership Client"}
            </p>
          </div>
          <div className="border-l border-slate-200 bg-slate-50 px-3 py-1 text-right lg:hidden">
            <p className="text-xs font-semibold text-slate-900">{user.name || "User"}</p>
            <p className="text-[11px] uppercase text-slate-500">{user.role || "user"}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1 border-y border-slate-200 bg-white lg:border-y-0">
          {isAdmin && (
            <NavLink className={linkClass} to="/dashboard">
              Dashboard
            </NavLink>
          )}
          <NavLink className={linkClass} to="/catalog">
            {isAdmin ? "User View" : "Catalog"}
          </NavLink>
          {isAdmin && (
            <>
              <NavLink className={linkClass} to="/vehicles">
                Vehicles
              </NavLink>
              <NavLink className={linkClass} to="/vehicles/new">
                Add Vehicle
              </NavLink>
              <NavLink className={linkClass} to="/users">
                Users
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="border-l border-slate-200 bg-slate-50 px-4 py-1.5 text-right">
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
