function StatCard({ label, value, helper }) {
  return (
    <div className="card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
      {helper && <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>}
    </div>
  );
}

export default StatCard;
