import React, { useMemo, useState } from 'react';
import {
  UserPlus,
  Shield,
  CalendarDays,
  Layers3,
  UserCheck,
} from 'lucide-react';
import { GoPlusCircle } from 'react-icons/go';

/**
 * Tabs config
 */
export const TABS = [
  { key: 'overview', label: 'نمای کلی' },
  { key: 'members', label: 'اعضا' },
  { key: 'billing', label: 'صورتحساب' },
  { key: 'danger', label: 'بخش خطرناک' },
];

/**
 * InfoRow 
 */
export const InfoRow = ({ label, value, variant = 'default', icon }) => {
  const valueNode =
    variant === 'badge-blue' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                       bg-blue-50 text-blue-700 border border-blue-100
                       dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800/50">
        {value || '—'}
      </span>
    ) : variant === 'badge-gray' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold
                       bg-gray-100 text-gray-800 border border-gray-200
                       dark:bg-gray-700/50 dark:text-gray-100 dark:border-gray-600">
        {value || '—'}
      </span>
    ) : (
      <span className="text-base md:text-lg font-extrabold text-gray-900 dark:text-white">
        {value || '—'}
      </span>
    );

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                    bg-white/70 dark:bg-gray-800/50
                    border border-gray-200/70 dark:border-gray-700/60
                    hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-2">
        {icon && (
          <span className="w-8 h-8 flex items-center justify-center rounded-lg
                           bg-gray-100 dark:bg-gray-700/60 text-gray-500 dark:text-gray-200">
            {icon}
          </span>
        )}
        <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </span>
      </div>
      {valueNode}
    </div>
  );
};

/**
 * Overview tab section
 */
export const OverviewSection = ({ workspace }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6
                  border border-gray-200 dark:border-gray-700">
    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
        <Layers3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      اطلاعات فضای کاری
    </h4>

    <div className="grid grid-cols-1 gap-3">
      <InfoRow
        label="نام فضای کاری"
        value={workspace.name}
        icon={<Shield className="w-4 h-4" />}
      />
      <InfoRow
        label="پلن"
        value={workspace.plan?.toUpperCase()}
        variant="badge-blue"
        icon={<Layers3 className="w-4 h-4" />}
      />
      <InfoRow
        label="تاریخ ایجاد"
        value={workspace.created_at}
        icon={<CalendarDays className="w-4 h-4" />}
      />
      <InfoRow
        label="نقش شما"
        value={workspace.my_role === 'owner' ? 'مالک' : workspace.my_role}
        variant="badge-gray"
        icon={<UserCheck className="w-4 h-4" />}
      />
    </div>
  </div>
);

/**
 * Members tab section
 */
export const MembersSection = ({ members = [], workspace, setMembers }) => {
  const isAdmin =
    workspace?.my_role === 'owner' || workspace?.my_role === 'admin';

  const [search, setSearch] = useState('');

  const filteredMembers = useMemo(() => {
    if (!search.trim()) return members;
    const q = search.toLowerCase();
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q)
    );
  }, [members, search]);

  /**
   * initials avatar 
   */
  const initials = (name = '') => {
    const parts = name.trim().split(' ');
    return (
      (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
    ).toUpperCase() || 'U';
  };

  /**
   * Mock handlers (no api yet)
   */
  const handleInvite = () => {};
  const handleRoleChange = () => {};
  const handleRemove = () => {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6
                    border border-gray-200 dark:border-gray-700">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          اعضای فضای کاری
        </h4>

        {isAdmin && (
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl
                       font-medium transition-all duration-200 shadow-lg hover:shadow-xl
                       inline-flex items-center gap-2 flex-row-reverse"
          >
            دعوت عضو جدید
            <GoPlusCircle size={22} className="box-content" />
          </button>
        )}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجوی عضو..."
        className="w-full sm:w-72 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
      />

      {/* Members list */}
      <div className="grid grid-cols-1 gap-3">
        {filteredMembers.map((m) => (
          <div
            key={m.id}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl border
                      border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                      hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
          >
            {/* Right: avatar + name/email */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold
                          bg-blue-50 text-blue-600 border border-blue-100
                          dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/40
                          flex-shrink-0"
              >
                {initials(m.name)}
              </div>
          
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm md:text-[15px] font-bold text-gray-900 dark:text-white truncate">
                    {m.name || '—'}
                  </p>
                  {m.role === 'owner' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full
                                    bg-blue-100 text-blue-700
                                    dark:bg-blue-900/30 dark:text-blue-200">
                      مالک
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {m.email}
                </p>
              </div>
            </div>
          
            {/* meta */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold leading-none
                              bg-gray-100 text-gray-800
                              dark:bg-gray-700 dark:text-gray-200 whitespace-nowrap">
                {m.role === 'owner' ? 'مالک' : m.role === 'admin' ? 'ادمین' : 'عضو'}
              </span>
          
              <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 leading-none whitespace-nowrap">
                تاریخ عضویت: {m.joined_at || '-'}
              </span>
            </div>
          
            {/* Left: actions */}
            {isAdmin && m.role !== 'owner' && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleRoleChange(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
                            border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white
                            transition-colors"
                >
                  تغییر نقش
                </button>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold
                            border border-red-500 text-red-600 hover:bg-red-500 hover:text-white
                            transition-colors"
                >
                  حذف
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            عضوی یافت نشد.
          </div>
        )}
      </div>
    </div>
  );
};

export const BillingPlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
                  border border-gray-200 dark:border-gray-700 text-center">
    <p className="text-gray-600 dark:text-gray-300">
      بخش صورتحساب به‌زودی اضافه می‌شود.
    </p>
  </div>
);

export const DangerZonePlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6
                  border border-red-200 dark:border-red-700 text-center">
    <p className="text-red-600 dark:text-red-300">
      بخش خطرناک (حذف/ترک فضای کاری) بعداً فعال می‌شود.
    </p>
  </div>
);
