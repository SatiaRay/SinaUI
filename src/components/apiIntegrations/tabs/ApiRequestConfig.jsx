import React from 'react';
import { TbCode, TbJson, TbPlus, TbTrash } from 'react-icons/tb';

/**
 * Parameter Item Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.param - Parameter object
 * @param {Function} props.updateParameter - Function to update parameter
 * @param {Function} props.removeParameter - Function to remove parameter
 * @param {Function} props.showDeleteConfirmation - Delete confirmation function
 * @param {number} props.totalParameters - Total number of parameters
 * @returns {JSX.Element} Rendered parameter item
 */
const ParameterItem = ({
  param,
  updateParameter,
  removeParameter,
  showDeleteConfirmation,
  totalParameters,
}) => (
  <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          نام
        </label>
        <input
          type="text"
          value={param.name}
          onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="api_key"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          نوع
        </label>
        <select
          value={param.type}
          onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="array">Array</option>
          <option value="object">Object</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          موقعیت
        </label>
        <select
          value={param.location}
          onChange={(e) =>
            updateParameter(param.id, 'location', e.target.value)
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
        >
          <option value="query">Query</option>
          <option value="header">Header</option>
          <option value="path">Path</option>
          <option value="body">Body</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={param.required}
            onChange={(e) =>
              updateParameter(param.id, 'required', e.target.checked)
            }
            className="rounded"
            id={`required-${param.id}`}
          />
          <label
            htmlFor={`required-${param.id}`}
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            الزامی
          </label>
        </div>
        {totalParameters > 1 && (
          <button
            onClick={() =>
              showDeleteConfirmation(
                `پارامتر "${param.name || 'بدون نام'}"`,
                () => removeParameter(param.id)
              )
            }
            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <TbTrash size={16} />
          </button>
        )}
      </div>

      <div className="md:col-span-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          توضیحات
        </label>
        <input
          type="text"
          value={param.description}
          onChange={(e) =>
            updateParameter(param.id, 'description', e.target.value)
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="توضیح پارامتر"
        />
      </div>

      <div className="md:col-span-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          مقدار پیش‌فرض
        </label>
        <input
          type="text"
          value={param.default_value}
          onChange={(e) =>
            updateParameter(param.id, 'default_value', e.target.value)
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="مقدار پیش‌فرض"
        />
      </div>
    </div>
  </div>
);

/**
 * Header Item Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.header - Header object
 * @param {Function} props.updateHeader - Function to update header
 * @param {Function} props.removeHeader - Function to remove header
 * @param {Function} props.showDeleteConfirmation - Delete confirmation function
 * @param {number} props.totalHeaders - Total number of headers
 * @returns {JSX.Element} Rendered header item
 */
const HeaderItem = ({
  header,
  updateHeader,
  removeHeader,
  showDeleteConfirmation,
  totalHeaders,
}) => (
  <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/50">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          کلید
        </label>
        <input
          type="text"
          value={header.key}
          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="Content-Type"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          مقدار
        </label>
        <input
          type="text"
          value={header.value}
          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="application/json"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={header.required}
            onChange={(e) =>
              updateHeader(header.id, 'required', e.target.checked)
            }
            className="rounded"
            id={`header-required-${header.id}`}
          />
          <label
            htmlFor={`header-required-${header.id}`}
            className="text-xs text-gray-600 dark:text-gray-400"
          >
            الزامی
          </label>
        </div>
        {totalHeaders > 1 && (
          <button
            onClick={() =>
              showDeleteConfirmation(`هدر "${header.key || 'بدون نام'}"`, () =>
                removeHeader(header.id)
              )
            }
            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <TbTrash size={16} />
          </button>
        )}
      </div>

      <div className="md:col-span-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          توضیحات
        </label>
        <input
          type="text"
          value={header.description}
          onChange={(e) =>
            updateHeader(header.id, 'description', e.target.value)
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
          placeholder="نوع محتوای درخواست"
        />
      </div>
    </div>
  </div>
);

/**
 * Request Configuration Tab Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.handleInputChange - Function to handle input changes
 * @param {Function} props.addParameter - Function to add new parameter
 * @param {Function} props.updateParameter - Function to update parameter
 * @param {Function} props.removeParameter - Function to remove parameter
 * @param {Function} props.addHeader - Function to add new header
 * @param {Function} props.updateHeader - Function to update header
 * @param {Function} props.removeHeader - Function to remove header
 * @param {Function} props.showDeleteConfirmation - Delete confirmation function
 * @returns {JSX.Element} Rendered request config tab
 */
const ApiRequestConfig = ({
  formData,
  handleInputChange,
  addParameter,
  updateParameter,
  removeParameter,
  addHeader,
  updateHeader,
  removeHeader,
  showDeleteConfirmation,
}) => {
  return (
    <div className="space-y-6">
      {/* HTTP Method & Timeout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TbCode />
          تنظیمات درخواست
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>

      {/* Parameters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TbJson />
            پارامترها
          </h3>
          <button
            onClick={addParameter}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
          >
            <TbPlus size={16} />
            افزودن پارامتر
          </button>
        </div>

        <div className="space-y-4">
          {formData.parameters.map((param) => (
            <ParameterItem
              key={param.id}
              param={param}
              updateParameter={updateParameter}
              removeParameter={removeParameter}
              showDeleteConfirmation={showDeleteConfirmation}
              totalParameters={formData.parameters.length}
            />
          ))}
        </div>
      </div>

      {/* Headers */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <TbCode />
            هدرها
          </h3>
          <button
            onClick={addHeader}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
          >
            <TbPlus size={16} />
            افزودن هدر
          </button>
        </div>

        <div className="space-y-4">
          {formData.headers.map((header) => (
            <HeaderItem
              key={header.id}
              header={header}
              updateHeader={updateHeader}
              removeHeader={removeHeader}
              showDeleteConfirmation={showDeleteConfirmation}
              totalHeaders={formData.headers.length}
            />
          ))}
        </div>
      </div>

      {/* Request Body */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          بدنه درخواست (Request Body)
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.request_body.enabled}
                onChange={(e) =>
                  handleInputChange(
                    'request_body.enabled',
                    null,
                    e.target.checked
                  )
                }
                id="request-body-enabled"
              />
              <label
                htmlFor="request-body-enabled"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                فعال‌سازی بدنه درخواست
              </label>
            </div>
          </div>

          {formData.request_body.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  مثال JSON
                </label>
                <textarea
                  value={formData.request_body.example}
                  onChange={(e) =>
                    handleInputChange(
                      'request_body.example',
                      null,
                      e.target.value
                    )
                  }
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-sm text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  spellCheck="false"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  برای مستندات و تست
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  توضیحات
                </label>
                <textarea
                  value={formData.request_body.description}
                  onChange={(e) =>
                    handleInputChange(
                      'request_body.description',
                      null,
                      e.target.value
                    )
                  }
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiRequestConfig;
