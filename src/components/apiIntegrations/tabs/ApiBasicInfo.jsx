import React from 'react';
import { TbSettings } from 'react-icons/tb';

/**
 * Basic Information Tab Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.isMobile - Mobile detection flag
 * @returns {JSX.Element} Rendered basic info tab
 */
const ApiBasicInfo = ({ formData, handleInputChange, isMobile }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
          <TbSettings />
          اطلاعات پایه API
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              نام API *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', null, e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="مثال: OpenAI GPT-4 API"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              نمایش در لیست API‌ها
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                handleInputChange('description', null, e.target.value)
              }
              rows={isMobile ? 3 : 4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="این API برای دسترسی به قابلیت‌های هوش مصنوعی GPT-4 استفاده می‌شود..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              توضیح مختصر درباره عملکرد API
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                دسته‌بندی
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange('category', null, e.target.value)
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              >
                <option value="">انتخاب کنید</option>
                <option value="ai">هوش مصنوعی</option>
                <option value="payment">پرداخت</option>
                <option value="crm">CRM</option>
                <option value="communication">ارتباطات</option>
                <option value="data">داده‌ها</option>
                <option value="custom">سفارشی</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                برچسب‌ها (Tags)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) =>
                  handleInputChange(
                    'tags',
                    null,
                    e.target.value.split(',').map((tag) => tag.trim())
                  )
                }
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                placeholder="openai, gpt4, ai, chat"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                با کاما جدا کنید
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
          URL پایه
        </h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              URL پایه (Base URL) *
            </label>
            <input
              type="text"
              value={formData.base_url}
              onChange={(e) =>
                handleInputChange('base_url', null, e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="https://api.openai.com/v1"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              مانند: https://api.example.com/v1
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              مسیر (Endpoint Path)
            </label>
            <input
              type="text"
              value={formData.endpoint_path}
              onChange={(e) =>
                handleInputChange('endpoint_path', null, e.target.value)
              }
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="/chat/completions"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              مانند: /chat/completions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiBasicInfo;
