import { useEffect, useState } from 'react';
import api from '../api/client';
import FormCard from '../components/FormCard';
import Table from '../components/Table';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';

function PayrollPage() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', payrollMonth: '' });

  const loadData = async () => {
    const endpoint = user?.role === 'EMPLOYEE' ? '/payroll/me' : '/payroll';
    const [payrollRes, employeeRes] = await Promise.all([
      api.get(endpoint, { params: { size: 50 } }),
      user?.role === 'EMPLOYEE' ? Promise.resolve({ data: { data: { content: [] } } }) : api.get('/employees', { params: { size: 100 } }),
    ]);
    setPayrolls(payrollRes.data.data.content || []);
    setEmployees(employeeRes.data.data.content || []);
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const generatePayroll = async (e) => {
    e.preventDefault();
    await api.post('/payroll/generate', { employeeId: Number(form.employeeId), payrollMonth: form.payrollMonth });
    setForm({ employeeId: '', payrollMonth: '' });
    loadData();
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-content flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">Payroll Workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Compensation records with a cleaner monthly flow.</h2>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Payroll Entries</p>
            <p className="mt-2 text-2xl font-semibold">{payrolls.length}</p>
          </div>
        </div>
      </section>

      {(user?.role === 'ADMIN' || user?.role === 'HR') && (
        <FormCard title="Generate payroll" description="Monthly payroll generation prevents duplicates for the same employee and month.">
          <form className="grid gap-4 md:grid-cols-3" onSubmit={generatePayroll}>
            <select className="input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
            </select>
            <input className="input" type="month" value={form.payrollMonth} onChange={(e) => setForm({ ...form, payrollMonth: e.target.value })} />
            <button className="btn-primary">Generate</button>
          </form>
        </FormCard>
      )}
      <Table
        columns={[
          ...(user?.role !== 'EMPLOYEE' ? [{ key: 'employeeName', label: 'Employee' }] : []),
          { key: 'payrollMonth', label: 'Month' },
          { key: 'basicSalary', label: 'Basic', render: (row) => formatCurrency(row.basicSalary) },
          { key: 'totalDeductions', label: 'Deductions', render: (row) => formatCurrency(row.totalDeductions) },
          { key: 'netSalary', label: 'Net Salary', render: (row) => formatCurrency(row.netSalary) },
        ]}
        rows={payrolls}
      />
    </div>
  );
}

export default PayrollPage;

