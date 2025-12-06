import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Pagination } from '../../components/ui/pagination';
import { notify } from '../../components/ui/toast';
import { WorkspaceAuditLogsLoading } from './WorkspaceAuditLogsLoading';

/* ==================== Mock Data ==================== */
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

/* ==================== Constants ==================== */
const fmt = (iso) =>
  new Date(iso).toLocaleString('fa-IR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const ACTION_STYLE = {
  create:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  update: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  invite:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  login: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
};

const ACTION_LABEL = {
  create: 'ایجاد',
  update: 'ویرایش',
  delete: 'حذف',
  invite: 'دعوت',
  login: 'ورود',
};

/* ==================== DatePicker Config ==================== */
const dpCommon = {
  calendar: persian,
  locale: persian_fa,
  placeholder: 'انتخاب تاریخ',
  inputClass:
    'px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 outline-none w-full text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all',
  containerClass: 'w-full',
  calendarClassName:
    'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-xl p-2 border border-gray-200 dark:border-gray-700',
};

/* ==================== Main Component ==================== */
const WorkspaceAuditLogsPage = () => {
  const { workspaceId } = useParams();
  const isAllowed = true;

  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [actorId, setActorId] = useState('');

  const perPage = 10;

  const actors = useMemo(() => {
    const map = new Map();
    MOCK_AUDIT_LOGS.forEach((l) => map.set(l.actor.id, l.actor));
    return [...map.values()];
  }, []);

  const { logs, totalPages, totalItems } = useMemo(() => {
    let filtered = MOCK_AUDIT_LOGS;

    const f = from?.toDate?.();
    const t = to?.toDate?.();

    if (f) filtered = filtered.filter((l) => new Date(l.date) >= f);
    if (t) filtered = filtered.filter((l) => new Date(l.date) <= t);
    if (actorId) filtered = filtered.filter((l) => l.actor.id === +actorId);

    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    const sliced = filtered.slice(start, start + perPage);

    return { logs: sliced, totalPages: pages, totalItems: total };
  }, [from, to, actorId, page]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [from, to, actorId, page]);

  const reset = () => {
    setFrom(null);
    setTo(null);
    setActorId('');
    setPage(1);
    notify.success('فیلترها پاک شدند');
  };

  if (loading) return <WorkspaceAuditLogsLoading />;
  if (!isAllowed)
    return (
      <div className="p-8 text-center text-red-600">
        شما دسترسی مشاهده‌ی لاگ‌ها را ندارید.
      </div>
    );

  const MetaView = ({ meta }) => {
    const str = JSON.stringify(meta, null, 2);
    const short = str.length > 70 ? str.slice(0, 70) + '…' : str;
    return (
      <span
        title={str}
        className="text-xs text-gray-600 dark:text-gray-300 font-mono"
      >
        {short}
      </span>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mx-3 md:mx-0 pb-3 pt-3 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">لاگ‌های فضای کاری</h3>
        <span className="text-sm text-gray-500 dark:text-gray-300">
          شناسه فضای کاری: {workspaceId}
        </span>
      </div>

      {/* Filters */}
      <div className="mx-3 xl:mx-0 mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col xl:flex-row gap-4 xl:items-end">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">از تاریخ</span>
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
          <span className="text-xs text-gray-500">تا تاریخ</span>
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
        </div>

        <button
          onClick={reset}
          className="px-5 py-2 rounded-lg font-medium bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          پاک کردن فیلتر
        </button>
      </div>

      {/* Table (Desktop) */}
      <div className="hidden xl:block mt-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              {[
                'تاریخ',
                'انجام‌دهنده',
                'عملیات',
                'نوع منبع',
                'شناسه منبع',
                'متادیتا',
              ].map((h) => (
                <th key={h} className="text-right px-6 py-4 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length ? (
              logs.map((l) => (
                <tr
                  key={l.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{fmt(l.date)}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{l.actor.name}</div>
                      <div className="text-xs text-gray-500">
                        {l.actor.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${ACTION_STYLE[l.action]}`}
                    >
                      {ACTION_LABEL[l.action]}
                    </span>
                  </td>
                  <td className="px-6 py-4">{l.resourceType}</td>
                  <td className="px-6 py-4 font-mono">{l.resourceId}</td>
                  <td className="px-6 py-4">
                    <MetaView meta={l.metadata} />
                  </td>
                </tr>
              ))
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

      {/* Cards (Mobile) */}
      <div className="xl:hidden mt-4 space-y-4">
        {logs.length ? (
          logs.map((l) => (
            <div
              key={l.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 text-sm"
            >
              <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500">تاریخ</span>
                <span className="font-medium">{fmt(l.date)}</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">انجام‌دهنده</span>
                  <div className="text-right">
                    <div className="font-medium">{l.actor.name}</div>
                    <div className="text-xs text-gray-500">{l.actor.email}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500">عملیات</span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${ACTION_STYLE[l.action]}`}
                  >
                    {ACTION_LABEL[l.action]}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">نوع منبع</span>
                  <span>{l.resourceType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">شناسه منبع</span>
                  <span className="font-mono">{l.resourceId}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-gray-500">متادیتا</span>
                  <div className="text-left">
                    <MetaView meta={l.metadata} />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            لاگی با این فیلترها یافت نشد.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 pb-6">
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

export default WorkspaceAuditLogsPage;
