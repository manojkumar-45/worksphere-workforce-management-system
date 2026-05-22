import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f1728_0%,#163b8e_45%,#1f7aff_72%,#8ad7ff_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_24%)]" />
      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden rounded-[36px] border border-white/15 bg-white/10 p-8 text-white shadow-soft backdrop-blur lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-blue-100/85">WMS Platform</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight tracking-tight">
            People operations with a sharper, calmer command center.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-blue-100/82">
            Track employees, attendance, payroll, shifts, and leave workflows in a modern workspace
            built for daily operations.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-medium text-blue-100/75">Attendance flow</p>
              <p className="mt-2 text-2xl font-semibold">Real-time status</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-medium text-blue-100/75">Operations</p>
              <p className="mt-2 text-2xl font-semibold">One unified dashboard</p>
            </div>
          </div>
        </div>

        <div className="glass-note w-full rounded-[36px] p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">WMS Access</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Sign in</h2>
          {/* <p className="mt-3 text-sm leading-6 text-slate-500">
            Use `admin@wms.com / Admin@123` or `employee@wms.com / Employee@123`
            after the backend seeds data.
          </p> */}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            New here?{' '}
            <Link className="font-semibold text-brand-600" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
