import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Pagination } from '../../../../components/ui/pagination';
import { notify } from '../../../../components/ui/toast';
import { AuditLogIndexLoading } from './AuditLogIndexLoading';
import { AuditLogMobileCard } from './AuditLogMobileCardPage';
import { ACTION_LABEL, ACTION_STYLE, fmt } from '../Constants';

/**
 * Mock Audit Logs
 * Temporary mock data for audit logs page.
 */
const MOCK_AUDIT_LOGS = Array.from({ length: 143 }, (_, i) => {
  const actions = ['create', 'update', 'delete', 'invite', 'login'];
  const types = ['task', 'board', 'member', 'workspace', 'wizard'];
  const actors = [
    { id: 1, name: 'محیا', email: 'jafari@ttay.io' },
    { id: 2, name: 'نسترن', email: 'nastaran@ttay.io' },
    { id: 3, name: 'علی', email: 'ali@ttay.io' },
  ];

  const actor = actors[i % 3];
  const action = actions[i % 5];
  const resourceType = types[i % 5];

  return {
    id: i + 1,
    date: new Date(Date.now() - i * 6 * 3600000).toISOString(),
    actor,
    action,
    resourceType,
    resourceId: `${resourceType}_${1000 + i}`,
    metadata:
      action === 'update'
        ? { changes: { title: ['old', 'new'], status: ['todo', 'done'] } }
        : action === 'invite'
          ? { note: 'Invited via email' }
          : { ip: `192.168.1.${i % 255}` },
  };
});
export { MOCK_AUDIT_LOGS };

/**
 * DatePicker Common Config
 * Shared config object for both "from" and "to" date pickers.
 */
const dpCommon = {
  calendar: persian,
  locale: persian_fa,
  placeholder: 'انتخاب تاریخ',
  inputClass:
    'px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 outline-none w-full text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-all',
  containerClass: 'w-full',
};

/**
 * WorkspaceAuditLogsPage
 * Shows full audit logs history for workspace admins/owners.
 * @return {JSX.Element} audit logs page
 */
const AuditLogIndexPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const isAllowed = true;

  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [actorId, setActorId] = useState('');

  const perPage = 8;

  /**
   * Navigate to audit log detail page.
   * @params {number} id audit log id
   * @return {void}
   */
  const goToDetail = (id) => navigate(`/w/${workspaceId}/audit-logs/${id}`);

  /**
   * Actors List
   * Extract unique actors for select filter.
   * @return {Array<{id:number,name:string,email:string}>} unique actors
   */
  const actors = useMemo(() => {
    const map = new Map();
    MOCK_AUDIT_LOGS.forEach((l) => map.set(l.actor.id, l.actor));
    return [...map.values()];
  }, []);

  /**
   * Filtered Logs + Pagination
   * Applies filters (from/to/actor) and slices for current page.
   * @return {{logs:Array, totalPages:number, totalItems:number}} filtered result
   */
  const { logs, totalPages, totalItems } = useMemo(() => {
    let list = MOCK_AUDIT_LOGS;
    const f = from?.toDate?.();
    const t = to?.toDate?.();

    if (f) list = list.filter((l) => new Date(l.date) >= f);
    if (t) list = list.filter((l) => new Date(l.date) <= t);
    if (actorId) list = list.filter((l) => l.actor.id === +actorId);

    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;

    return {
      logs: list.slice(start, start + perPage),
      totalPages: pages,
      totalItems: total,
    };
  }, [from, to, actorId, page]);

  const [loading, setLoading] = useState(true);

  /**
   * Fake Loading Effect
   * Simulate loading state on filter/page change.
   * @return {void}
   */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [from, to, actorId, page]);

  /**
   * Reset Filters
   * Clears all filters and returns to page 1.
   * @return {void}
   */
  const reset = () => {
    setFrom(null);
    setTo(null);
    setActorId('');
    setPage(1);
    notify.success('فیلترها پاک شدند');
  };

  if (loading) return <AuditLogIndexLoading />;
  if (!isAllowed)
    return (
      <div className="p-8 text-center text-red-600">
        شما دسترسی مشاهده‌ی لاگ‌ها را ندارید.
      </div>
    );

  const Row = ({ log }) => (
    <tr
      onClick={() => goToDetail(log.id)}
      className="border-b border-gray-100 dark:border-gray-700 hover:bg-indigo-50/60 dark:hover:bg-gray-700/30 cursor-pointer transition"
    >
      <td className="px-6 py-4 whitespace-nowrap">{fmt(log.date)}</td>
      <td className="px-6 py-4">
        <div>
          <div className="font-semibold">{log.actor.name}</div>
          <div className="text-xs text-gray-500">{log.actor.email}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${ACTION_STYLE[log.action]}`}
        >
          {ACTION_LABEL[log.action]}
        </span>
      </td>
      <td className="px-6 py-4">{log.resourceType}</td>
      <td className="px-6 py-4 font-mono">{log.resourceId}</td>
      <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-300">
        {JSON.stringify(log.metadata)}
      </td>
    </tr>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar pb-10">
      <header className="mx-3 md:mx-0 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h3 className="text-2xl md:text-3xl font-bold">لاگ‌های فضای کاری</h3>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          آیدی فضای کاری: <span className="font-mono">{workspaceId}</span>
        </div>
      </header>

      <section className="mx-3 xl:mx-0 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4 flex flex-col xl:flex-row gap-4 xl:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">از تاریخ</label>
          <DatePicker
            {...dpCommon}
            value={from}
            onChange={(d) => {
              setFrom(d);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">تا تاریخ</label>
          <DatePicker
            {...dpCommon}
            value={to}
            onChange={(d) => {
              setTo(d);
              setPage(1);
            }}
          />
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs text-gray-500">انجام‌دهنده</label>
          <select
            value={actorId}
            onChange={(e) => {
              setActorId(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 outline-none text-sm"
          >
            <option value="">همه</option>
            {actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          پاک کردن فیلترها
        </button>
      </section>

      {/* Desktop Table */}
      <div className="hidden xl:block mx-3 xl:mx-0 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200">
            <tr>
              {[
                'تاریخ',
                'انجام‌دهنده',
                'عملیات',
                'نوع منبع',
                'شناسه منبع',
                'متادیتا',
              ].map((h) => (
                <th key={h} className="text-right px-6 py-4 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((log) => <Row key={log.id} log={log} />)
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  لاگی با این فیلترها یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="xl:hidden mx-3 mt-4 space-y-4">
        {logs.length ? (
          logs.map((l) => <AuditLogMobileCard key={l.id} log={l} />)
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            لاگی با این فیلترها یافت نشد.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mx-3 xl:mx-0 mt-6 pb-6">
        <Pagination
          page={page}
          perpage={perPage}
          totalPages={totalPages}
          totalItems={totalItems}
          handlePageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AuditLogIndexPage;
