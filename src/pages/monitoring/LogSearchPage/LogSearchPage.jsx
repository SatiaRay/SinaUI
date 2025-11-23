import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGetLogByIdQuery } from '../../../store/api/ai-features/monitoringLogsApi';
import {
  Loader2,
  Calendar,
  Clock,
  User,
  Hash,
  Code,
  Server,
  CheckCircle,
  XCircle,
  Copy,
  Search,
  AlertCircle,
} from 'lucide-react';
import { SearchSectionSkeleton, LogDetailSkeleton } from './LogSearchSkeletons';
import Error from '../../../components/Error';
import Swal from 'sweetalert2';

/**
 * JsonHighlighter Component
 * Displays JSON data with syntax highlighting
 */
const JsonHighlighter = ({ data }) => {
  const jsonString = JSON.stringify(data, null, 2);

  const renderJson = (jsonStr) => {
    if (!jsonStr) return null;

    const lines = jsonStr.split('\n');
    return lines.map((line, index) => {
      const formattedLine = line.replace(
        /( *)("[^"]+": )?("[^"]*"|\b(true|false|null)\b|\b\d+\b)/g,
        (match, indent, key, value) => {
          let keyClass = 'text-blue-600 dark:text-blue-400';
          let valueClass = 'text-green-600 dark:text-green-400';

          if (/true|false|null/.test(value)) {
            valueClass = 'text-red-500 dark:text-red-400';
          } else if (/\d+/.test(value)) {
            valueClass = 'text-amber-600 dark:text-amber-400';
          }

          if (key) {
            return `${indent || ''}<span class="${keyClass}">${key}</span><span class="${valueClass}">${value}</span>`;
          } else if (value) {
            return `${indent || ''}<span class="${valueClass}">${value}</span>`;
          }
          return match;
        }
      );

      return (
        <div key={index} className="flex font-mono text-xs">
          <span className="text-gray-400 dark:text-gray-600 w-8 text-left">
            {index + 1}
          </span>
          <span
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg overflow-x-auto max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700">
      {renderJson(jsonString)}
    </div>
  );
};

/**
 * JsonViewer Component
 * Displays JSON data with copy functionality
 */
const JsonViewer = ({ data, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-2 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 border border-gray-300 dark:border-gray-600"
        >
          <Copy size={14} />
          {copied ? 'کپی شد!' : 'کپی'}
        </button>
      </div>
      <JsonHighlighter data={data} />
    </div>
  );
};

/**
 * LogDetailItem Component
 * Displays individual log detail with icon and label
 */
const LogDetailItem = ({
  icon: Icon,
  label,
  value,
  className = '',
  iconColor = 'text-blue-500 dark:text-blue-400',
}) => {
  if (!value && value !== 0) return null;

  return (
    <div className={`flex items-start gap-3 py-2 ${className}`}>
      <Icon className={`h-5 w-5 ${iconColor} mt-0.5 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-900 dark:text-white break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

/**
 * Simple Error Alert for validation errors
 */
const ValidationError = ({ message }) => (
  <div className="p-4 mb-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl flex items-start gap-3">
    <AlertCircle className="h-6 w-6 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-medium text-amber-800 dark:text-amber-200">هشدار</p>
      <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">
        {message}
      </p>
    </div>
  </div>
);

/**
 * LogSearchPage Component
 * Main component for searching and displaying individual log details
 */
const LogSearchPage = () => {
  const location = useLocation();

  // Get initial search from URL params or state
  const urlParams = new URLSearchParams(location.search);
  const initialSearchFromUrl = urlParams.get('search') || '';
  const initialSearchFromState = location.state?.initialSearch || '';

  const [logId, setLogId] = useState(
    initialSearchFromUrl || initialSearchFromState || ''
  );
  const [hasSearched, setHasSearched] = useState(
    !!(initialSearchFromUrl || initialSearchFromState)
  );
  const [validationError, setValidationError] = useState('');
  const [showNotFoundAlert, setShowNotFoundAlert] = useState(false);
  const [lastSearchedId, setLastSearchedId] = useState('');
  const [currentLogData, setCurrentLogData] = useState(null);

  /**
   * RTK Query hook for fetching log by ID
   */
  const {
    data: logData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetLogByIdQuery(
    { id: logId },
    {
      skip: !logId || !hasSearched,
    }
  );

  /**
   * Auto-search when initial search is provided
   */
  useEffect(() => {
    if ((initialSearchFromUrl || initialSearchFromState) && !hasSearched) {
      handleAutoSearch();
    }
  }, [initialSearchFromUrl, initialSearchFromState]);

  const handleAutoSearch = () => {
    const initialId = initialSearchFromUrl || initialSearchFromState;
    if (initialId && /^\d+$/.test(initialId)) {
      setLogId(initialId);
      setHasSearched(true);
    }
  };

  /**
   * Effect for handling API response and 404 errors
   */
  useEffect(() => {
    // Handle valid API response
    if (logData && hasSearched && logId) {
      setCurrentLogData(logData);
      setShowNotFoundAlert(false);
    }

    // Handle 404 errors
    if (
      isError &&
      error?.status === 404 &&
      hasSearched &&
      logId &&
      logId !== lastSearchedId
    ) {
      setLastSearchedId(logId);
      setCurrentLogData(null);
      setShowNotFoundAlert(true);

      Swal.fire({
        title: 'لاگ یافت نشد',
        text: `لاگی با شناسه ${logId} در سیستم وجود ندارد.`,
        icon: 'error',
        confirmButtonText: 'متوجه شدم',
        confirmButtonColor: '#3085d6',
        customClass: {
          confirmButton:
            'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        setShowNotFoundAlert(false);
      });
    }

    // Handle other errors
    if (isError && error?.status !== 404 && hasSearched) {
      setCurrentLogData(null);
    }
  }, [logData, isError, error, logId, hasSearched, lastSearchedId]);

  /**
   * Handle search action with validation
   */
  const handleSearch = () => {
    setValidationError('');
    setShowNotFoundAlert(false);
    setCurrentLogData(null);

    if (!logId.trim()) {
      setValidationError('لطفاً شناسه لاگ را وارد کنید');
      return;
    }

    if (!/^\d+$/.test(logId)) {
      setValidationError('شناسه لاگ باید یک عدد باشد');
      return;
    }

    setHasSearched(true);
  };

  /**
   * Handle reset action
   */
  const handleReset = () => {
    setLogId('');
    setHasSearched(false);
    setValidationError('');
    setShowNotFoundAlert(false);
    setLastSearchedId('');
    setCurrentLogData(null);

    // Clear URL parameters
    window.history.replaceState({}, '', '/monitoring/log-by-id');
  };

  /**
   * Handle retry action for API errors
   */
  const handleRetry = () => {
    refetch();
  };

  /**
   * Handle keyboard events
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Format timestamp to Persian locale
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('fa-IR');
  };

  /**
   * Format duration in milliseconds
   */
  const formatDuration = (ms) => {
    if (!ms) return '-';
    return `${ms} میلی‌ثانیه`;
  };

  /**
   * Check if error is an API error (network or server error) excluding 404
   */
  const isApiError =
    isError && (error?.status || error?.message) && error?.status !== 404;

  if (isApiError) {
    return (
      <>
        <Error error={error} onRetry={handleRetry} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex-1 flex-col p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar-hide">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
              <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                جستجوی لاگ بر اساس شناسه
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                مشاهده جزئیات کامل لاگ با استفاده از شناسه اختصاصی
              </p>
            </div>
          </div>
        </div>

        {/* Validation Error */}
        {validationError && <ValidationError message={validationError} />}

        {/* Search Section */}
        {isLoading && !hasSearched ? (
          <SearchSectionSkeleton />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 max-w-md w-full">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Hash className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <input
                  type="text"
                  value={logId}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                      setLogId(val);
                      if (validationError) {
                        setValidationError('');
                      }
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="شناسه لاگ را وارد کنید"
                  className="block w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                    placeholder-gray-500 dark:placeholder-gray-400
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-all duration-200"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSearch}
                  disabled={!logId.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                         text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl
                         flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                  {isLoading ? 'در حال جستجو...' : 'جستجو'}
                </button>
                {hasSearched && (
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                           text-gray-800 dark:text-white font-medium rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-600"
                  >
                    جستجوی جدید
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                  <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    جزئیات لاگ
                  </h2>
                  {currentLogData && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      شناسه:{' '}
                      <span className="font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md">
                        #{currentLogData.id || logId}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Loading State */}
              {isLoading ? (
                <LogDetailSkeleton />
              ) : currentLogData ? (
                <div className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      اطلاعات اصلی
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <LogDetailItem
                        icon={Calendar}
                        label="تاریخ و زمان"
                        value={formatTimestamp(currentLogData.timestamp)}
                        iconColor="text-purple-500 dark:text-purple-400"
                      />

                      <LogDetailItem
                        icon={Clock}
                        label="مدت اجرا"
                        value={formatDuration(currentLogData.duration_ms)}
                        iconColor="text-amber-500 dark:text-amber-400"
                      />

                      <LogDetailItem
                        icon={Code}
                        label="ابزار"
                        value={currentLogData.tool}
                        iconColor="text-indigo-500 dark:text-indigo-400"
                      />

                      <LogDetailItem
                        icon={User}
                        label="کاربر"
                        value={currentLogData.user_id}
                        iconColor="text-green-500 dark:text-green-400"
                      />

                      <LogDetailItem
                        icon={Hash}
                        label="شناسه session"
                        value={currentLogData.session_id}
                        iconColor="text-blue-500 dark:text-blue-400"
                      />

                      <LogDetailItem
                        icon={currentLogData.error ? XCircle : CheckCircle}
                        label="وضعیت"
                        value={currentLogData.error ? 'خطا' : 'موفق'}
                        className={
                          currentLogData.error
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }
                        iconColor={
                          currentLogData.error
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-green-500 dark:text-green-400'
                        }
                      />

                      {currentLogData.tokens_used > 0 && (
                        <LogDetailItem
                          icon={Hash}
                          label="تعداد توکن‌ها"
                          value={currentLogData.tokens_used.toLocaleString()}
                          iconColor="text-cyan-500 dark:text-cyan-400"
                        />
                      )}
                    </div>

                    {/* Error Details Section */}
                    {currentLogData.error && (
                      <div className="mt-6 bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          اطلاعات خطا
                        </h3>
                        <JsonViewer
                          data={currentLogData.error}
                          title="جزئیات خطا"
                        />
                      </div>
                    )}
                  </div>

                  {/* Parameters and Response Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentLogData.params &&
                      Object.keys(currentLogData.params).length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                              <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            پارامترهای ورودی
                          </h3>
                          <JsonViewer
                            data={currentLogData.params}
                            title="پارامترها"
                          />
                        </div>
                      )}

                    {currentLogData.response &&
                      Object.keys(currentLogData.response).length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                              <Server className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            پاسخ
                          </h3>
                          <JsonViewer
                            data={currentLogData.response}
                            title="پاسخ"
                          />
                        </div>
                      )}
                  </div>

                  {/* Additional Metadata Section */}
                  {currentLogData.additional_metadata &&
                    Object.keys(currentLogData.additional_metadata).length >
                      0 && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          متادیتای اضافی
                        </h3>
                        <JsonViewer
                          data={currentLogData.additional_metadata}
                          title="متادیتای اضافی"
                        />
                      </div>
                    )}
                </div>
              ) : (
                !isLoading &&
                !isError && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      منتظر نتایج جستجو
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      نتیجه جستجو برای شناسه وارد شده به زودی نمایش داده می‌شود.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && !isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              منتظر ورودی شما هستیم
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              شناسه لاگ مورد نظر خود را در فیلد بالا وارد کنید تا جزئیات کامل آن
              را مشاهده نمایید.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogSearchPage;
