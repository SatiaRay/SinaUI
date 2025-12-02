import React from 'react';

/**
 * Overview tab section
 */
export const OverviewSection = ({ workspace }) => {
  if (!workspace) return null;

  const rows = [
    { label: 'نام فضای کاری', value: workspace.name },
    { label: 'پلن', value: workspace.plan?.toUpperCase() },
    { label: 'تاریخ ایجاد', value: workspace.created_at },
    { label: 'نقش شما', value: roleLabel(workspace.my_role) },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-5 space-y-2">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40"
        >
          <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
            {r.label}
          </span>
          <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
            {r.value || '—'}
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * Members tab section 
 */
export const MembersSection = ({
  members = [],
  isAdmin,
  onInvite = () => {},
  onRoleChange = () => {},
  onRemove = () => {},
}) => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
    {/* Header */}
    <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h4 className="text-lg md:text-xl font-semibold">اعضا</h4>
      {isAdmin && (
        <button
          onClick={onInvite}
          className="pr-4 pl-3 py-2 md:py-3 rounded-lg font-medium transition-all
                     bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          دعوت عضو
        </button>
      )}
    </div>

    {/* Desktop table */}
    <div className="hidden md:block">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
        <thead className="bg-neutral-200 dark:bg-gray-700">
          <tr>
            {['نام', 'ایمیل', 'نقش', 'تاریخ عضویت', 'عملیات'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {members.map((m) => {
            const canEdit = isAdmin && m.role !== 'owner';
            const canRemove = isAdmin && m.role !== 'owner';

            return (
              <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                  {m.name || '—'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {m.email || '—'}
                </td>

                <td className="px-4 py-4 text-sm">
                  {canEdit ? (
                    <select
                      value={m.role}
                      onChange={(e) => onRoleChange(m.id, e.target.value)}
                      className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1
                                 bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">ادمین</option>
                      <option value="member">عضو</option>
                    </select>
                  ) : (
                    <Badge>{roleLabel(m.role)}</Badge>
                  )}
                </td>

                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-200">
                  {m.joined_at || '—'}
                </td>

                <td className="px-4 py-4 text-sm">
                  {canRemove ? (
                    <button
                      onClick={() => onRemove(m.id)}
                      className="text-red-500 hover:text-red-700 border border-red-500
                                 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      حذف
                    </button>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Mobile cards */}
    <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
      {members.map((m) => {
        const canEdit = isAdmin && m.role !== 'owner';
        const canRemove = isAdmin && m.role !== 'owner';

        return (
          <div key={m.id} className="p-3 space-y-2">
            <Row label="نام" value={m.name} />
            <Row label="ایمیل" value={m.email} />

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">نقش</span>
              {canEdit ? (
                <select
                  value={m.role}
                  onChange={(e) => onRoleChange(m.id, e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1
                             bg-white dark:bg-gray-700 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">ادمین</option>
                  <option value="member">عضو</option>
                </select>
              ) : (
                <Badge>{roleLabel(m.role)}</Badge>
              )}
            </div>

            <Row label="تاریخ عضویت" value={m.joined_at} />

            {canRemove && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onRemove(m.id)}
                  className="text-red-500 hover:text-red-700 border border-red-500
                             hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  حذف عضو
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * Billing tab placeholder
 */
export const BillingPlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-5">
    <h4 className="text-lg md:text-xl font-semibold mb-2">صورتحساب</h4>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      این بخش فعلاً در دست توسعه است.
    </p>
  </div>
);

/**
 * Danger Zone tab placeholder
 */
export const DangerZonePlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 md:p-5 border border-red-200 dark:border-red-900/40">
    <h4 className="text-lg md:text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
      بخش خطرناک
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      عملیات حساس اینجا قرار می‌گیرد.
    </p>
  </div>
);

const roleLabel = (r) =>
  r === 'owner' ? 'مالک' : r === 'admin' ? 'ادمین' : 'عضو';

const Badge = ({ children }) => (
  <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full
                   bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
    {children}
  </span>
);

const Row = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm text-gray-900 dark:text-white font-medium">
      {value || '—'}
    </span>
  </div>
);
