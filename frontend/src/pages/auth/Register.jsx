import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { registerUser } from "../../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setSuccess("Registration successful. Redirecting to login.");
      setTimeout(() => navigate("/login"), 300);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
          <p className="text-sm text-slate-600">Create your dealership account.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}
        <Input id="name" label="Name" value={form.name} onChange={(event) => updateField("name", event.target.value)} />
        <Input id="email" label="Email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
        <Input id="password" label="Password" type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} />
        <Input id="confirmPassword" label="Confirm Password" type="password" value={form.confirmPassword} onChange={(event) => updateField("confirmPassword", event.target.value)} />
        <Button className="w-full" type="submit">Register</Button>
        <p className="text-center text-sm text-slate-600">
          Already registered? <Link className="font-medium text-slate-900" to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
