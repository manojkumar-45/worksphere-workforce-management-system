import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, BarElement, Tooltip } from 'chart.js';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { formatCurrency } from '../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

function DashboardPage() {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);

  useEffect(() => {
    if (user?.role === 'ADMIN' || user?.role === 'HR') {
      api.get('/dashboard/admin').then((res) => setAdminData(res.data.data));
    } else {
      api.get('/api/dashboard/employee').then((res) => setEmployeeData(res.data.data));
    }
  }, [user]);

  if (user?.role === 'ADMIN' || user?.role === 'HR') {
    const departmentChart = adminData ? {
      labels: adminData.employeesByDepartment.map((item) => item.label),
      datasets: [{ label: 'Employees', data: adminData.employeesByDepartment.map((item) => item.value), backgroundColor: '#2563eb' }],
    } : null;

    const attendanceChart = adminData ? {
      labels: adminData.monthlyAttendanceTrend.map((item) => item.label),
      datasets: [{ label: 'Attendance Entries', data: adminData.monthlyAttendanceTrend.map((item) => item.value), borderColor: '#0f172a', backgroundColor: '#93c5fd' }],
    } : null;

    return (
      <div className="page-shell">
        <section className="page-hero">
          <div className="page-hero-content flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">Executive Overview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Operational visibility across people, attendance, and leave.</h2>
              <p className="mt-3 text-sm leading-7 text-blue-100/85">
                Review workforce activity, department strength, and attendance patterns from a cleaner leadership dashboard.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Coverage</p>
                <p className="mt-2 text-2xl font-semibold">{adminData?.todayAttendance ?? '-'}</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Team Count</p>
                <p className="mt-2 text-2xl font-semibold">{adminData?.totalEmployees ?? '-'}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Employees" value={adminData?.totalEmployees ?? '-'} />
          <StatCard label="Today Attendance" value={adminData?.todayAttendance ?? '-'} />
          <StatCard label="Pending Leaves" value={adminData?.pendingLeaves ?? '-'} helper={`Approved: ${adminData?.approvedLeaves ?? '-'}`} />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card p-6">
            <p className="section-title">Departments</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Headcount distribution</h3>
            <div className="mt-6">{departmentChart && <Bar data={departmentChart} />}</div>
          </div>
          <div className="card p-6">
            <p className="section-title">Attendance Trend</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Monthly workforce rhythm</h3>
            <div className="mt-6">{attendanceChart && <Line data={attendanceChart} />}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-content flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">Personal Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Your workday essentials in one place.</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100/85">
              Track attendance records, pending leave requests, assigned shift information, and the latest salary snapshot.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Assigned Shift</p>
            <p className="mt-2 text-2xl font-semibold">{employeeData?.shiftName ?? '-'}</p>
          </div>
        </div>
      </section>

      <div className="data-grid">
        <StatCard label="Attendance Records" value={employeeData?.attendanceCount ?? '-'} />
        <StatCard label="Pending Leaves" value={employeeData?.pendingLeaves ?? '-'} />
        <StatCard label="Assigned Shift" value={employeeData?.shiftName ?? '-'} />
        <StatCard label="Latest Salary" value={employeeData?.latestNetSalary ? formatCurrency(employeeData.latestNetSalary) : '-'} helper={employeeData?.latestPayrollMonth || 'No payroll yet'} />
      </div>
    </div>
  );
}

export default DashboardPage;
