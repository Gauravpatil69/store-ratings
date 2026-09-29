import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Table({ columns, rows, sort, onSort }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-border border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={`px-4 py-3 font-semibold ${
                  col.sortable ? 'cursor-pointer select-none' : ''
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{col.label}</span>
                  {col.sortable &&
                    sort?.field === col.key &&
                    (sort.order === 'asc' ? (
                      <ChevronUpIcon className="size-4" />
                    ) : (
                      <ChevronDownIcon className="size-4" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-muted py-6 text-center">
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id || idx} className="border-border border-b">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
