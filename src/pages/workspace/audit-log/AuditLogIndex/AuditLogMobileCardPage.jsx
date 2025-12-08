import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ACTION_LABEL, ACTION_STYLE, fmt } from '../Constants';

/**
 * MetaView
 * Short metadata preview with full JSON on hover.
 */
const MetaView = React.memo(({ meta }) => {
  const str = JSON.stringify(meta, null, 2);
  const short = str.length > 70 ? str.slice(0, 70) + '…' : str;

  return (
    <span title={str} className="text-xs text-gray-600 dark:text-gray-300">
      {short}
    </span>
  );
});

/**
 * AuditLogMobileCard
 * Mobile-friendly audit log card.
 */
export const AuditLogMobileCard = React.memo(({ log }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  /**
   * Navigate to detail page
   * @return {void}
   */
  const goToDetail = () => {
    navigate(`/w/${workspaceId}/audit-logs/${log.id}`);
  };

  const { date, actor, action, resourceType, resourceId, metadata } = log;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 text-sm transition">
      <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500">تاریخ</span>
        <span className="font-medium">{fmt(date)}</span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-500">انجام‌دهنده</span>
          <div className="text-right">
            <div className="font-medium">{actor.name}</div>
            <div className="text-xs text-gray-500">{actor.email}</div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">عملیات</span>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${ACTION_STYLE[action]}`}
          >
            {ACTION_LABEL[action]}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">نوع منبع</span>
          <span>{resourceType}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">شناسه منبع</span>
          <span>{resourceId}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-500">متادیتا</span>
          <MetaView meta={metadata} />
        </div>
      </div>

      <div className="mt-4 flex justify-start">
        <button
          onClick={goToDetail}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:opacity-90 transition"
        >
          مشاهده جزئیات →
        </button>
      </div>
    </div>
  );
});
