import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { loginUser } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email.trim() || !password) {
        setError("Email and password are required");
        return;
      }

      const data = await loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/catalog");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="text-sm text-slate-600">Access your inventory dashboard.</p>
        </div>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" type="submit">Login</Button>
        <p className="text-center text-sm text-slate-600">
          Need an account? <Link className="font-medium text-slate-900" to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
