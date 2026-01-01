import React from 'react';
import Icon from '@components/ui/Icon';

/**
 * Quick Test Panel Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.testApi - Function to test API
 * @param {boolean} props.isTesting - Testing state
 * @param {Object} props.testResult - Test result data
 * @param {Function} props.copyTestResponse - Function to copy test response
 * @param {Function} props.navigateToFullTest - Function to navigate to test tab
 * @returns {JSX.Element} Rendered quick test panel
 */
const QuickTestPanel = ({
  formData,
  testApi,
  isTesting,
  testResult,
  copyTestResponse,
  navigateToFullTest,
}) => {
  /**
   * Gets method badge color
   * @function getMethodColor
   * @param {string} method - HTTP method
   * @returns {string} CSS classes for color
   */
  const getMethodColor = (method) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'POST':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  /**
   * Gets status badge color
   * @function getStatusColor
   * @param {number} status - HTTP status code
   * @returns {string} CSS classes for color
   */
  const getStatusColor = (status) => {
    if (status === 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    if (status >= 200 && status < 300) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    if (status >= 300 && status < 400) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    if (status >= 400 && status < 500) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
    if (status >= 500) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  /**
   * Formats status text for display
   * @function formatStatusText
   * @param {Object} result - Test result
   * @returns {string} Formatted status text
   */
  const formatStatusText = (result) => {
    if (result.status === 0) {
      return result.statusText || 'Network Error';
    }
    return `${result.status} ${result.statusText || ''}`.trim();
  };

  /**
   * Formats response data for display
   * @function formatResponseData
   * @param {Object} result - Test result
   * @returns {string} Formatted JSON string
   */
  const formatResponseData = (result) => {
    if (!result || !result.data) return '';

    try {
      if (typeof result.data === 'string') {
        // Try to parse as JSON
        const parsed = JSON.parse(result.data);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(result.data, null, 2);
    } catch (error) {
      // If it's not JSON, display as string
      return String(result.data);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Icon name="TestTube" size={20} />
          تست سریع API
        </h3>
        <button
          onClick={navigateToFullTest}
          className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          تست کامل →
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Request Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
            پیش‌نمایش درخواست
          </label>
          <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
              <div
                className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(formData.http_method)}`}
              >
                {formData.http_method}
              </div>
              <code className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-all">
                {formData.base_url}
                {formData.endpoint_path || ''}
              </code>
            </div>

            {formData.parameters.length > 0 && (
              <div className="mb-2 sm:mb-3">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  پارامترها:
                </div>
                <div className="space-y-1">
                  {formData.parameters.slice(0, 3).map((param) => (
                    <div
                      key={param.id}
                      className="flex items-center gap-2 text-xs flex-wrap"
                    >
                      <span className="font-mono text-indigo-600 dark:text-indigo-400">
                        {param.name}
                      </span>
                      <span className="text-gray-500">({param.type})</span>
                      {param.required && (
                        <span className="px-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs rounded">
                          الزامی
                        </span>
                      )}
                    </div>
                  ))}
                  {formData.parameters.length > 3 && (
                    <div className="text-xs text-gray-500">
                      + {formData.parameters.length - 3} پارامتر دیگر
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.headers.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  هدرها:
                </div>
                <div className="space-y-1">
                  {formData.headers.slice(0, 3).map((header) => (
                    <div
                      key={header.id}
                      className="flex items-center gap-2 text-xs flex-wrap"
                    >
                      <span className="font-mono text-blue-600 dark:text-blue-400">
                        {header.key}:
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {header.value}
                      </span>
                    </div>
                  ))}
                  {formData.headers.length > 3 && (
                    <div className="text-xs text-gray-500">
                      + {formData.headers.length - 3} هدر دیگر
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => testApi()}
            disabled={isTesting || !formData.base_url}
            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm"
          >
            {isTesting ? (
              <>
                <Icon name="RefreshCw" className="animate-spin" />
                <span>در حال تست...</span>
              </>
            ) : (
              <>
                <Icon name="Send" />
                <span>ارسال تست</span>
              </>
            )}
          </button>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mt-3 sm:mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                نتیجه تست
              </h4>
              <button
                onClick={copyTestResponse}
                className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                <Icon name="Copy" size={14} />
                کپی پاسخ
              </button>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
                <div
                  className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(testResult.status)}`}
                >
                  {formatStatusText(testResult)}
                </div>
                {testResult.status !== 0 && testResult.duration && (
                  <div className="text-xs text-gray-500">
                    زمان: {testResult.duration}ms • حجم: {testResult.size}
                  </div>
                )}
              </div>

              {testResult.status === 0 && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon
                      name="AlertCircle"
                      size={18}
                      className="text-red-500 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300">
                        خطای اتصال
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {testResult.data?.details || 'اتصال به سرور برقرار نشد'}
                      </p>
                      {testResult.data?.suggestion && (
                        <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                          {testResult.data.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <pre className="text-xs bg-gray-900 text-gray-200 p-2 sm:p-3 rounded overflow-auto max-h-40 sm:max-h-60">
                {formatResponseData(testResult)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickTestPanel;
