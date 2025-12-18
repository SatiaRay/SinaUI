import React from 'react';

export default function IntegrationsList({
  items,
  loading,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
}) {
  if (!items?.length) {
    return <div className="text-gray-600 dark:text-gray-400">هنوز چیزی ساخته نشده.</div>;
  }

  return (
    <div className="overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr className="text-gray-700 dark:text-gray-200">
            <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">Domain</th>
            <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">Agent</th>
            <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">Embed ID</th>
            <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">عملیات</th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900">
          {items.map((it) => {
            const isSelected = it.id === selectedId;
            return (
              <tr
                key={it.id}
                onClick={() => onSelect(it)}
                className={`
                  cursor-pointer transition
                  ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/25' : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'}
                `}
              >
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100">
                  {it.domain}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100">
                  {it.agentName}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 break-all">
                  {it.embedId}
                </td>
                <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-800"
                    onClick={(e) => e.stopPropagation()}
                    >
                    <div className="flex flex-wrap gap-2 justify-start">
                        <button
                        disabled={loading}
                        onClick={() => onEdit(it)}
                        className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-60"
                        >
                        ویرایش
                        </button>

                        <button
                        disabled={loading}
                        onClick={() => onDelete(it.id)}
                        className="px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition disabled:opacity-60"
                        >
                        حذف
                        </button>
                    </div>
                    </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
