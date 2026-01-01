import React, { useEffect, useState } from 'react';
import { ApiIntegrationCard } from '@components/apiIntegrations';
import 'react-loading-skeleton/dist/skeleton.css';
import { Pagination } from '@components/ui/pagination';
import { notify } from '@components/ui/toast';
import { confirm } from '@components/ui/alert/confirmation';
import { Link, useSearchParams } from 'react-router-dom';
import { ApiIntegrationLoading } from './ApiIntegationLoading';
import { useDisplay } from 'hooks/display';
import Icon from '@components/ui/Icon'; // Import the Icon component

/**
 * Mock data for API integrations
 * @constant
 * @type {Array}
 */
const MOCK_INTEGRATIONS = [
  {
    id: 1,
    name: 'OpenAI GPT-4',
    integration_type: 'openai',
    base_url: 'https://api.openai.com/v1',
    api_key: 'sk-proj-abc123def456ghi789jkl012mno345',
    description: 'هوش مصنوعی GPT-4 برای پردازش متن',
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-03-20T14:45:00Z',
    usage_count: 1247,
    rate_limit: 1000,
  },
  {
    id: 2,
    name: 'Claude Anthropic',
    integration_type: 'anthropic',
    base_url: 'https://api.anthropic.com/v1',
    api_key: 'sk-ant-api03-xyz789uvw456rst123opq890',
    description: 'هوش مصنوعی کلود برای مکالمات طولانی',
    is_active: true,
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-03-18T11:20:00Z',
    usage_count: 892,
    rate_limit: 500,
  },
  {
    id: 3,
    name: 'API داخلی پردازش',
    integration_type: 'custom',
    base_url: 'https://api.internal.com/v1',
    api_key: 'int_sec_key_a1b2c3d4e5f6g7h8i9j0',
    description: 'API داخلی برای پردازش داده‌های خاص',
    is_active: false,
    created_at: '2024-01-25T16:45:00Z',
    updatedAt: '2024-03-10T08:30:00Z',
    usage_count: 156,
    rate_limit: 100,
  },
  {
    id: 4,
    name: 'DALL-E تصویرسازی',
    integration_type: 'openai',
    base_url: 'https://api.openai.com/v1/images',
    api_key: 'sk-proj-dalle-img-gen-789xyz123abc',
    description: 'ایجاد تصویر از متن با DALL-E 3',
    is_active: true,
    created_at: '2024-02-28T13:20:00Z',
    updated_at: '2024-03-22T10:15:00Z',
    usage_count: 345,
    rate_limit: 200,
  },
  {
    id: 5,
    name: 'Whisper ترجمه صدا',
    integration_type: 'openai',
    base_url: 'https://api.openai.com/v1/audio',
    api_key: 'sk-proj-whisper-audio-tr-456def789ghi',
    description: 'تبدیل گفتار به متن و ترجمه',
    is_active: true,
    created_at: '2024-03-05T11:10:00Z',
    updated_at: '2024-03-19T15:40:00Z',
    usage_count: 678,
    rate_limit: 300,
  },
  {
    id: 6,
    name: 'API آب و هوا',
    integration_type: 'custom',
    base_url: 'https://weather-api.com/v2',
    api_key: 'weather_api_key_1234567890abcdef',
    description: 'دریافت اطلاعات آب و هوای شهرها',
    is_active: true,
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-03-21T09:25:00Z',
    usage_count: 1234,
    rate_limit: 10000,
  },
];

/**
 * ApiIntegrationIndexPage Component - Main page for displaying and managing API integrations
 * @component
 * @returns {JSX.Element} Rendered API integrations index page
 */
