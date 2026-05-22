import { useEffect, useState } from 'react';
import api from '../api/client';
import FormCard from '../components/FormCard';
import Table from '../components/Table';
import { formatCurrency } from '../utils/formatters';

const initialForm = { name: '', email: '', phone: '', roleTitle: '', salary: '', role: 'EMPLOYEE', departmentId: '', shiftId: '', password: '' };

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const [employeeRes, departmentRes, shiftRes] = await Promise.all([
      api.get('/employees', { params: { search, size: 50 } }),
      api.get('/departments'),
      api.get('/shifts'),
    ]);
    setEmployees(employeeRes.data.data.content || []);
    setDepartments(departmentRes.data.data || []);
    setShifts(shiftRes.data.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      salary: Number(form.salary),
      departmentId: form.departmentId ? Number(form.departmentId) : null,
      shiftId: form.shiftId ? Number(form.shiftId) : null,
      password: form.password || null,
    };
    if (editingId) {
      await api.put(`/employees/${editingId}`, payload);
    } else {
      await api.post('/employees', payload);
    }
    setForm(initialForm);
    setEditingId(null);
    loadData();
  };

  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      roleTitle: employee.roleTitle,
      salary: employee.salary,
      role: employee.role,
      departmentId: employee.departmentId || '',
      shiftId: employee.shiftId || '',
      password: '',
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/employees/${id}`);
    loadData();
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-content flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">People Directory</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Manage workforce records with a cleaner admin workflow.</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100/85">
              Create profiles, update assignments, connect departments and shifts, and keep employee data organized from one modern console.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Employees</p>
              <p className="mt-2 text-2xl font-semibold">{employees.length}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Departments</p>
              <p className="mt-2 text-2xl font-semibold">{departments.length}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[380px,1fr]">
        <FormCard title={editingId ? 'Update employee' : 'Add employee'} description="Manage employee records, departments, and role assignments.">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="Role title" value={form.roleTitle} onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} />
            <input className="input" placeholder="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select className="input" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })}>
              <option value="">Department</option>
              {departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="input" value={form.shiftId} onChange={(e) => setForm({ ...form, shiftId: e.target.value })}>
              <option value="">Shift</option>
              {shifts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <input className="input" placeholder={editingId ? 'New password (optional)' : 'Password'} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div className="flex gap-3">
              <button className="btn-primary flex-1">{editingId ? 'Update' : 'Create'}</button>
              <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>Reset</button>
            </div>
          </form>
        </FormCard>
        <div className="space-y-4">
          <div className="card p-4">
            <p className="section-title">Search</p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Find an employee quickly</h3>
            <input className="input" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={loadData} />
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'roleTitle', label: 'Job Role' },
              { key: 'departmentName', label: 'Department' },
              { key: 'salary', label: 'Salary', render: (row) => formatCurrency(row.salary) },
              { key: 'actions', label: 'Actions', render: (row) => <div className="flex gap-2"><button className="text-brand-600" onClick={() => handleEdit(row)}>Edit</button><button className="text-rose-600" onClick={() => handleDelete(row.id)}>Delete</button></div> },
            ]}
            rows={employees}
          />
        </div>
      </div>
    </div>
  );
}

export default EmployeesPage;

