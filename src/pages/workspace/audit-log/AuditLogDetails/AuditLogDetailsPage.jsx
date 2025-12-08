import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ACTION_LABEL, ACTION_STYLE, fmt } from '../Constants';
import { MOCK_AUDIT_LOGS } from '../AuditLogIndex/AuditLogIndexPage';
import { AuditLogDetailLoading } from './AuditLogDetailsLoading';

/**
 * AuditLogDetailPage
 * Shows full information of a single audit log.
 * @return {JSX.Element} audit log detail page
 */
const AuditLogDetailPage = () => {
  const navigate = useNavigate();
  const { workspaceId, logId } = useParams();
  const [loading, setLoading] = useState(true);

  /**
   * Find Selected Log
   * Locate a log by id from mock list.
   * @return {object | undefined} selected log
   */
  const log = useMemo(
    () => MOCK_AUDIT_LOGS.find((l) => l.id === Number(logId)),
    [logId]
  );

  /**
   * Fake Loading Effect
   * Simulate loading state.
   */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [logId]);

  if (loading) return <AuditLogDetailLoading />;

  if (!log) {
    return (
      <div className="p-10 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm font-semibold">
          لاگ موردنظر پیدا نشد.
        </span>
      </div>
    );
  }

  /**
   * InfoCard
   * Small reusable card for showing a title + value.
   * @params {string} title card title
   * @params {React.ReactNode} value card value
   * @return {JSX.Element} info card
   */
  const InfoCard = ({ title, value, mono = false, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        {title}
      </div>
      {children || (
        <div
          className={`text-gray-900 dark:text-gray-50 break-all ${
            mono ? 'font-mono text-sm' : ''
          }`}
        >
          {value}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 xl:p-0">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 mt-3">
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/10 via-fuchsia-500/10 to-sky-500/10 dark:from-indigo-500/15 dark:via-fuchsia-500/15 dark:to-sky-500/15" />
        <div className="relative p-4 sm:p-5 md:p-6 flex flex-row items-center justify-between gap-3 flex-wrap">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight whitespace-nowrap">
            جزئیات لاگ
          </h3>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-3 sm:px-4 py-2 rounded-xl bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 text-xs sm:text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
            >
              بازگشت
            </button>
            <div className="px-2.5 sm:px-3 py-2 rounded-xl bg-white/70 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 text-[10px] sm:text-xs text-gray-700 dark:text-gray-200 whitespace-nowrap">
              آیدی لاگ: {log.id}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 grid place-items-center text-white font-bold text-lg">
                {log.actor.name[0]}
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  انجام‌دهنده
                </div>
                <div className="font-bold text-gray-900 dark:text-gray-50">
                  {log.actor.name}
                </div>
                <div className="text-xs text-gray-500">{log.actor.email}</div>
              </div>
            </div>
          </div>

          <InfoCard
            title="عملیات"
            value={
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${ACTION_STYLE[log.action]}`}
              >
                {ACTION_LABEL[log.action]}
              </span>
            }
          />
          <InfoCard title="تاریخ" value={fmt(log.date)} />
        </div>

        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <h4 className="text-base font-extrabold text-gray-900 dark:text-gray-50 mb-4">
              اطلاعات منبع
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard title="نوع منبع" value={log.resourceType} />
              <InfoCard title="شناسه منبع" value={log.resourceId} mono />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h4 className="text-base font-extrabold text-gray-900 dark:text-gray-50">
                متادیتا (کامل)
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                JSON
              </span>
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-indigo-500/5 via-emerald-500/5 to-fuchsia-500/5 dark:from-indigo-500/10 dark:via-emerald-500/10 dark:to-fuchsia-500/10" />
                <pre className="relative text-xs md:text-sm bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl overflow-auto font-mono text-gray-800 dark:text-gray-100 leading-6">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailPage;
