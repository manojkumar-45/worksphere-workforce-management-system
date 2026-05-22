function FormCard({ title, description, children }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-5">
        <p className="section-title">Workspace Form</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default FormCard;
