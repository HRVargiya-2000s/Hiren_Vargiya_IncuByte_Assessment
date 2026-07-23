import { useEffect, useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Toast from "../../components/common/Toast";
import { fetchUsers, updateRole } from "../../services/authService";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Get current logged in user so we don't accidentally demote ourselves
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  function notify(message, type = "success") {
    setToast({ message, type });
  }

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setError("Unable to load users");
      notify("Unable to load users", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleToggleRole(userId, currentRole) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    
    // Prevent self-demotion
    if (userId === currentUser.id && newRole === "user") {
      notify("You cannot demote yourself from admin status!", "error");
      return;
    }

    setActionLoadingId(userId);
    try {
      await updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      notify(`User role successfully changed to ${newRole}`);
    } catch (err) {
      notify("Failed to update user role", "error");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <main className="space-y-5 px-4 py-6 sm:px-6">
      <Toast message={toast?.message} type={toast?.type} />
      
      <Card className="p-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-600">Promote or demote users between customer client and admin roles.</p>
        </div>
      </Card>

      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-center">Role</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                          : "bg-cyan-50 text-cyan-700 ring-cyan-600/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleToggleRole(user.id, user.role)}
                      type="button"
                      variant={user.role === "admin" ? "secondary" : "primary"}
                    >
                      {actionLoadingId === user.id ? (
                        "Updating..."
                      ) : user.role === "admin" ? (
                        "Demote to Customer"
                      ) : (
                        "Promote to Admin"
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500 font-medium">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
