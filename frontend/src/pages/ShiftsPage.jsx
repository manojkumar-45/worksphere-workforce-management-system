import { useEffect, useState } from 'react';
import api from '../api/client';
import FormCard from '../components/FormCard';
import Table from '../components/Table';

function ShiftsPage() {
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '' });

  const loadData = async () => {
    const res = await api.get('/shifts');
    setShifts(res.data.data || []);
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/shifts', form);
    setForm({ name: '', startTime: '', endTime: '' });
    loadData();
  };

  return (
    <div className="page-shell">
      <section className="page-hero">
        <div className="page-hero-content flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-blue-100/75">Shift Management</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Reusable schedules with a more refined control panel.</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100/85">
              Create shift templates, define start and end windows, and monitor assignment coverage from one focused workspace.
            </p>
          </div>
          <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.24em] text-blue-100/75">Shifts</p>
            <p className="mt-2 text-2xl font-semibold">{shifts.length}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
        <FormCard title="Create shift" description="Assign reusable working schedules to employees.">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="input" placeholder="Shift name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <input className="input" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <button className="btn-primary w-full">Save shift</button>
          </form>
        </FormCard>
        <Table
          columns={[
            { key: 'name', label: 'Shift' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
            { key: 'employeeCount', label: 'Employees' },
          ]}
          rows={shifts}
        />
      </div>
    </div>
  );
}

export default ShiftsPage;

