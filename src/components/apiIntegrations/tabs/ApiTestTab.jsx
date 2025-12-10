import React, { useState, useEffect } from 'react';
import {
  TbTestPipe,
  TbSend,
  TbCopy,
  TbRefresh,
  TbChevronLeft,
  TbAlertCircle,
  TbClock,
  TbDatabase,
  TbExternalLink,
  TbLink,
} from 'react-icons/tb';
import { notify } from '@components/ui/toast'; // فرض می‌کنیم توست از این مسیر import می‌شود

/**
 * Test Tab Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.handleInputChange - Function to handle input changes
 * @param {Function} props.testApi - Function to test API
 * @param {boolean} props.isTesting - Testing state
 * @param {Object} props.testResult - Test result data
 * @param {Function} props.copyTestResponse - Function to copy test response
 * @param {Function} props.setActiveTab - Function to set active tab
 * @param {Function} props.setTestResult - Function to set test result
 * @returns {JSX.Element} Rendered test tab
 */
const ApiTestTab = ({
  formData,
  handleInputChange,
  testApi,
  isTesting,
  testResult,
  copyTestResponse,
  setActiveTab,
  setTestResult,
}) => {
  // Local state for test values
  const [testValues, setTestValues] = useState({
    parameters: {},
    headers: {},
    body: formData.request_body.example || '',
  });

  // State for URL display
  const [showFullUrl, setShowFullUrl] = useState(false);

  /**
   * Constructs full URL with query parameters
   * @function constructFullUrl
   * @returns {string} Full URL with query parameters
   */
  const constructFullUrl = () => {
    const baseUrl = `${formData.base_url}${formData.endpoint_path || ''}`;

    // Collect query parameters
    const queryParams = {};
    formData.parameters
      .filter((param) => param.location === 'query')
      .forEach((param) => {
        const value =
          testValues.parameters[param.name] || param.default_value || '';
        if (value) {
          queryParams[param.name] = value;
        }
      });

    // Construct URL with query parameters
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${queryString}`;
    }

    return baseUrl;
  };

  /**
   * Copies full URL to clipboard
   * @async
   * @function copyFullUrl
   */
  const copyFullUrl = async () => {
    try {
      const fullUrl = constructFullUrl();
      await navigator.clipboard.writeText(fullUrl);
      notify.success('URL با موفقیت کپی شد');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      notify.error('خطا در کپی URL');
    }
  };

  /**
   * Opens URL in new tab
   * @function openUrlInNewTab
   */
  const openUrlInNewTab = () => {
    const fullUrl = constructFullUrl();
    if (fullUrl && fullUrl.startsWith('http')) {
      window.open(fullUrl, '_blank', 'noopener,noreferrer');
    }
  };

  /**
   * Copies response headers to clipboard
   * @async
   * @function copyResponseHeaders
   */
  const copyResponseHeaders = async () => {
    if (testResult?.headers) {
      try {
        await navigator.clipboard.writeText(
          JSON.stringify(testResult.headers, null, 2)
        );
        notify.success('هدرها با موفقیت کپی شدند');
      } catch (error) {
        console.error('Failed to copy headers:', error);
        notify.error('خطا در کپی هدرها');
      }
    }
  };

  /**
   * Updates test parameter value
   * @function updateTestParameter
   * @param {number} id - Parameter ID
   * @param {string} value - New value
   */
  const updateTestParameter = (id, value) => {
    const param = formData.parameters.find((p) => p.id === id);
    if (param) {
      setTestValues((prev) => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          [param.name]: value,
        },
      }));
    }
  };

  /**
   * Updates test header value
   * @function updateTestHeader
   * @param {number} id - Header ID
   * @param {string} value - New value
   */
  const updateTestHeader = (id, value) => {
    const header = formData.headers.find((h) => h.id === id);
    if (header) {
      setTestValues((prev) => ({
        ...prev,
        headers: {
          ...prev.headers,
          [header.key]: value,
        },
      }));
    }
  };

  /**
   * Handles test execution
   * @async
   * @function handleTest
   */
  const handleTest = async () => {
    const testData = {
      parameters: testValues.parameters,
      headers: testValues.headers,
      body: testValues.body,
    };

    await testApi(testData);
  };

  /**
   * Resets test values to defaults
   * @function resetTestValues
   */
  const resetTestValues = () => {
    const defaultParams = {};
    formData.parameters.forEach((param) => {
      if (param.default_value) {
        defaultParams[param.name] = param.default_value;
      }
    });

    const defaultHeaders = {};
    formData.headers.forEach((header) => {
      if (header.value) {
        defaultHeaders[header.key] = header.value;
      }
    });

    setTestValues({
      parameters: defaultParams,
      headers: defaultHeaders,
      body: formData.request_body.example || '',
    });
  };

  /**
   * Gets status color for badge
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
   * Formats response data for display
   * @function formatResponseData
   * @param {Object} result - Test result
   * @returns {string} Formatted data
   */
  const formatResponseData = (result) => {
    if (!result || !result.data) return '';

    try {
      if (typeof result.data === 'string') {
        const parsed = JSON.parse(result.data);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(result.data, null, 2);
    } catch (error) {
      return String(result.data);
    }
  };

  // Initialize test values when form data changes
  useEffect(() => {
    resetTestValues();
  }, [formData.parameters, formData.headers]);

  const fullUrl = constructFullUrl();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('basic')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="بازگشت به تنظیمات"
            >
              <TbChevronLeft className="text-gray-600 dark:text-gray-400" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TbTestPipe />
              تست کامل API
            </h3>
          </div>

          <button
            onClick={resetTestValues}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            بازنشانی مقادیر
          </button>
        </div>

        <div className="space-y-6">
          {/* Request Configuration */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
              پیکربندی درخواست
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  متد HTTP
                </label>
                <select
                  value={formData.http_method}
                  onChange={(e) =>
                    handleInputChange('http_method', null, e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تایم‌اوت (ثانیه)
                </label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={formData.timeout}
                  onChange={(e) =>
                    handleInputChange('timeout', null, parseInt(e.target.value))
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* URL Complete Section - Enhanced */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL کامل
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFullUrl(!showFullUrl)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {showFullUrl ? 'نمایش مختصر' : 'نمایش کامل'}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {/* Method and Base URL */}
                <div className="flex items-stretch rounded-lg overflow-hidden border dark:border-gray-700">
                  <div className="px-3 sm:px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium flex items-center justify-center min-w-[70px]">
                    {formData.http_method}
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-3">
                    <div className="font-mono text-sm text-gray-800 dark:text-gray-200 break-all text-left dir-ltr">
                      {fullUrl}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row border-r dark:border-gray-700">
                    <button
                      onClick={copyFullUrl}
                      className="px-3 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                      title="کپی URL"
                    >
                      <TbCopy
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </button>
                    <button
                      onClick={openUrlInNewTab}
                      disabled={!fullUrl.startsWith('http')}
                      className="px-3 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center border-t sm:border-t-0 sm:border-l dark:border-gray-700"
                      title="باز کردن در تب جدید"
                    >
                      <TbExternalLink
                        size={18}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    </button>
                  </div>
                </div>

                {/* URL Breakdown (only shown when expanded) */}
                {showFullUrl && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 p-4">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <TbLink size={16} />
                      تجزیه URL
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          آدرس پایه
                        </div>
                        <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded text-left dir-ltr">
                          {formData.base_url || '(تعریف نشده)'}
                        </div>
                      </div>

                      {formData.endpoint_path && (
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            مسیر اندپوینت
                          </div>
                          <div className="font-mono text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-left dir-ltr">
                            {formData.endpoint_path}
                          </div>
                        </div>
                      )}

                      {/* Query Parameters */}
                      {formData.parameters.filter((p) => p.location === 'query')
                        .length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            پارامترهای Query
                          </div>
                          <div className="space-y-1">
                            {formData.parameters
                              .filter((param) => param.location === 'query')
                              .map((param) => {
                                const value =
                                  testValues.parameters[param.name] ||
                                  param.default_value ||
                                  '';
                                return (
                                  <div
                                    key={param.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <span className="font-mono text-indigo-600 dark:text-indigo-400 min-w-[120px] text-left dir-ltr">
                                      {param.name}
                                    </span>
                                    <span className="text-gray-500">=</span>
                                    <span className="font-mono bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded flex-1 text-left dir-ltr">
                                      {value || '(بدون مقدار)'}
                                    </span>
                                    {param.required && (
                                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs rounded">
                                        الزامی
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      {/* URL Preview */}
                      <div className="pt-2 border-t dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          پیش‌نمایش نهایی
                        </div>
                        <div className="font-mono text-xs bg-gray-900 text-gray-200 p-3 rounded overflow-x-auto text-left dir-ltr">
                          {fullUrl}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Parameters for Test */}
          {formData.parameters.filter((p) => p.location !== 'query').length >
            0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                پارامترهای تست (بدنه)
              </h4>
              <div className="space-y-3">
                {formData.parameters
                  .filter((param) => param.location !== 'query')
                  .map((param) => (
                    <div
                      key={param.id}
                      className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            نام پارامتر
                          </label>
                          <div className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                            {param.name} ({param.location})
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            مقدار تست
                          </label>
                          <input
                            type="text"
                            value={
                              testValues.parameters[param.name] ||
                              param.default_value ||
                              ''
                            }
                            onChange={(e) =>
                              updateTestParameter(param.id, e.target.value)
                            }
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            placeholder={`مقدار ${param.name}`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            نوع
                          </label>
                          <div className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                            {param.type}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            الزامی
                          </label>
                          <div
                            className={`px-3 py-2 text-sm border rounded ${
                              param.required
                                ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                            }`}
                          >
                            {param.required ? 'بله' : 'خیر'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Headers for Test */}
          {formData.headers.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                هدرهای تست
              </h4>
              <div className="space-y-3">
                {formData.headers.map((header) => (
                  <div
                    key={header.id}
                    className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          کلید
                        </label>
                        <div className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                          {header.key}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          مقدار تست
                        </label>
                        <input
                          type="text"
                          value={
                            testValues.headers[header.key] || header.value || ''
                          }
                          onChange={(e) =>
                            updateTestHeader(header.id, e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          الزامی
                        </label>
                        <div
                          className={`px-3 py-2 text-sm border rounded ${
                            header.required
                              ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                          }`}
                        >
                          {header.required ? 'بله' : 'خیر'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body for Test */}
          {(formData.http_method === 'POST' ||
            formData.http_method === 'PUT' ||
            formData.http_method === 'PATCH') &&
            formData.request_body.enabled && (
              <div>
                <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-4">
                  بدنه درخواست (JSON)
                </h4>
                <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <textarea
                    value={testValues.body}
                    onChange={(e) =>
                      setTestValues((prev) => ({
                        ...prev,
                        body: e.target.value,
                      }))
                    }
                    rows={8}
                    className="w-full px-3 py-2 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                    spellCheck="false"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs text-gray-500">
                      حجم: {new TextEncoder().encode(testValues.body).length}{' '}
                      بایت
                    </div>
                    <button
                      onClick={() => {
                        try {
                          const formatted = JSON.stringify(
                            JSON.parse(testValues.body),
                            null,
                            2
                          );
                          setTestValues((prev) => ({
                            ...prev,
                            body: formatted,
                          }));
                        } catch (error) {
                          console.error('Invalid JSON');
                        }
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      فرمت JSON
                    </button>
                  </div>
                </div>
              </div>
            )}

          {/* Test Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleTest}
              disabled={isTesting || !formData.base_url}
              className="flex-1 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <TbRefresh className="animate-spin" />
                  در حال ارسال درخواست...
                </>
              ) : (
                <>
                  <TbSend />
                  ارسال درخواست تست
                </>
              )}
            </button>

            <div className="text-xs text-gray-500">
              {formData.http_method} • تایم‌اوت: {formData.timeout} ثانیه
            </div>
          </div>

          {/* Test Results */}
          {testResult && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  نتیجه تست
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyTestResponse}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                  >
                    <TbCopy size={16} />
                    کپی پاسخ
                  </button>
                  <button
                    onClick={() => setTestResult(null)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    پاک کردن نتایج
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          testResult.status === 0
                            ? 'bg-red-500'
                            : testResult.status >= 200 &&
                                testResult.status < 300
                              ? 'bg-green-500'
                              : testResult.status >= 400 &&
                                  testResult.status < 500
                                ? 'bg-orange-500'
                                : testResult.status >= 500
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                        }`}
                      />
                      <div
                        className={`px-2 py-1 text-sm font-medium rounded ${getStatusColor(testResult.status)}`}
                      >
                        {testResult.status === 0
                          ? 'خطای شبکه'
                          : testResult.status}
                        {testResult.statusText && ` • ${testResult.statusText}`}
                      </div>
                    </div>
                    {testResult.status !== 0 && testResult.duration && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <TbClock size={14} />
                        زمان: {testResult.duration}ms
                      </div>
                    )}
                    {testResult.status !== 0 && testResult.size && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <TbDatabase size={14} />
                        حجم: {testResult.size}
                      </div>
                    )}
                  </div>
                </div>

                {testResult.status === 0 && (
                  <div className="p-4 border-b dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-start gap-3">
                      <TbAlertCircle
                        className="text-red-500 mt-0.5"
                        size={20}
                      />
                      <div>
                        <h5 className="font-medium text-red-800 dark:text-red-300">
                          خطای اتصال به سرور
                        </h5>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          {testResult.data?.details ||
                            'اتصال به سرور برقرار نشد'}
                        </p>
                        {testResult.data?.suggestion && (
                          <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded">
                            <p className="text-xs font-medium text-red-700 dark:text-red-500 mb-1">
                              پیشنهادات عیب‌یابی:
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {testResult.data.suggestion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    بدنه پاسخ
                  </h5>
                  <pre className="p-4 bg-gray-900 text-gray-200 rounded-lg overflow-auto max-h-96 text-sm text-left dir-ltr">
                    {formatResponseData(testResult)}
                  </pre>
                </div>

                {testResult.status !== 0 &&
                  Object.keys(testResult.headers).length > 0 && (
                    <div className="p-4 border-t dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          هدرهای پاسخ
                        </h5>
                        <button
                          onClick={copyResponseHeaders}
                          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          <TbCopy size={12} />
                          کپی هدرها
                        </button>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(testResult.headers).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center py-2 border-b dark:border-gray-700 last:border-0"
                            >
                              <span className="font-mono text-sm text-gray-700 dark:text-gray-300 min-w-[200px] text-left dir-ltr">
                                {key}:
                              </span>
                              <span className="font-mono text-sm text-gray-600 dark:text-gray-400 text-left dir-ltr">
                                {value}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestTab;
