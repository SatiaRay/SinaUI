import { useCallback, useState } from 'react';
import { notify } from '../../../components/ui/toast';
import { Export } from '@components/setting/Export';
import SettingsForm from '@components/setting/Form';
import { Import } from '@components/setting/Import';
import {
  useGetSettingsSchemaQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../../../store/api/ai-features/SystemApi';
import SettingIndexLoading from './SettingIndexLoading';
import Error from '@components/Error';

/**
 * Settings Component - System settings management
 *
 * This component is responsible for displaying and managing system settings including:
 * - Dynamic settings form based on schema
 * - Import/export functionality for settings
 * - Loading and error state management
 *
 * @component
 * @example
 * return <Setting />
 *
 * @returns {JSX.Element} Settings component
 */
const Setting = () => {
  const [loading, setLoading] = useState(false);

  // Fetch settings form schema
  const {
    data: schemaData,
    isLoading: schemaLoading,
    error: schemaError,
  } = useGetSettingsSchemaQuery();

  // Fetch current settings values
  const {
    data: settingsData,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useGetSettingsQuery();

  // Mutation for updating settings
  const [updateSettings, { isLoading: updateLoading }] =
    useUpdateSettingsMutation();

  const settingsSchema = schemaData?.schema;
  const currentSettings = settingsData || {};

  /**
   * Handle settings form submission
   *
   * @async
   * @param {Object} data - Form data containing settings
   * @param {Object} data.settings - New settings values
   * @returns {Promise<void>}
   *
   * @throws {Error} Error when updating settings fails
   */
  const handleSubmit = useCallback(
    async (data) => {
      try {
        setLoading(true);
        const response = await updateSettings(data).unwrap();

        if (response) {
          notify.success('تنظیمات با موفقیت ذخیره شد!');
          await refetchSettings();
        }
      } catch (error) {
        notify.error(
          `خطا در ذخیره تنظیمات: ${error.data?.message || error.message}`
        );
      } finally {
        setLoading(false);
      }
    },
    [updateSettings, refetchSettings]
  );

  const isLoading =
    schemaLoading || settingsLoading || loading || updateLoading;
  const error = schemaError || settingsError;

  // Show loading state
  if (isLoading && !settingsData) {
    return <SettingIndexLoading />;
  }

  // Show error state
  if (error) {
    return (
      <Error onRetry={refetchSettings} message="خطا در دریافت تنظیمات سیستم" />
    );
  }

  return (
    <div className="min-h-screen from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 py-4 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            تنظیمات سیستم
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            پیکربندی ترجیحات برنامه و مدیریت تنظیمات
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-100 dark:shadow-blue-900/10 border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Form Section */}
          <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white text-center sm:text-right">
                پیکربندی سیستم
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <div
                  className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}
                ></div>
                <span className="text-xs sm:text-sm">
                  {isLoading ? 'در حال ذخیره سازی...' : 'همه سیستم‌ها فعال'}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {settingsSchema ? (
                <SettingsForm
                  schema={settingsSchema}
                  initialValues={currentSettings}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    schema تنظیمات در دسترس نیست
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Data Management Section */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-700/30">
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                مدیریت داده‌ها
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                پشتیبان‌گیری و بازیابی تنظیمات
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              <Export />
              <Import />
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-right leading-relaxed">
                    تنظیمات شما به طور خودکار ذخیره می‌شوند. از export برای
                    ایجاد پشتیبان و از import برای بازیابی تنظیمات قبلی استفاده
                    کنید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Setting;
