import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Pagination } from '../../components/ui/pagination';
import { notify } from '../../components/ui/toast';
import { WorkspaceAuditLogsLoading } from './WorkspaceAuditLogsLoading';

/* -------------------- Mock data -------------------- */
const MOCK_AUDIT_LOGS = Array.from({ length: 143 }).map((_, i) => {
  const actions = ['create', 'update', 'delete', 'invite', 'login'];
  const resourceTypes = ['task', 'board', 'member', 'workspace', 'wizard'];
  const actors = [
    { id: 1, name: 'محیا', email: 'jafari@ttay.io' },
    { id: 2, name: 'نسترن', email: 'nastaran@ttay.io' },
    { id: 3, name: 'علی', email: 'ali@ttay.io' },
  ];

  const actor = actors[i % actors.length];
  const action = actions[i % actions.length];
  const resourceType = resourceTypes[i % resourceTypes.length];

  return {
    id: i + 1,
    date: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
    actor,
    action,
    resourceType,
    resourceId: `${resourceType}_${1000 + i}`,
    metadata: {
      ip: `192.168.1.${i % 255}`,
      ...(action === 'update'
        ? { changes: { title: ['old', 'new'], status: ['todo', 'done'] } }
        : {}),
      ...(action === 'invite' ? { note: 'Invited via email' } : {}),
    },
  };
});

/* -------------------- Utils -------------------- */
const fmtDate = (iso) =>
  new Date(iso).toLocaleString('fa-IR', { dateStyle: 'medium', timeStyle: 'short' });

const ACTION_CLASS = {
  create: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  invite: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  login: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
};

const ACTION_LABELS = {
  create: 'ایجاد',
  update: 'ویرایش',
  delete: 'حذف',
  invite: 'دعوت',
  login: 'ورود',
};

const toDate = (d) => (d?.toDate?.() ? d.toDate() : null);

const Row = ({ label, value, muted = false }) => (
  <div className="grid grid-cols-[90px_1fr] gap-3 py-2 items-start">
    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap text-right">
      {label}
    </span>
    <div
      className={`text-left ${
        muted ? 'text-gray-600 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
      }`}
    >
      {value}
    </div>
  </div>
);

/* -------------------- DatePicker styles -------------------- */
const DP_INPUT =
  'px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none w-full ' +
  'text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 ' +
  'focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all';

const DP_CALENDAR =
  'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl p-2 border ' +
  'border-gray-200 dark:border-gray-700';

