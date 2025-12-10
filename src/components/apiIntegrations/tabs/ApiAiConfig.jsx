import React from 'react';
import { TbApi } from 'react-icons/tb';
import { FaQuestionCircle } from 'react-icons/fa';

/**
 * AI Configuration Tab Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @param {Function} props.handleInputChange - Function to handle input changes
 * @returns {JSX.Element} Rendered AI config tab
 */
const ApiAiConfig = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TbApi />
          تنظیمات یکپارچه‌سازی با AI
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.ai_agent_config.expose_to_agents}
                onChange={(e) =>
                  handleInputChange(
                    'ai_agent_config.expose_to_agents',
                    null,
                    e.target.checked
                  )
                }
                id="expose-to-ai"
              />
              <label
                htmlFor="expose-to-ai"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                نمایش این API به AI Agent‌ها
              </label>
            </div>
          </div>

          {formData.ai_agent_config.expose_to_agents && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نام تابع (Function Name)
                </label>
                <input
                  type="text"
                  value={formData.ai_agent_config.function_name}
                  onChange={(e) =>
                    handleInputChange(
                      'ai_agent_config.function_name',
                      null,
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="get_weather_data"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  برای فراخوانی توسط AI
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  توضیحات برای AI
                </label>
                <textarea
                  value={formData.ai_agent_config.description}
                  onChange={(e) =>
                    handleInputChange(
                      'ai_agent_config.description',
                      null,
                      e.target.value
                    )
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="این API برای دریافت اطلاعات آب و هوای شهرها استفاده می‌شود. شهر را به عنوان ورودی دریافت می‌کند و دما، وضعیت آب و هوا و پیش‌بینی را برمی‌گرداند."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  توضیح عملکرد API برای ربات
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                      نکته مهم برای AI Agent
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      این API به صورت خودکار به AI Agent‌ها اضافه می‌شود. ربات
                      می‌تواند بر اساس context، از این API استفاده کند و نتایج
                      را در پاسخ‌های خود بگنجاند.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiAiConfig;
