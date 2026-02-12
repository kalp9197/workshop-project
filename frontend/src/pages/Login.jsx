import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      login({ token: data.token, user: data.user });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-500">Sign in to access your analytics dashboard.</p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-brand focus:ring"
          type="email"
          name="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-brand focus:ring"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-md bg-brand px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        New here? <Link className="font-semibold text-brand" to="/register">Create an account</Link>
      </p>
    </div>
  );
}

export default Login;
