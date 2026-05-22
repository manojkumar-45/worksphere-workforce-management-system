function Table({ columns, rows, emptyText = 'No records found' }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/80">
            {rows.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr key={row.id || index} className="transition hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 text-slate-700">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