const ApiIntegrationIndexPage = () => {
  /**
   * Display util hook for responsive design
   */
  const { isDesktop, height } = useDisplay();

  /**
   * URL Search Parameters for maintaining state
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get page from URL or default to 1
   */
  const initialPage = parseInt(searchParams.get('page')) || 1;

  /**
   * Pagination state
   */
  const [page, setPage] = useState(initialPage);

  /**
   * Update URL when page changes
   */
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [page]);

  /**
   * Pagination per page length
   * Calculate based on device type for optimal display
   */
  const perpage = isDesktop ? Math.floor((height - 200) / 115) * 3 : 6;

  /**
   * List of API integrations
   */
  const [integrations, setIntegrations] = useState([]);

  /**
   * Loading state
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Simulate data fetching with delay
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // Paginate mock data
      const startIndex = (page - 1) * perpage;
      const endIndex = startIndex + perpage;
      const paginatedData = MOCK_INTEGRATIONS.slice(startIndex, endIndex);

      setIntegrations(paginatedData);
      setIsLoading(false);
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [page, perpage]);

  /**
   * Auto scroll top on page state change
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  /**
   * Handles API integration deletion
   * @async
   * @function handleDeleteIntegration
   * @param {number} id - Integration ID to delete
   */
  const handleDeleteIntegration = async (id) => {
    confirm({
      title: 'حذف API',
      text: 'آیا از حذف این API مطمئن هستید؟ این عمل غیرقابل بازگشت است.',
      confirmButtonText: 'حذف',
      cancelButtonText: 'انصراف',
      onConfirm: async () => {
        // Optimistic update
        setIntegrations((prev) => prev.filter((item) => item.id !== id));
        notify.success('API با موفقیت حذف شد!');
      },
    });
  };

  /**
   * Handles status toggle for API integration
   * @async
   * @function handleStatusToggle
   * @param {number} id - Integration ID
   * @param {boolean} newStatus - New status value
   */
  const handleStatusToggle = async (id, newStatus) => {
    // Update local state
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_active: newStatus } : item
      )
    );
  };

  /**
   * Show skeleton loading during data fetch simulation
   */
  if (isLoading) return <ApiIntegrationLoading />;

  /**
   * Calculate statistics from mock data
   */
  const totalIntegrations = MOCK_INTEGRATIONS.length;
  const activeIntegrations = MOCK_INTEGRATIONS.filter(
    (i) => i.is_active
  ).length;
  const totalUsage = MOCK_INTEGRATIONS.reduce(
    (sum, item) => sum + item.usage_count,
    0
  );

  return (
    <div className="h-full flex flex-col justify-start md:pb-0">
      {/* Page header */}
      <div className="mx-3 md:mx-0 md:mb-6 pb-4 pt-3 md:pt-0 border-b border-gray-600 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
            <Icon name="Api" className="text-white text-2xl" size={24} />
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              API Integrations
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              مدیریت API‌های متصل به ربات - داده‌های نمایشی
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start lg:justify-end w-full lg:w-auto">
          <Link
            to={'/api-integrations/create'}
            className="px-4 sm:px-6 py-3 flex items-center justify-center rounded-xl font-medium transition-all bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl whitespace-nowrap min-w-[140px]"
          >
            <span>API جدید</span>
            <Icon name="CirclePlus" size={20} className="mr-2" />
          </Link>
          <button
            onClick={() => notify.info('این بخش در نسخه نمایشی فعال نیست')}
            className="px-4 sm:px-6 py-3 flex items-center justify-center rounded-xl font-medium transition-all bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 whitespace-nowrap min-w-[140px]"
          >
            <span>گزارش استفاده</span>
            <Icon name="ChartLine" size={18} className="mr-2" />
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-3 md:mx-0">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                کل API‌ها
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalIntegrations}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {totalUsage.toLocaleString()} درخواست
              </p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Icon name="Api" className="text-blue-500 text-xl" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                API فعال
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeIntegrations}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {Math.round((activeIntegrations / totalIntegrations) * 100)}%
                فعال
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                API غیرفعال
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalIntegrations - activeIntegrations}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                نیاز به بررسی
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo alert */}
      <div className="mx-3 md:mx-0 mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-lg">
            <Icon
              name="Api"
              className="text-amber-600 dark:text-amber-300"
              size={18}
            />
          </div>
          <div>
            <h4 className="font-medium text-amber-800 dark:text-amber-300">
              نسخه نمایشی
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              این بخش با داده‌های نمونه نمایش داده می‌شود. پس از اتصال به
              بک‌اند، داده‌های واقعی نمایش داده خواهند شد.
            </p>
          </div>
        </div>
      </div>

      {/* API integrations card list */}
      <div className="flex flex-col p-3 md:p-0">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            لیست API‌های متصل
          </h4>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {integrations.length} از {totalIntegrations} آیتم
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <ApiIntegrationCard
              key={integration.id}
              integration={integration}
              handleDelete={handleDeleteIntegration}
              handleStatusToggle={handleStatusToggle}
            />
          ))}
        </div>
      </div>

      {/* Empty integrations message */}
      {integrations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="inline-block p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 rounded-full mb-4">
            <Icon name="Api" className="text-4xl text-indigo-500" size={40} />
          </div>
          <h4 className="text-xl font-semibold mb-2">هیچ API‌ای یافت نشد</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            هنوز هیچ API‌ای به ربات متصل نشده است
          </p>
          <Link
            to={'/api-integrations/create'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            <Icon name="CirclePlus" size={18} />
            افزودن اولین API
          </Link>
        </div>
      )}

      {/* Pagination */}
      {integrations.length > 0 && (
        <div className="mt-8 pb-5 md:pb-0">
          <Pagination
            page={page}
            perpage={perpage}
            totalPages={Math.ceil(MOCK_INTEGRATIONS.length / perpage)}
            totalItems={MOCK_INTEGRATIONS.length}
            handlePageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default ApiIntegrationIndexPage;
