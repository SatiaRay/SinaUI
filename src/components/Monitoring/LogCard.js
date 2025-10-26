import React, { useState } from 'react';
import {
  FileText,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  Hash,
} from 'lucide-react';

const LogCard = ({ log }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // داده‌ها
  const { id, timestamp, tool, params = {}, user_id, duration_ms, error } = log;
  const paramEntries = Object.entries(params);

  // تاریخ شمسی
  const formattedDate = new Date(timestamp).toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // کپی کردن آی‌دی
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('خطا در کپی کردن:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition flex flex-col justify-between text-sm leading-snug">
      {/* هدر + وضعیت خطا */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
            {tool}
          </h3>
        </div>
        {error ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" /> خطا
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
            <CheckCircle className="w-4 h-4" /> بدون خطا
          </span>
        )}
      </div>

      {/* اطلاعات سریع */}
      <div className="flex flex-col gap-1 text-xs text-gray-700 dark:text-gray-300 mb-3">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3 text-purple-500" />
          <span>{user_id}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-green-500" />
          <span>{duration_ms} ms</span>
        </div>
        <div
          className="flex items-center gap-1 cursor-pointer group"
          onClick={handleCopyId}
          title="کلیک برای کپی"
        >
          <Hash className="w-3 h-3 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold group-hover:underline">
            {id}
          </span>
          {copied && (
            <span className="ml-2 text-green-500 text-[10px]">کپی شد!</span>
          )}
        </div>
      </div>

      {/* دکمه مشاهده پارامترها */}
      {paramEntries.length > 0 && (
        <button
          onClick={() => setShowModal(true)}
          className="self-start text-blue-500 text-xs hover:underline"
        >
          مشاهده پارامترها...
        </button>
      )}

      {/* تاریخ */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-left border-t border-gray-200 dark:border-gray-700 pt-2">
        {formattedDate}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto text-gray-900 dark:text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold mb-4">همه پارامترها</h2>
            <ul className="space-y-2 text-sm">
              {paramEntries.map(([key, value]) => (
                <li key={key} className="break-words">
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogCard;
