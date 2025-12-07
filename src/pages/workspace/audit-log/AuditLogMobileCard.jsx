import React from "react";
import { ACTION_LABEL, ACTION_STYLE, fmt } from "./Constants";

/**
 * MetaView
 * Small metadata preview with tooltip showing full JSON.
 * @params {object} props component props
 * @params {object} props.meta metadata object of audit log
 * @return {JSX.Element} rendered metadata preview
 */
const MetaView = React.memo(function MetaView({ meta }) {
  const str = JSON.stringify(meta, null, 2);
  const short = str.length > 70 ? str.slice(0, 70) + "…" : str;

  return (
    <span
      title={str}
      className="text-xs text-gray-600 dark:text-gray-300 font-mono"
    >
      {short}
    </span>
  );
});

/**
 * AuditLogMobileCard
 * Dedicated mobile card UI for a single audit-log item.
 * @params {object} props component props
 * @params {object} props.log audit log item
 * @return {JSX.Element} rendered mobile card
 */
export const AuditLogMobileCard = React.memo(function AuditLogMobileCard({
  log,
}) {
  const { date, actor, action, resourceType, resourceId, metadata } = log;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 text-sm">
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
          <span className="font-mono">{resourceId}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-gray-500">متادیتا</span>
          <div className="text-left">
            <MetaView meta={metadata} />
          </div>
        </div>
      </div>
    </div>
  );
});
