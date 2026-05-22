import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', roleTitle: '', salary: '', password: '', role: 'EMPLOYEE', departmentId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data.data || [])).catch(() => setDepartments([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({ ...form, role: 'EMPLOYEE', salary: Number(form.salary), departmentId: form.departmentId ? Number(form.departmentId) : null });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f1728_0%,#153872_42%,#1f7aff_70%,#d7f0ff_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_24%)]" />
      <div className="relative glass-note w-full max-w-4xl rounded-[36px] p-8 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-600">Employee Access</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Join the workforce workspace with a cleaner onboarding flow for new employees.
            </p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4">
                <p className="text-sm font-medium text-slate-900">Professional profile setup</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add department, role title, and compensation details in one guided form.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50/90 p-4">
                <p className="text-sm font-medium text-slate-900">Quick access after approval</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Once registered, you can access attendance, leave, payroll, and shift data immediately.
                </p>
              </div>
            </div>
          </div>

          <div>
            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input" placeholder="Job role" value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} />
              <input className="input" placeholder="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <select className="input md:col-span-2" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
                <option value="">Select department</option>
                {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
              </select>
              {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-2">{error}</p>}
              <button className="btn-primary md:col-span-2">Register</button>
            </form>
            <p className="mt-6 text-sm text-slate-500">
              Already have an account? <Link className="font-semibold text-brand-600" to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

