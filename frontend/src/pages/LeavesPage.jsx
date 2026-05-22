import { useEffect, useState } from 'react';
import api from '../api/client';
import FormCard from '../components/FormCard';
import Table from '../components/Table';
import { useAuth } from '../context/AuthContext';
import { formatDate, formatDateTime } from '../utils/formatters';

const initialForm = { leaveType: '', startDate: '', endDate: '', reason: '' };

function LeavesPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [leaves, setLeaves] = useState([]);
  const isEmployee = user?.role === 'EMPLOYEE';

  const loadData = async () => {
    const endpoint = user?.role === 'EMPLOYEE' ? '/leaves/me' : '/leaves';
    const res = await api.get(endpoint, { params: { size: 50 } });
    setLeaves(res.data.data.content || []);
  };

  useEffect(() => { if (user) loadData(); }, [user]);

  const submitLeave = async (e) => {
    e.preventDefault();
    await api.post('/leaves', form);
    setForm(initialForm);
    loadData();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/leaves/${id}/status`, { status });
    loadData();
  };

  const pendingLeaves = leaves.filter((leave) => leave.status === 'PENDING').length;
  const approvedLeaves = leaves.filter((leave) => leave.status === 'APPROVED').length;
  const rejectedLeaves = leaves.filter((leave) => leave.status === 'REJECTED').length;
  const latestLeave = leaves[0];

  return (
    <div className="page-shell">
      {isEmployee ? (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Pending</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{pendingLeaves}</p>
              <p className="mt-1 text-sm text-slate-500">Requests still under review.</p>
            </div>
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Approved</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{approvedLeaves}</p>
              <p className="mt-1 text-sm text-slate-500">Time-off requests accepted so far.</p>
            </div>
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Latest Update</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {latestLeave ? latestLeave.status : '--'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {latestLeave ? formatDate(latestLeave.startDate) : 'No leave request yet'}
              </p>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
            <div className="card overflow-hidden">
              <div className="flex min-h-[112px] flex-col justify-end border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 sm:px-6">
                <p className="section-title">Leave Request</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Create a new time-off request</h3>
              </div>
              <div className="p-5 sm:p-6">
                <form className="grid gap-4 md:grid-cols-2" onSubmit={submitLeave}>
                  <input className="input" placeholder="Leave type" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} />
                  <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  <input className="input md:col-span-2" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  <textarea className="input md:col-span-2 min-h-[140px]" rows="5" placeholder="Reason for leave" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                  <button className="btn-primary md:col-span-2">Submit leave request</button>
                </form>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="card p-5 sm:p-6">
                <p className="section-title">Approval Summary</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Decision breakdown</h3>
                <div className="mt-5 space-y-4">
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">Approved</p>
                    <p className="mt-2 text-3xl font-semibold text-emerald-900">{approvedLeaves}</p>
                    <p className="mt-1 text-sm text-emerald-800/80">Requests accepted by the manager.</p>
                  </div>
                  <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-700">Rejected</p>
                    <p className="mt-2 text-3xl font-semibold text-rose-900">{rejectedLeaves}</p>
                    <p className="mt-1 text-sm text-rose-800/80">Requests that were not approved.</p>
                  </div>
                </div>
              </div>

              <div className="card p-5 sm:p-6">
                <p className="section-title">Latest Status</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  {latestLeave ? latestLeave.status : 'No requests yet'}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {latestLeave
                    ? `Most recent leave request starts on ${formatDate(latestLeave.startDate)} and is currently marked as ${latestLeave.status.toLowerCase()}.`
                    : 'Your upcoming leave requests will appear here once you submit one.'}
                </p>
              </div>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex min-h-[112px] flex-col justify-end border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 sm:px-6">
              <p className="section-title">Leave History</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Your request timeline</h3>
            </div>
            <Table
              columns={[
                { key: 'leaveType', label: 'Leave Type' },
                { key: 'startDate', label: 'Start', render: (row) => formatDate(row.startDate) },
                { key: 'endDate', label: 'End', render: (row) => formatDate(row.endDate) },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => {
                    const tone = row.status === 'APPROVED'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : row.status === 'REJECTED'
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700';
                    return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>{row.status}</span>;
                  },
                },
                { key: 'appliedAt', label: 'Applied', render: (row) => formatDateTime(row.appliedAt) },
              ]}
              rows={leaves}
            />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Total Requests</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{leaves.length}</p>
              <p className="mt-1 text-sm text-slate-500">All leave requests in this view.</p>
            </div>
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Pending</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{pendingLeaves}</p>
              <p className="mt-1 text-sm text-slate-500">Requests awaiting admin action.</p>
            </div>
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Approved</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{approvedLeaves}</p>
              <p className="mt-1 text-sm text-slate-500">Requests already approved.</p>
            </div>
            <div className="card p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Rejected</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{rejectedLeaves}</p>
              <p className="mt-1 text-sm text-slate-500">Requests that were declined.</p>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="flex min-h-[112px] flex-col justify-end border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-5 py-4 sm:px-6">
              <p className="section-title">Leave Requests</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">Employee leave review</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review requests, check current status, and take action only on pending submissions.
              </p>
            </div>
            <Table
              columns={[
                { key: 'employeeName', label: 'Employee' },
                { key: 'leaveType', label: 'Leave Type' },
                { key: 'startDate', label: 'Start', render: (row) => formatDate(row.startDate) },
                { key: 'endDate', label: 'End', render: (row) => formatDate(row.endDate) },
                {
                  key: 'status',
                  label: 'Status',
                  render: (row) => {
                    const tone = row.status === 'APPROVED'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : row.status === 'REJECTED'
                        ? 'border-rose-200 bg-rose-50 text-rose-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700';
                    return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>{row.status}</span>;
                  },
                },
                { key: 'appliedAt', label: 'Applied', render: (row) => formatDateTime(row.appliedAt) },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (row) => {
                    if (row.status === 'APPROVED') {
                      return (
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                          Approved
                        </span>
                      );
                    }

                    if (row.status === 'REJECTED') {
                      return (
                        <span className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                          Rejected
                        </span>
                      );
                    }

                    return (
                      <div className="flex gap-3">
                        <button className="font-medium text-emerald-600" onClick={() => updateStatus(row.id, 'APPROVED')}>
                          Approve
                        </button>
                        <button className="font-medium text-rose-600" onClick={() => updateStatus(row.id, 'REJECTED')}>
                          Reject
                        </button>
                      </div>
                    );
                  },
                },
              ]}
              rows={leaves}
            />
          </section>
        </>
      )}
    </div>
  );
}

export default LeavesPage;
