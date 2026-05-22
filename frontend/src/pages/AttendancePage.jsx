import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatDateTime, formatMinutes } from "../utils/formatters";

const getDateKey = (value) => {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
};

function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadData = async () => {
    const endpoint =
      user?.role === "EMPLOYEE" ? "/api/attendance/me" : "/api/attendance";
    const res = await api.get(endpoint, { params: { size: 50 } });
    setRecords(res.data.data.content || []);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((record) => getDateKey(record.date) === todayKey);
  const hasCheckedInToday = Boolean(todayRecord?.checkInTime);
  const hasCheckedOutToday = Boolean(todayRecord?.checkOutTime);
  const monthPrefix = todayKey.slice(0, 7);
  const monthRecords = records.filter((record) => getDateKey(record.date).startsWith(monthPrefix));
  const monthWorkingMinutes = monthRecords.reduce(
    (total, record) => total + (record.totalWorkingMinutes || 0),
    0
  );
  const completedShifts = monthRecords.filter((record) => record.checkInTime && record.checkOutTime).length;
  const pendingShifts = monthRecords.filter((record) => record.checkInTime && !record.checkOutTime).length;
  const attendanceStatus = hasCheckedOutToday
    ? "Completed for today"
    : hasCheckedInToday
      ? "Checked in"
      : "Awaiting check-in";
  const statusTone = hasCheckedOutToday
    ? "emerald"
    : hasCheckedInToday
      ? "amber"
      : "slate";
  const todayHours = todayRecord?.totalWorkingMinutes ?? null;

  const runAttendanceAction = async (path) => {
    setIsSubmitting(true);
    setActionError("");

    try {
      await api.post(path);
      await loadData();
    } catch (error) {
      setActionError(error.message || "Unable to update attendance right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkIn = async () => {
    if (hasCheckedInToday) {
      setActionError("You have already checked in today.");
      return;
    }

    await runAttendanceAction("/attendance/check-in");
  };

  const checkOut = async () => {
    if (!hasCheckedInToday) {
      setActionError("You need to check in before checking out.");
      return;
    }

    if (hasCheckedOutToday) {
      setActionError("You have already checked out today.");
      return;
    }

    await runAttendanceAction("/attendance/check-out");
  };

  const statusBadgeClassName = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  }[statusTone];

  const actionMessage = actionError
    ? actionError
    : hasCheckedOutToday
      ? "Your attendance for today is complete."
      : hasCheckedInToday
        ? "You are currently checked in. Check out when your shift ends."
        : "Start your day by checking in when you're ready.";
  const isEmployee = user?.role === "EMPLOYEE";

  return (
    <div className="page-shell">
      {isEmployee ? (
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#183a88_48%,#38bdf8_100%)] px-6 py-6 text-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.65)] sm:px-8">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_45%)] lg:block" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">
                Attendance
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2.4rem]">
                Track today&apos;s shift clearly.
              </h2>
              <div className="mt-5 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/95 backdrop-blur">
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-current" />
                {attendanceStatus}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <span className="text-xs uppercase tracking-[0.22em] text-sky-100/70">Today</span>
                  <div className="mt-2 text-2xl font-semibold">
                    {todayHours !== null ? formatMinutes(todayHours) : "0h 0m"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <span className="text-xs uppercase tracking-[0.22em] text-sky-100/70">This Month</span>
                  <div className="mt-2 text-2xl font-semibold">{formatMinutes(monthWorkingMinutes)}</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <span className="text-xs uppercase tracking-[0.22em] text-sky-100/70">Completed</span>
                  <div className="mt-2 text-2xl font-semibold">{completedShifts}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.28)]">
            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-5 py-4">
              <p className="section-title">Action Center</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">Check in or check out</h3>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  className="group rounded-2xl bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_55%,#38bdf8_100%)] px-5 py-4 text-left text-white shadow-[0_20px_35px_-22px_rgba(37,99,235,0.95)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={checkIn}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/85">
                    Check In
                  </span>
                  <span className="mt-2 block text-lg font-semibold">
                    {todayRecord?.checkInTime
                      ? new Date(todayRecord.checkInTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : isSubmitting
                        ? "Saving..."
                        : "Start shift"}
                  </span>
                </button>
                <button
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-left text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSubmitting}
                  onClick={checkOut}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Check Out
                  </span>
                  <span className="mt-2 block text-lg font-semibold">
                    {todayRecord?.checkOutTime
                      ? new Date(todayRecord.checkOutTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Close shift"}
                  </span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Current State
                  </span>
                  <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusBadgeClassName}`}>
                    {attendanceStatus}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pending Closures
                  </span>
                  <div className="mt-3 text-2xl font-semibold text-slate-900">{pendingShifts}</div>
                </div>
              </div>

              {(actionError || actionMessage) ? (
                <div className={`rounded-2xl border px-4 py-3 text-sm ${actionError ? "border-rose-200 bg-rose-50 text-rose-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                  {actionMessage}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_55%,#38bdf8_100%)] px-6 py-7 text-white shadow-[0_24px_70px_-28px_rgba(15,23,42,0.65)] sm:px-8">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_45%)] lg:block" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-100/80">
                Attendance Operations
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Workforce time tracking with a cleaner operational view.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-sky-100/70">Today</p>
                <p className="mt-2 text-2xl font-semibold">{attendanceStatus}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-sky-100/70">This Month</p>
                <p className="mt-2 text-2xl font-semibold">{formatMinutes(monthWorkingMinutes)}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-sky-100/70">Shift Closure</p>
                <p className="mt-2 text-2xl font-semibold">{completedShifts}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {!isEmployee ? (
        <section className="grid gap-4 lg:grid-cols-[1.45fr_0.95fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.28)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Daily Status
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                  Today&apos;s attendance at a glance
                </h3>
              </div>
              <div
                className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${statusBadgeClassName}`}
              >
                <span className="mr-2 h-2.5 w-2.5 rounded-full bg-current" />
                {attendanceStatus}
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Check In
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {todayRecord?.checkInTime
                    ? new Date(todayRecord.checkInTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {todayRecord?.checkInTime ? formatDateTime(todayRecord.checkInTime) : "Not recorded yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Check Out
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {todayRecord?.checkOutTime
                    ? new Date(todayRecord.checkOutTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {todayRecord?.checkOutTime ? formatDateTime(todayRecord.checkOutTime) : "Shift still active"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Working Hours
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                  {todayHours !== null ? formatMinutes(todayHours) : "0h 0m"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {hasCheckedOutToday ? "Finalized for today" : "Updates when your shift closes"}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.28)]">
            <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
                Action Center
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Attendance controls</h3>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                Attendance actions are available only for employees. Managers can review attendance
                history and monitor operational trends from the records below.
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={`grid gap-4 ${isEmployee ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_45px_-32px_rgba(15,23,42,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Total Records
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{records.length}</p>
          <p className="mt-1 text-sm text-slate-500">Attendance entries loaded in this view.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_45px_-32px_rgba(15,23,42,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Active Shift
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {hasCheckedInToday && !hasCheckedOutToday ? "Open" : "Closed"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasCheckedInToday && !hasCheckedOutToday
              ? "One shift is currently in progress."
              : "No running shift for the current day."}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_45px_-32px_rgba(15,23,42,0.3)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Latest Date
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {records[0]?.date ? formatDate(records[0].date) : "--"}
          </p>
          <p className="mt-1 text-sm text-slate-500">Most recent attendance entry on record.</p>
        </div>
        {isEmployee ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_14px_45px_-32px_rgba(15,23,42,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Pending Closures
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{pendingShifts}</p>
            <p className="mt-1 text-sm text-slate-500">Shifts that still need a check out.</p>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_-34px_rgba(15,23,42,0.35)]">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
              Attendance History
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Shift records and timelines</h3>
          </div>
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            {records.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50/90 text-slate-500">
              <tr>
                {user?.role !== "EMPLOYEE" ? (
                  <th className="px-6 py-4 text-left font-semibold">Employee</th>
                ) : null}
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Check In</th>
                <th className="px-6 py-4 text-left font-semibold">Check Out</th>
                <th className="px-6 py-4 text-left font-semibold">Hours</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-14 text-center text-sm text-slate-500"
                    colSpan={user?.role !== "EMPLOYEE" ? 6 : 5}
                  >
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((row, index) => {
                  const rowCheckedIn = Boolean(row.checkInTime);
                  const rowCheckedOut = Boolean(row.checkOutTime);
                  const rowStatus = rowCheckedOut
                    ? "Completed"
                    : rowCheckedIn
                      ? "In Progress"
                      : "Pending";
                  const rowStatusClassName = rowCheckedOut
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : rowCheckedIn
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-slate-200 bg-slate-100 text-slate-700";

                  return (
                    <tr
                      key={row.id || index}
                      className="transition hover:bg-slate-50/80"
                    >
                      {user?.role !== "EMPLOYEE" ? (
                        <td className="px-6 py-4 font-medium text-slate-800">{row.employeeName}</td>
                      ) : null}
                      <td className="px-6 py-4 text-slate-700">{formatDate(row.date)}</td>
                      <td className="px-6 py-4 text-slate-700">{formatDateTime(row.checkInTime)}</td>
                      <td className="px-6 py-4 text-slate-700">{formatDateTime(row.checkOutTime)}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {formatMinutes(row.totalWorkingMinutes)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${rowStatusClassName}`}
                        >
                          {rowStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AttendancePage;
