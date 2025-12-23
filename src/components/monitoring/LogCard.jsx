import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';

/**
 * LogCard Component
 * Displays individual log information in a card format
 * @param {Object} props - Component props
 * @param {Object} props.log - Log data object
 * @param {string} props.log.id - Log unique identifier
 * @param {string} props.log.timestamp - Log timestamp
 * @param {string} props.log.tool - Tool name
 * @param {Object} props.log.params - Log parameters
 * @param {string} props.log.user_id - User identifier
 * @param {number} props.log.duration_ms - Execution duration in milliseconds
 * @param {Object} props.log.error - Error information if any
 * @returns {JSX.Element} LogCard component
 */
const LogCard = ({ log }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract log data
  const { id, timestamp, tool, params = {}, user_id, duration_ms, error } = log;
  const paramEntries = Object.entries(params);

  // Format timestamp to Persian locale
  const formattedDate = new Date(timestamp).toLocaleString('fa-IR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const navigate = useNavigate();

  // Copy ID to clipboard
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Error copying ID:', err);
    }
  };

  // Navigate to log details page in new tab
  const handleViewDetails = () => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}/monitoring/log-by-id?search=${id}`, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group w-full">
      {/* Header with tool name and status - Responsive */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
            <Icon
              name="FileText"
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
            />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
            {tool}
          </h3>
        </div>

        {/* Status badge - now responsive and wraps properly */}
        <div className="flex-shrink-0">
          {error ? (
            <span className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-medium w-fit">
              <Icon
                name="AlertCircle"
                className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
              />
              <span className="whitespace-nowrap">خطا</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium w-fit">
              <Icon
                name="CheckCircle"
                className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
              />
              <span className="whitespace-nowrap">موفق</span>
            </span>
          )}
        </div>
      </div>

      {/* Quick information - Responsive */}
      <div className="flex flex-col gap-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
        {/* User info */}
        <div className="flex items-center gap-3 flex-wrap">
          <Icon
            name="User"
            className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0"
          />
          <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
            کاربر:
          </span>
          <span className="text-gray-900 dark:text-white text-xs sm:text-sm truncate min-w-0 flex-1">
            {user_id}
          </span>
        </div>

        {/* Duration info */}
        <div className="flex items-center gap-3 flex-wrap">
          <Icon
            name="Clock"
            className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0"
          />
          <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
            مدت اجرا:
          </span>
          <span className="text-gray-900 dark:text-white text-xs sm:text-sm">
            {duration_ms} میلی‌ثانیه
          </span>
        </div>

        {/* ID info - Improved responsive behavior */}
        <div className="flex flex-col xs:flex-row xs:items-center gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Icon
              name="Hash"
              className="w-4 h-4 text-blue-500 dark:text-blue-400"
            />
            <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
              شناسه:
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg flex-1 min-w-0">
              <span className="font-mono text-gray-900 dark:text-white text-xs truncate text-center flex-1">
                {id}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 flex-shrink-0"
                title="کپی شناسه"
              >
                <Icon
                  name="Copy"
                  className="w-3 h-3 text-gray-500 dark:text-gray-400"
                />
              </button>
            </div>
            {copied && (
              <span className="text-green-500 text-xs font-medium whitespace-nowrap flex-shrink-0">
                کپی شد!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons - Responsive */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        {paramEntries.length > 0 && (
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 text-xs sm:text-sm font-medium min-h-[44px]"
          >
            <Icon name="FileText" className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">مشاهده پارامترها</span>
          </button>
        )}
        <button
          onClick={handleViewDetails}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 text-xs sm:text-sm font-medium min-h-[44px]"
        >
          <Icon name="ExternalLink" className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">جزئیات کامل</span>
        </button>
      </div>

      {/* Timestamp */}
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        {formattedDate}
      </div>

      {/* Parameters Modal - Also made responsive */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                پارامترهای لاگ
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  شناسه:
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg text-xs">
                  {id}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {paramEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                        {key}
                      </h3>
                      <pre className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-gray-600 overflow-x-auto max-h-[200px]">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
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
