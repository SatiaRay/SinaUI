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
    return (
      <div className="text-gray-600 dark:text-gray-400">
        هنوز هیچ یکپارچه‌سازی‌ای ساخته نشده.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {items.map((it) => {
          const isSelected = it.id === selectedId;

          return (
            <div
              key={it.id}
              onClick={() => onSelect(it)}
              className={`
                rounded-2xl border p-4 transition cursor-pointer
                ${
                  isSelected
                    ? 'border-indigo-400/60 bg-indigo-50 dark:bg-indigo-900/25 dark:border-indigo-400/30'
                    : 'border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Domain
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100 break-words">
                    {it.domain}
                  </div>
                </div>

                <span
                  className={`
                    shrink-0 text-xs font-semibold px-3 py-1 rounded-full border
                    ${
                      it.isPublic
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                    }
                  `}
                >
                  {it.isPublic ? 'عمومی' : 'خصوصی'}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Agent
                  </div>
                  <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {it.agentName}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Embed ID
                  </div>
                  <div className="mt-1 text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                    {it.embedId}
                  </div>
                </div>
              </div>

              <div
                className="mt-4 grid grid-cols-2 gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  disabled={loading}
                  onClick={() => onEdit(it)}
                  className="
                    w-full px-3 py-2 rounded-xl
                    border border-gray-300 dark:border-gray-700
                    bg-white dark:bg-gray-900
                    text-gray-800 dark:text-gray-100
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    transition disabled:opacity-60
                  "
                >
                  ویرایش
                </button>

                <button
                  disabled={loading}
                  onClick={() => onDelete(it.id)}
                  className="
                    w-full px-3 py-2 rounded-xl
                    bg-rose-600 text-white
                    hover:bg-rose-700
                    transition disabled:opacity-60
                  "
                >
                  حذف
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="hidden md:block overflow-auto rounded-2xl border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-gray-700 dark:text-gray-200">
              <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                Domain
              </th>
              <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                Agent
              </th>
              <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                Embed ID
              </th>
              <th className="text-right font-bold px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                عملیات
              </th>
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
                    ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-900/25'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900/40'
                    }
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

                  <td
                    className="px-4 py-3 border-b border-gray-200 dark:border-gray-800"
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
    </div>
  );
}
