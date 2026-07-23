import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AddVehicle from "../pages/admin/AddVehicle";
import Dashboard from "../pages/admin/Dashboard";
import EditVehicle from "../pages/admin/EditVehicle";
import ManageVehicles from "../pages/admin/ManageVehicles";
import ManageUsers from "../pages/admin/ManageUsers";
import Home from "../pages/user/Home";
import VehicleDetails from "../pages/user/VehicleDetails";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin-only routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<ManageVehicles />} />
          <Route path="/vehicles/new" element={<AddVehicle />} />
          <Route path="/vehicles/:id/edit" element={<EditVehicle />} />
          <Route path="/users" element={<ManageUsers />} />
        </Route>

        {/* Customer & admin accessible routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["admin", "user"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/catalog" element={<Home />} />
          <Route path="/catalog/:id" element={<VehicleDetails />} />
        </Route>

        <Route
          path="*"
          element={
            <NotFound />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
