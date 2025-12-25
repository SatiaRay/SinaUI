import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPlus,
  FaSearch,
  FaFilter,
  FaTasks,
  FaCalendar,
  FaUsers,
  FaEdit,
  FaArchive,
  FaTrash,
} from 'react-icons/fa';
import { notify } from '@components/ui/toast';
import { confirm } from '@components/ui/alert/confirmation';
import ProjectIndexLoading from './ProjectIndexLoading';
import { useDisplay } from '../../../hooks/display';
import { Pagination } from '@components/ui/pagination';

/**
 * Import empty state SVG
 */
import FlowEmpty from './ProjectEmpty.svg';

/**
 * ProjectIndexPage Component - Displays and manages projects in a workspace
 * @component
 * @returns {JSX.Element} Rendered project page
 */
const ProjectIndexPage = () => {
  /**
   * Get workspace ID from localStorage instead of route params
   * @type {string|null}
   */
  const workspaceId = localStorage.getItem('khan-selected-workspace-id');

  const navigate = useNavigate();
  const { isDesktop, isMobile, height } = useDisplay();
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Loading states
   */
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [flows, setFlows] = useState([]);

  /**
   * Search and filter states
   */
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /**
   * Pagination state
   */
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);

  /**
   * Pagination per page length
   *
   * Define per page length according to device type to fill client device
   * height free spaces for better user experience
   * @type {number}
   */
  const perpage = isDesktop ? Math.floor((height - 250) / 180) * 3 : 6;

  /**
   * Load workspace and flows data on component mount
   * @returns {Promise<void>}
   */
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Check if workspace ID exists in localStorage
        if (!workspaceId) {
          notify.error('فضای کاری انتخاب نشده است');
          navigate('/workspace');
          return;
        }

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get workspace data (mock)
        const mockWorkspaces = [
          {
            id: 1,
            name: 'آکمی اینک',
            description: 'شرکت توسعه نرم‌افزارهای سازمانی',
            color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            letter: 'A',
            role: 'admin',
            plan: 'پرو',
            memberCount: 12,
            createdAt: '2023-10-15',
            updatedAt: '2024-01-20',
          },
          {
            id: 2,
            name: 'آکمی کورپ',
            description: 'هولدینگ سرمایه‌گذاری فناوری',
            color: 'bg-gradient-to-r from-green-500 to-emerald-500',
            letter: 'B',
            role: 'member',
            plan: 'استاندارد',
            memberCount: 8,
            createdAt: '2023-11-05',
            updatedAt: '2024-01-18',
          },
        ];

        // Parse workspace ID from localStorage (stored as string)
        const workspaceIdNum = parseInt(workspaceId);

        const foundWorkspace = mockWorkspaces.find(
          (w) => w.id === workspaceIdNum
        );

        if (!foundWorkspace) {
          notify.error('فضای کاری مورد نظر یافت نشد');
          navigate('/workspace');
          return;
        }

        setWorkspace(foundWorkspace);

        // Load flows (mock data)
        const mockFlows = [
          {
            id: 1,
            workspaceId: 1,
            name: 'پروژه مدیریت وظایف',
            description: 'سیستم مدیریت وظایف تیمی با قابلیت‌های پیشرفته',
            color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            letter: 'M',
            status: 'active',
            taskCount: 24,
            memberCount: 5,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-22',
            progress: 75,
            tags: ['مدیریت', 'تیمی', 'سازمانی'],
          },
          {
            id: 2,
            workspaceId: 1,
            name: 'پورتال مشتریان',
            description: 'پورتال اختصاصی برای مدیریت ارتباط با مشتریان',
            color: 'bg-gradient-to-r from-green-500 to-emerald-500',
            letter: 'P',
            status: 'active',
            taskCount: 18,
            memberCount: 3,
            createdAt: '2024-01-05',
            updatedAt: '2024-01-20',
            progress: 60,
            tags: ['مشتریان', 'پورتال', 'CRM'],
          },
          {
            id: 3,
            workspaceId: 1,
            name: 'اپلیکیشن موبایل',
            description: 'توسعه اپلیکیشن موبایل برای پلتفرم اصلی',
            color: 'bg-gradient-to-r from-purple-500 to-pink-500',
            letter: 'A',
            status: 'on-hold',
            taskCount: 42,
            memberCount: 7,
            createdAt: '2023-12-15',
            updatedAt: '2024-01-18',
            progress: 30,
            tags: ['موبایل', 'اپلیکیشن', 'توسعه'],
          },
          {
            id: 4,
            workspaceId: 1,
            name: 'سیستم گزارش‌گیری',
            description: 'ماژول پیشرفته گزارش‌گیری و تحلیل داده‌ها',
            color: 'bg-gradient-to-r from-orange-500 to-red-500',
            letter: 'R',
            status: 'completed',
            taskCount: 56,
            memberCount: 4,
            createdAt: '2023-11-20',
            updatedAt: '2024-01-15',
            progress: 100,
            tags: ['گزارش', 'تحلیل', 'داده'],
          },
          {
            id: 5,
            workspaceId: 1,
            name: 'وبسایت شرکت',
            description: 'طراحی و توسعه وبسایت جدید شرکت',
            color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
            letter: 'W',
            status: 'active',
            taskCount: 15,
            memberCount: 2,
            createdAt: '2024-01-12',
            updatedAt: '2024-01-25',
            progress: 45,
            tags: ['وبسایت', 'طراحی', 'توسعه'],
          },
          {
            id: 6,
            workspaceId: 1,
            name: 'سیستم اتوماسیون',
            description: 'اتوماسیون فرآیندهای داخلی شرکت',
            color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
            letter: 'S',
            status: 'planning',
            taskCount: 32,
            memberCount: 6,
            createdAt: '2024-01-18',
            updatedAt: '2024-01-24',
            progress: 10,
            tags: ['اتوماسیون', 'فرآیند', 'داخلی'],
          },
          {
            id: 7,
            workspaceId: 1,
            name: 'پروژه تحقیقاتی',
            description: 'پروژه تحقیقاتی در زمینه هوش مصنوعی',
            color: 'bg-gradient-to-r from-teal-500 to-green-500',
            letter: 'R',
            status: 'active',
            taskCount: 28,
            memberCount: 8,
            createdAt: '2024-01-08',
            updatedAt: '2024-01-23',
            progress: 65,
            tags: ['تحقیقات', 'هوش مصنوعی', 'علمی'],
          },
          {
            id: 8,
            workspaceId: 1,
            name: 'پروژه آرشیو شده',
            description: 'پروژه قدیمی که آرشیو شده است',
            color: 'bg-gradient-to-r from-gray-400 to-gray-600',
            letter: 'A',
            status: 'archived',
            taskCount: 12,
            memberCount: 2,
            createdAt: '2023-10-01',
            updatedAt: '2023-12-20',
            progress: 100,
            tags: ['قدیمی', 'آرشیو'],
          },
        ];

        const workspaceFlows = mockFlows.filter(
          (flow) => flow.workspaceId === workspaceIdNum
        );
        setFlows(workspaceFlows);
      } catch (error) {
        notify.error('خطا در بارگذاری اطلاعات');
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [workspaceId, navigate]);

  /**
   * Update URL when page changes
   */
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [page]);

  /**
   * Get status info for a flow
   * @param {string} status - Flow status
   * @returns {Object} Status color and text
   */
  const getStatusInfo = (status) => {
    switch (status) {
      case 'active':
        return {
          color:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          text: 'فعال',
          icon: '●',
        };
      case 'on-hold':
        return {
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          text: 'در انتظار',
          icon: '⏸',
        };
      case 'completed':
        return {
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          text: 'تکمیل شده',
          icon: '✓',
        };
      case 'planning':
        return {
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
          text: 'در حال برنامه‌ریزی',
          icon: '📋',
        };
      case 'archived':
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'آرشیو شده',
          icon: '🗄',
        };
      default:
        return {
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          text: 'نامشخص',
          icon: '?',
        };
    }
  };

  /**
   * Filter flows based on search term and filters
   * @type {Array}
   */
  const filteredFlows = flows.filter((flow) => {
    // Search filter
    const matchesSearch =
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Status filter
    const matchesStatus =
      filterStatus === 'all' || flow.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  /**
   * Paginate filtered flows
   * @type {Array}
   */
  const paginatedFlows = filteredFlows.slice(
    (page - 1) * perpage,
    page * perpage
  );

  /**
   * Calculate total pages for pagination
   * @type {number}
   */
  const totalPages = Math.ceil(filteredFlows.length / perpage);

  /**
   * Handle flow archive
   * @param {number} flowId - Flow ID
   * @param {string} flowName - Flow name
   * @returns {Promise<void>}
   */
  const handleArchiveFlow = (flowId, flowName) => {
    confirm({
      title: 'آرشیو کردن پروژه',
      text: `آیا می‌خواهید پروژه "${flowName}" را آرشیو کنید؟`,
      onConfirm: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setFlows((prev) =>
            prev.map((flow) =>
              flow.id === flowId ? { ...flow, status: 'archived' } : flow
            )
          );
          notify.success('پروژه با موفقیت آرشیو شد');
        } catch (error) {
          notify.error('خطا در آرشیو کردن پروژه');
        }
      },
    });
  };

  /**
   * Handle flow delete
   * @param {number} flowId - Flow ID
   * @param {string} flowName - Flow name
   * @returns {Promise<void>}
   */
  const handleDeleteFlow = (flowId, flowName) => {
    confirm({
      title: 'حذف پروژه',
      text: `آیا مطمئن هستید که می‌خواهید پروژه "${flowName}" را حذف کنید؟ این عمل غیرقابل بازگشت است.`,
      confirmText: 'حذف کن',
      confirmColor: 'red',
      onConfirm: async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));
          setFlows((prev) => prev.filter((flow) => flow.id !== flowId));
          notify.success('پروژه با موفقیت حذف شد');
        } catch (error) {
          notify.error('خطا در حذف پروژه');
        }
      },
    });
  };

  /**
   * Handle clear all filters
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setPage(1);
    setShowMobileFilters(false);
  };

  /**
   * Get unique statuses from flows
   * @type {Array<string>}
   */
  const uniqueStatuses = ['all', ...new Set(flows.map((flow) => flow.status))];

  /**
   * Auto scroll top on page state change
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  /**
   * Show loading skeleton if data is loading
   */
  if (isLoading || !workspace) {
    return <ProjectIndexLoading />;
  }

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Page header */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to={`/workspace/${workspaceId}`}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <FaArrowLeft className="text-lg" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                پروژه‌های {workspace.name}
              </h1>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
                مدیریت و مشاهده تمام پروژه‌های این فضای کاری
              </p>
            </div>
          </div>
          <Link
            to={`/projects/create`}
            className="px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-md hover:shadow-lg"
          >
            <FaPlus />
            پروژه جدید
          </Link>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="md:mx-0 mb-6 md:mb-8 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="جستجوی پروژه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 md:pr-12 pl-3 md:pl-4 py-2.5 md:py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch className="text-sm md:text-base" />
            </div>
          </div>

          {/* Desktop filters */}
          {isDesktop ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <FaFilter />
                <span>فیلتر:</span>
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full pl-10 min-w-[140px] bg-no-repeat bg-[center_left_0.75rem] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all'
                      ? 'همه وضعیت‌ها'
                      : getStatusInfo(status).text}
                  </option>
                ))}
              </select>

              {/* Clear filters button */}
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          ) : (
            /* Mobile filter button */
            <div className="flex gap-2">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-300 transition-colors flex-1 justify-center"
              >
                <FaFilter className="text-sm" />
                <span className="text-sm">فیلترها</span>
                {filterStatus !== 'all' && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm"
                >
                  پاک کردن
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile filter modal */}
        {showMobileFilters && !isDesktop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:hidden">
            <div className="bg-white dark:bg-gray-800 w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  فیلتر وضعیت
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Status filter for mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وضعیت
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status);
                          setShowMobileFilters(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterStatus === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status === 'all' ? 'همه' : getStatusInfo(status).text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={handleClearFilters}
                  className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  پاک کردن همه
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                >
                  اعمال فیلتر
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="md:mx-0 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredFlows.length} پروژه یافت شد
            {searchTerm && ` برای "${searchTerm}"`}
            {filterStatus !== 'all' &&
              ` با وضعیت "${getStatusInfo(filterStatus).text}"`}
          </span>
          <div className="flex items-center gap-2">
            {filteredFlows.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                صفحه {page} از {totalPages}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects grid - Responsive auto-fit with minimum 340px */}
      <div className="flex flex-col p-0">
        <div
          className="grid gap-4 md:gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          }}
        >
          {paginatedFlows.length > 0 ? (
            paginatedFlows.map((flow) => {
              const statusInfo = getStatusInfo(flow.status);
              return (
                <div
                  key={flow.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Flow header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`${flow.color} w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-white text-lg md:text-xl font-bold cursor-pointer hover:opacity-90 transition-opacity`}
                        onClick={() => navigate(`/projects/${flow.id}`)}
                      >
                        {flow.letter}
                      </div>
                      <div>
                        <h3
                          className="font-bold text-gray-900 dark:text-white text-base md:text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => navigate(`/projects/${flow.id}`)}
                        >
                          {flow.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.icon} {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/projects/edit/${flow.id}`}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="ویرایش"
                      >
                        <FaEdit className="text-sm" />
                      </Link>
                      <button
                        onClick={() => handleArchiveFlow(flow.id, flow.name)}
                        className="p-1.5 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="آرشیو"
                      >
                        <FaArchive className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteFlow(flow.id, flow.name)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Flow description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {flow.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>پیشرفت</span>
                      <span>{flow.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          flow.progress < 30
                            ? 'bg-red-500'
                            : flow.progress < 70
                              ? 'bg-yellow-500'
                              : flow.progress < 100
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                        }`}
                        style={{ width: `${flow.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  {flow.tags && flow.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {flow.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {flow.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                          +{flow.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Flow stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FaUsers className="text-gray-400 text-xs" />
                        <span>{flow.memberCount}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FaTasks className="text-gray-400 text-xs" />
                        <span>{flow.taskCount}</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <FaCalendar className="inline ml-1" />
                      {new Date(flow.updatedAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            /* Empty state - Keep original container */
            <div
              className="col-span-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 text-center"
              style={{ gridColumn: '1 / -1' }}
            >
              <div className="flex justify-center mb-6">
                <img
                  src={FlowEmpty}
                  alt="هیچ پروژه‌ای یافت نشد"
                  className="w-48 h-48 md:w-64 md:h-64"
                />
              </div>
              <h4 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                {searchTerm || filterStatus !== 'all'
                  ? 'هیچ پروژه‌ای مطابق با فیلترهای شما یافت نشد'
                  : 'هنوز پروژه‌ای در این فضای کاری ایجاد نشده است'}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm md:text-base">
                {searchTerm || filterStatus !== 'all'
                  ? 'سعی کنید فیلترهای جستجو را تغییر دهید یا عبارت دیگری را جستجو کنید.'
                  : 'اولین پروژه خود را ایجاد کنید و کار تیمی را در این فضای کاری شروع کنید.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {(searchTerm || filterStatus !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    پاک کردن فیلترها
                  </button>
                )}
                <Link
                  to={`/projects/create`}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 justify-center"
                >
                  <FaPlus />
                  ایجاد پروژه جدید
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredFlows.length > 0 && (
        <div className="pb-6 md:pb-8 mt-6 md:mt-8">
          <Pagination
            page={page}
            perpage={perpage}
            totalPages={totalPages}
            totalItems={filteredFlows.length}
            handlePageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectIndexPage;
