import React, { useState } from 'react';
import { monitoringEndpoints } from '../../utils/apis';
import {
  Loader2,
  AlertCircle,
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
  Sparkles,
} from 'lucide-react';

const ErrorAlert = ({ message, onRetry, type = 'general' }) => {
  const themes = {
    general: {
      title: 'خطا',
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-500 dark:text-red-400',
    },
    validation: {
      title: 'مقدار نامعتبر',
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      border: 'border-amber-300 dark:border-amber-700',
      text: 'text-amber-800 dark:text-amber-200',
      icon: 'text-amber-500 dark:text-amber-400',
    },
  };
  const theme = themes[type] || themes.general;

  return (
    <div
      className={`p-4 mb-4 ${theme.bg} border ${theme.border} rounded-lg flex items-start gap-3`}
    >
      <AlertCircle className={`h-6 w-6 ${theme.icon} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-medium ${theme.text}`}>{theme.title}</p>
        <p className={`${theme.text} text-sm mt-1`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
          >
            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
};
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
    <div className="bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-800">
      {renderJson(jsonString)}
    </div>
  );
};

const JsonViewer = ({ data, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-2 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {title}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors duration-200"
        >
          <Copy size={14} />
          {copied ? 'کپی شد!' : 'کپی'}
        </button>
      </div>
      <JsonHighlighter data={data} />
    </div>
  );
};

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

const LogSearchPage = () => {
  const [logId, setLogId] = useState('');
  const [logData, setLogData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!logId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);
      const data = await monitoringEndpoints.getLogById(logId.trim());
      setLogData(data);
    } catch (err) {
      console.error('Error fetching log details:', err);
      setError(
        'خطا در دریافت اطلاعات لاگ اگر از صحت شناسه مطمن هستید اتصال اینترنت و سرور را چک کنید '
      );
      setLogData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLogId('');
    setLogData(null);
    setError(null);
    setHasSearched(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString('fa-IR');
  };

  const formatDuration = (ms) => {
    if (!ms) return '-';
    return `${ms} میلی‌ثانیه`;
  };

  return (
    <div className="flex flex-1 flex-col items-center overflow-y-auto scrollbar-hide bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Sparkles className="h-8 w-8 text-yellow-400 opacity-70" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            جستجو و نمایش لاگ سیستم
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            برای مشاهده جزئیات کامل یک لاگ، شناسه آن را در فیلد زیر وارد کنید
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
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
                    if (val === '' || /^[1-9]\d*$/.test(val)) {
                      setLogId(val);
                    }
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="شناسه لاگ را وارد کنید"
                className="block w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
           placeholder-gray-500 dark:placeholder-gray-400
           focus:ring-2 focus:ring-blue-500 focus:border-blue-500
           transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!logId.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50
                       text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg
                       flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? 'در حال جستجو...' : 'جستجو'}
            </button>
            {hasSearched && (
              <button
                onClick={handleReset}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                         text-gray-800 dark:text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
              >
                جستجوی جدید
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                جزئیات لاگ
              </h2>
              <span className="text-sm bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                #{logId}
              </span>
            </div>

            <div className="p-6">
              {error && <ErrorAlert message={error} onRetry={handleSearch} />}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
                    <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
                  </div>
                </div>
              ) : logData ? (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div
                    className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 
                rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      اطلاعات اصلی
                    </h3>

                    {/* دوتا ستون راست و چپ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <LogDetailItem
                        icon={Calendar}
                        label="تاریخ و زمان"
                        value={formatTimestamp(logData.timestamp)}
                        iconColor="text-purple-500 dark:text-purple-400"
                      />

                      <LogDetailItem
                        icon={Clock}
                        label="مدت اجرا"
                        value={formatDuration(logData.duration_ms)}
                        iconColor="text-amber-500 dark:text-amber-400"
                      />

                      <LogDetailItem
                        icon={Code}
                        label="ابزار"
                        value={logData.tool}
                        iconColor="text-indigo-500 dark:text-indigo-400"
                      />

                      <LogDetailItem
                        icon={User}
                        label="کاربر"
                        value={logData.user_id}
                        iconColor="text-green-500 dark:text-green-400"
                      />

                      <LogDetailItem
                        icon={Hash}
                        label="شناسه session"
                        value={logData.session_id}
                        iconColor="text-blue-500 dark:text-blue-400"
                      />

                      <LogDetailItem
                        icon={logData.error ? XCircle : CheckCircle}
                        label="وضعیت"
                        value={logData.error ? 'خطا' : 'موفق'}
                        className={
                          logData.error
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }
                        iconColor={
                          logData.error
                            ? 'text-red-500 dark:text-red-400'
                            : 'text-green-500 dark:text-green-400'
                        }
                      />

                      {logData.tokens_used > 0 && (
                        <LogDetailItem
                          icon={Hash}
                          label="تعداد توکن‌ها"
                          value={logData.tokens_used.toLocaleString()}
                          iconColor="text-cyan-500 dark:text-cyan-400"
                        />
                      )}
                    </div>

                    {/* Error Section */}
                    {logData.error && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-5 border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          اطلاعات خطا
                        </h3>
                        <JsonViewer data={logData.error} title="جزئیات خطا" />
                      </div>
                    )}
                  </div>

                  {/* Params and Response */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {logData.params &&
                      Object.keys(logData.params).length > 0 && (
                        <div className="bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                              <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            پارامترهای ورودی
                          </h3>
                          <JsonViewer data={logData.params} title="پارامترها" />
                        </div>
                      )}

                    {logData.response &&
                      Object.keys(logData.response).length > 0 && (
                        <div className="bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-lg">
                              <Server className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            </div>
                            پاسخ
                          </h3>
                          <JsonViewer data={logData.response} title="پاسخ" />
                        </div>
                      )}
                  </div>

                  {/* Additional Metadata */}
                  {logData.additional_metadata &&
                    Object.keys(logData.additional_metadata).length > 0 && (
                      <div className="bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                            <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </div>
                          متادیتای اضافی
                        </h3>
                        <JsonViewer
                          data={logData.additional_metadata}
                          title="متادیتای اضافی"
                        />
                      </div>
                    )}
                </div>
              ) : (
                !loading &&
                !error && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 opacity-50" />
                    </div>
                    <p>لاگ مورد نظر یافت نشد</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
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
