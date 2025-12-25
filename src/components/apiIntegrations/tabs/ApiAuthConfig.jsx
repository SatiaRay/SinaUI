import React from 'react';
import { TbLock } from 'react-icons/tb';

/**
 * Authentication Configuration Tab Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.handleInputChange - Function to handle input changes
 * @returns {JSX.Element} Rendered auth config tab
 */
const ApiAuthConfig = ({ formData, handleInputChange }) => {
  /**
   * Toggles password visibility
   * @function togglePasswordVisibility
   * @param {Event} e - Click event
   */
  const togglePasswordVisibility = (e) => {
    const input = e.target.previousElementSibling;
    if (input && input.type === 'password') {
      input.type = 'text';
      e.target.textContent = '🙈';
    } else if (input) {
      input.type = 'password';
      e.target.textContent = '👁';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TbLock />
          تنظیمات احراز هویت
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              نوع احراز هویت
            </label>
            <select
              value={formData.authentication.type}
              onChange={(e) =>
                handleInputChange('authentication.type', null, e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="none">بدون احراز هویت</option>
              <option value="api_key">API Key</option>
              <option value="bearer_token">Bearer Token</option>
              <option value="basic_auth">Basic Auth</option>
              <option value="oauth2">OAuth 2.0</option>
              <option value="custom">سفارشی</option>
            </select>
          </div>

          {formData.authentication.type !== 'none' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    موقعیت
                  </label>
                  <select
                    value={formData.authentication.location}
                    onChange={(e) =>
                      handleInputChange(
                        'authentication.location',
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="header">Header</option>
                    <option value="query">Query Parameter</option>
                    <option value="cookie">Cookie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نام کلید
                  </label>
                  <input
                    type="text"
                    value={formData.authentication.key_name}
                    onChange={(e) =>
                      handleInputChange(
                        'authentication.key_name',
                        null,
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Authorization"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  فرمت مقدار
                </label>
                <input
                  type="text"
                  value={formData.authentication.value_format}
                  onChange={(e) =>
                    handleInputChange(
                      'authentication.value_format',
                      null,
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Bearer {token}"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  مثال: Bearer {`{token}`} یا {`{api_key}`}
                </p>
              </div>

              {formData.authentication.type === 'api_key' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    کلید API
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.authentication.token}
                      onChange={(e) =>
                        handleInputChange(
                          'authentication.token',
                          null,
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                      placeholder="sk-...xyz"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      👁
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    به صورت امن ذخیره می‌شود
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          محدودیت نرخ (Rate Limiting)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.rate_limiting.enabled}
                onChange={(e) =>
                  handleInputChange(
                    'rate_limiting.enabled',
                    null,
                    e.target.checked
                  )
                }
                id="rate-limiting-enabled"
              />
              <label
                htmlFor="rate-limiting-enabled"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                فعال‌سازی محدودیت نرخ
              </label>
            </div>
          </div>

          {formData.rate_limiting.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  درخواست در دقیقه
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.rate_limiting.requests_per_minute}
                  onChange={(e) =>
                    handleInputChange(
                      'rate_limiting.requests_per_minute',
                      null,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  درخواست در ساعت
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.rate_limiting.requests_per_hour}
                  onChange={(e) =>
                    handleInputChange(
                      'rate_limiting.requests_per_hour',
                      null,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiAuthConfig;
