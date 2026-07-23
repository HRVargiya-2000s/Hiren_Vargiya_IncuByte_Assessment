import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "../components/common/Navbar";

export default function AdminLayout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onLogout={logout} />
      <div className="mx-auto max-w-7xl">
        <Outlet />
      </div>
    </div>
  );
}