/* -------------------- Page -------------------- */
const WorkspaceAuditLogsPage = () => {
  const { workspaceId } = useParams();
  const isAllowed = ['admin', 'owner'].includes('admin');

  /* 
  * Pagination props 
  */
  const [page, setPage] = useState(1);
  const perpage = 10;

  /* 
  * Jalali filters 
  */
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [actorId, setActorId] = useState('');

  /* 
  * Fake fetching 
  */
  const [logs, setLogs] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    const t = setTimeout(() => setIsFetching(false), 250);
    return () => clearTimeout(t);
  }, [page, from, to, actorId]);

  const actors = useMemo(() => {
    const m = new Map();
    MOCK_AUDIT_LOGS.forEach((l) => m.set(l.actor.id, l.actor));
    return [...m.values()];
  }, []);

  const filtered = useMemo(() => {
    let items = MOCK_AUDIT_LOGS;
    const f = toDate(from),
      t = toDate(to);
    if (f) items = items.filter((i) => new Date(i.date) >= f);
    if (t) items = items.filter((i) => new Date(i.date) <= t);
    if (actorId) items = items.filter((i) => String(i.actor.id) === actorId);
    return items;
  }, [from, to, actorId]);

  const data = useMemo(() => {
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / perpage));
    const start = (page - 1) * perpage;
    return { total, pages, logs: filtered.slice(start, start + perpage) };
  }, [filtered, page]);

  useEffect(() => setLogs(data.logs), [data.logs, page]);
  useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [page]);

  const resetFilters = () => {
    setFrom(null);
    setTo(null);
    setActorId('');
    setPage(1);
    notify.success('فیلترها پاک شدند');
  };

  const dpProps = {
    calendar: persian,
    locale: persian_fa,
    placeholder: 'انتخاب تاریخ',
    inputClass: DP_INPUT,
    calendarClassName: DP_CALENDAR,
    weekDaysClassName: 'text-xs text-gray-500 dark:text-gray-300',
    monthYearClassName: 'text-sm font-medium text-gray-700 dark:text-gray-100',
    dayClassName: 'hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all',
    todayClassName: 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg',
    selectedDayClassName: 'bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 rounded-lg',
  };

  if (isFetching || !logs) return <WorkspaceAuditLogsLoading />;
  if (!isAllowed)
    return (
      <div className="p-4 text-center text-red-600">
        شما دسترسی مشاهده‌ی لاگ‌ها را ندارید.
      </div>
    );

  return (
    <div className="h-full flex flex-col justify-start md:pb-0">
      <style>{`
        @media (max-width: 1279px) {
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        }
      `}</style>

      {/* Header */}
      <div className="mx-3 md:mx-0 xl:mb-3 pb-3 pt-3 xl:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">لاگ‌های فضای کاری</h3>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          شناسه فضای کاری: {workspaceId}
        </span>
      </div>

      {/* Filters */}
      <div className="mx-3 xl:mx-0 mt-3 bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col xl:flex-row gap-3 xl:items-end">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">از تاریخ</span>
          <DatePicker
            {...dpProps}
            value={from}
            onChange={(d) => {
              setFrom(d);
              setPage(1);
            }}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">تا تاریخ</span>
          <DatePicker
            {...dpProps}
            value={to}
            onChange={(d) => {
              setTo(d);
              setPage(1);
            }}
          />
        </label>

        <label className="flex flex-col gap-1 flex-1">
          <span className="text-xs text-gray-500">انجام‌دهنده</span>
          <select
            value={actorId}
            onChange={(e) => {
              setActorId(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none text-sm"
          >
            <option value="">همه</option>
            {actors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.email})
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={resetFilters}
          className="px-4 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all"
        >
          پاک کردن فیلتر
        </button>
      </div>

      {/* Content */}
      <div className="p-3 xl:p-0 mt-3 overflow-y-auto no-scrollbar">
        {/* Desktop Table */}
        <div className="hidden xl:block bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                {['تاریخ', 'انجام‌دهنده', 'عملیات', 'نوع منبع', 'شناسه منبع', 'متادیتا'].map(
                  (h) => (
                    <th key={h} className="text-right px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {logs.length ? (
                logs.map((l) => {
                  const meta = JSON.stringify(l.metadata || {});
                  const shortMeta = meta.length > 60 ? meta.slice(0, 60) + '…' : meta;

                  return (
                    <tr
                      key={l.id}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{fmtDate(l.date)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium">{l.actor.name}</span>
                          <span className="text-xs text-gray-500">{l.actor.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${ACTION_CLASS[l.action]}`}
                        >
                          {ACTION_LABELS[l.action] || l.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.resourceType}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{l.resourceId}</td>
                      <td className="px-4 py-3 min-w-[220px]">
                        <span
                          title={meta}
                          className="text-xs text-gray-600 dark:text-gray-300"
                        >
                          {shortMeta}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 dark:text-gray-400 py-8">
                    لاگی با این فیلترها یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Cards */}
        <div className="xl:hidden space-y-3">
          {logs.length ? (
            logs.map((l) => {
              const meta = JSON.stringify(l.metadata || {});
              const shortMeta = meta.length > 80 ? meta.slice(0, 80) + '…' : meta;

              return (
                <div
                  key={l.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 text-sm"
                >
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">لاگ</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {fmtDate(l.date)}
                    </div>
                  </div>

                  <Row
                    label="انجام‌دهنده"
                    value={
                      <div className="flex flex-col items-end">
                        <div className="font-semibold">{l.actor.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {l.actor.email}
                        </div>
                      </div>
                    }
                  />

                  <Row
                    label="عملیات"
                    value={
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium inline-flex ${ACTION_CLASS[l.action]}`}
                      >
                        {ACTION_LABELS[l.action] || l.action}
                      </span>
                    }
                  />

                  <Row label="نوع منبع" value={l.resourceType} />
                  <Row label="شناسه منبع" value={l.resourceId} />

                  <Row
                    label="متادیتا"
                    value={
                      <div
                        title={meta}
                        className="text-xs leading-6 bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700 rounded-lg p-2 text-left"
                      >
                        {shortMeta}
                      </div>
                    }
                  />
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              لاگی با این فیلترها یافت نشد.
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="pb-5 xl:pb-0">
        <Pagination
          page={page}
          perpage={perpage}
          totalPages={data.pages}
          totalItems={data.total}
          handlePageChange={setPage}
        />
      </div>
    </div>
  );
};

export default WorkspaceAuditLogsPage;