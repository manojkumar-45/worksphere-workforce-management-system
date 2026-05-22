import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees', roles: ['ADMIN', 'HR'] },
  { to: '/attendance', label: 'Attendance' },
  { to: '/leaves', label: 'Leaves' },
  { to: '/payroll', label: 'Payroll' },
  { to: '/shifts', label: 'Shifts', roles: ['ADMIN', 'HR'] },
];

function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1520px] flex-col px-4 py-5 lg:flex-row lg:gap-6 lg:px-6">
        <aside className="glass-note mb-6 w-full p-5 lg:sticky lg:top-5 lg:mb-0 lg:w-80 lg:self-start">
          <div className="rounded-[28px] bg-[linear-gradient(145deg,#0f1728_0%,#183a88_54%,#1f7aff_100%)] p-5 text-white shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/85">WMS Console</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Workforce Hub</h1>
            <p className="mt-2 text-sm leading-6 text-blue-100/85">
              Operations, attendance, payroll, and people workflows from one modern control room.
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/90 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Signed in as</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name}</p>
            <p className="mt-1 text-sm text-slate-500">{user?.role}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {navItems
              .filter((item) => !item.roles || item.roles.includes(user?.role))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group block rounded-2xl px-4 py-3.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[linear-gradient(135deg,#0f5ae0_0%,#1f7aff_70%,#56b6ff_100%)] text-white shadow-glow'
                        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="flex items-center justify-between">
                    {item.label}
                    <span className="text-xs uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100">
                      View
                    </span>
                  </span>
                </NavLink>
              ))}
          </nav>

          <button className="btn-secondary mt-8 w-full" onClick={logout}>Logout</button>
        </aside>

        <main className="flex-1">
          <div className="glass-note mb-6 overflow-hidden px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Role-based workforce management dashboard</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back, {user?.name}
                </h2>
            
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]  text-slate-400">Access</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{user?.role}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Active Session</p>
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
