import React, { useEffect, useState } from 'react';
import WorkspaceCard from '../../../components/workspace/WorkspaceCard';
import 'react-loading-skeleton/dist/skeleton.css';
import { Pagination } from '../../../components/ui/pagination';
import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { Link, useSearchParams } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { WorkspaceIndexLoading } from './WorkspaceIndexLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * Import empty state SVG
 */
import workspaceEmptyState from './workspaceEmptyState.svg';

/**
 * WorkspaceIndexPage Component - Main page for displaying and managing workspaces
 * @component
 * @returns {JSX.Element} Rendered workspace index page
 */
const WorkspaceIndexPage = () => {
  /**
   * Display util hook for responsive design
   */
  const { isDesktop, height, isMobile } = useDisplay();

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
   * Search and filter states
   */
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  /**
   * State for mobile filter modal
   */
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
   *
   * Define per page length according to device type to fill client device
   * height free spaces for better user experience
   */
  const perpage = isDesktop ? Math.floor((height - 250) / 180) * 3 : 6;

  /**
   * Mock data for workspaces - in real app this would come from API
   */
  const [workspaces, setWorkspaces] = useState([]);

  /**
   * Current active workspace state
   */
  const [currentWorkspace, setCurrentWorkspace] = useState(null);

  /**
   * Loading state for simulated API call
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Simulate fetching workspaces data
   */
  useEffect(() => {
    const simulateApiCall = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock workspaces data
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
        {
          id: 3,
          name: 'ایویل کورپ',
          description: 'استارت‌آپ هوش مصنوعی',
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          letter: 'C',
          role: 'admin',
          plan: 'رایگان',
          memberCount: 5,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-22',
        },
        {
          id: 4,
          name: 'تکنو پارس',
          description: 'ارائه دهنده خدمات ابری',
          color: 'bg-gradient-to-r from-red-500 to-orange-500',
          letter: 'T',
          role: 'member',
          plan: 'استاندارد',
          memberCount: 15,
          createdAt: '2023-09-22',
          updatedAt: '2024-01-19',
        },
        {
          id: 5,
          name: 'ایده پردازان',
          description: 'آژانس خلاقیت و نوآوری',
          color: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          letter: 'I',
          role: 'admin',
          plan: 'پرو',
          memberCount: 7,
          createdAt: '2023-12-01',
          updatedAt: '2024-01-21',
        },
        {
          id: 6,
          name: 'شرکت توسعه نرم‌افزارهای هوشمند ایران',
          description: 'توسعه‌دهنده راهکارهای هوشمند سازمانی',
          color: 'bg-gradient-to-r from-indigo-500 to-blue-500',
          letter: 'ش',
          role: 'owner',
          plan: 'پرو پیشرفته',
          memberCount: 25,
          createdAt: '2023-08-14',
          updatedAt: '2024-01-23',
        },
        {
          id: 7,
          name: 'داده کاوان',
          description: 'تحلیل داده و بیگ دیتا',
          color: 'bg-gradient-to-r from-teal-500 to-green-500',
          letter: 'د',
          role: 'member',
          plan: 'استاندارد',
          memberCount: 9,
          createdAt: '2024-01-05',
          updatedAt: '2024-01-17',
        },
        {
          id: 8,
          name: 'ابر آریا',
          description: 'ارائه خدمات زیرساخت ابری',
          color: 'bg-gradient-to-r from-gray-500 to-blue-400',
          letter: 'ا',
          role: 'admin',
          plan: 'پرو',
          memberCount: 18,
          createdAt: '2023-11-30',
          updatedAt: '2024-01-24',
        },
      ];

      setWorkspaces(mockWorkspaces);

      // Set current workspace from localStorage or default to first workspace
      const savedWorkspaceId = localStorage.getItem(
        'khan-selected-workspace-id'
      );
      const defaultWorkspace = savedWorkspaceId
        ? mockWorkspaces.find((w) => w.id === parseInt(savedWorkspaceId)) ||
          mockWorkspaces[0]
        : mockWorkspaces[0];

      setCurrentWorkspace(defaultWorkspace);
      setIsLoading(false);
    };

    simulateApiCall();
  }, []);

  /**
   * Filter workspaces based on search term and filters
   */
  const filteredWorkspaces = workspaces.filter((workspace) => {
    // Search filter
    const matchesSearch =
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Plan filter
    const matchesPlan = filterPlan === 'all' || workspace.plan === filterPlan;

    // Role filter
    const matchesRole = filterRole === 'all' || workspace.role === filterRole;

    return matchesSearch && matchesPlan && matchesRole;
  });

  /**
   * Paginate filtered workspaces
   */
  const paginatedWorkspaces = filteredWorkspaces.slice(
    (page - 1) * perpage,
    page * perpage
  );

  /**
   * Calculate total pages for pagination
   */
  const totalPages = Math.ceil(filteredWorkspaces.length / perpage);

  /**
   * Handle workspace selection
   * @param {Object} workspace - Selected workspace object
   */
  const handleWorkspaceSelect = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('khan-selected-workspace-id', workspace.id.toString());
    notify.success(`فضای کاری "${workspace.name}" انتخاب شد`);
  };

  /**
   * Handle workspace deletion
   * @param {number} workspaceId - ID of workspace to delete
   */
  const handleDeleteWorkspace = async (workspaceId) => {
    confirm({
      title: 'حذف فضای کاری',
      text: 'آیا از حذف این فضای کاری مطمئن هستید؟ این عمل قابل بازگشت نیست.',
      onConfirm: async () => {
        // Optimistic update
        const workspaceToDelete = workspaces.find((w) => w.id === workspaceId);
        setWorkspaces((prev) => prev.filter((w) => w.id !== workspaceId));

        // If deleting current workspace, select another one
        if (currentWorkspace?.id === workspaceId) {
          const remainingWorkspaces = workspaces.filter(
            (w) => w.id !== workspaceId
          );
          if (remainingWorkspaces.length > 0) {
            const newCurrent = remainingWorkspaces[0];
            setCurrentWorkspace(newCurrent);
            localStorage.setItem(
              'khan-selected-workspace-id',
              newCurrent.id.toString()
            );
          } else {
            setCurrentWorkspace(null);
            localStorage.removeItem('khan-selected-workspace-id');
          }
        }

        // Simulate API call
        try {
          // In real app, this would be an API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          notify.success('فضای کاری با موفقیت حذف شد!');
        } catch (err) {
          // Rollback on error
          setWorkspaces((prev) => [...prev, workspaceToDelete]);
          notify.error('خطا در حذف فضای کاری!');
        }
      },
    });
  };

  /**
   * Handle clear all filters
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterPlan('all');
    setFilterRole('all');
    setPage(1);
    setShowMobileFilters(false);
  };

  /**
   * Get unique plans from workspaces
   */
  const uniquePlans = ['all', ...new Set(workspaces.map((w) => w.plan))];

  /**
   * Get unique roles from workspaces
   */
  const uniqueRoles = ['all', ...new Set(workspaces.map((w) => w.role))];

  /**
   * Auto scroll top on page state change
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  /**
   * Show skeleton loading
   */
  if (isLoading) return <WorkspaceIndexLoading />;

  return (
    <div className="h-full flex flex-col justify-start pb-0 px-3 md:px-0">
      {/* Page header */}
      <div className="md:mx-0 md:mb-6 pt-4 pb-4 md:pb-6  border-b border-gray-600 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div className="w-full md:w-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            فضاهای کاری
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1 md:mt-2">
            مدیریت فضاهای کاری خود را اینجا انجام دهید
          </p>
        </div>
        <div className="flex flex-row-reverse gap-2 md:gap-3 w-full md:w-auto">
          <Link
            to={'/workspace/create'}
            className="px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-center rounded-lg md:rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md md:shadow-lg hover:shadow-xl text-sm md:text-base flex-1 md:flex-none"
          >
            <span>فضای کاری جدید</span>
            <GoPlusCircle size={18} className="pr-1.5 md:pr-2 box-content" />
          </Link>
          {isDesktop && (
            <Link
              to={'/workspace/invitations'}
              className="px-4 md:px-5 py-2.5 md:py-3 flex items-center justify-center rounded-lg md:rounded-xl font-medium transition-all bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-sm md:text-base"
            >
              <span>دعوت‌نامه‌ها</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="md:mx-0 my-4 md:my-6 bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          {/* Search input - Mobile optimized */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="جستجوی فضای کاری..."
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

              {/* Plan filter dropdown - Fixed padding and appearance */}
              <div className="relative">
                <select
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="appearance-none px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full min-w-[140px] pr-10"
                >
                  {uniquePlans.map((plan) => (
                    <option key={plan} value={plan}>
                      {plan === 'all' ? 'همه پلن‌ها' : plan}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Role filter dropdown - Fixed padding and appearance */}
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full min-w-[140px] pr-10"
                >
                  {uniqueRoles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'all'
                        ? 'همه نقش‌ها'
                        : role === 'admin'
                          ? 'مدیر'
                          : role === 'member'
                            ? 'عضو'
                            : role === 'owner'
                              ? 'مالک'
                              : role}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Clear filters button */}
              {(searchTerm || filterPlan !== 'all' || filterRole !== 'all') && (
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors whitespace-nowrap"
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
                {(filterPlan !== 'all' || filterRole !== 'all') && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {(searchTerm || filterPlan !== 'all' || filterRole !== 'all') && (
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
                  فیلترها
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Plan filter for mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    پلن
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniquePlans.map((plan) => (
                      <button
                        key={plan}
                        onClick={() => setFilterPlan(plan)}
                        className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          filterPlan === plan
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {plan === 'all' ? 'همه' : plan}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role filter for mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نقش
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          filterRole === role
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {role === 'all'
                          ? 'همه'
                          : role === 'admin'
                            ? 'مدیر'
                            : role === 'member'
                              ? 'عضو'
                              : role === 'owner'
                                ? 'مالک'
                                : role}
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
                  اعمال فیلترها
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count and current workspace */}
      <div className="md:mx-0 mb-3 md:mb-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
        {currentWorkspace && (
          <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
            فضای کاری فعلی:{' '}
            <strong className="font-bold">{currentWorkspace.name}</strong>
          </span>
        )}
        <span>
          {filteredWorkspaces.length} فضای کاری یافت شد
          {searchTerm && ` برای "${searchTerm}"`}
        </span>
      </div>

      {/* Workspace cards list - Mobile optimized */}
      <div className="flex flex-col p-0 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {paginatedWorkspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            handleDelete={handleDeleteWorkspace}
            onWorkspaceSelect={handleWorkspaceSelect}
            isCurrent={currentWorkspace?.id === workspace.id}
          />
        ))}
      </div>

      {/* Empty workspaces message */}
      {filteredWorkspaces.length < 1 && (
        <div className="text-center mx-auto my-8 md:my-12 px-4">
          <div className="flex justify-center mb-6">
            <img
              src={workspaceEmptyState}
              alt="هیچ فضای کاری یافت نشد"
              className="w-48 h-48 md:w-64 md:h-64"
            />
          </div>
          <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3">
            هیچ فضای کاری یافت نشد
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base max-w-md mx-auto">
            {searchTerm || filterPlan !== 'all' || filterRole !== 'all'
              ? 'فضای کاری مطابق با فیلترهای شما وجود ندارد. سعی کنید فیلترها را تغییر دهید.'
              : 'شما هنوز فضای کاری ایجاد نکرده‌اید. اولین فضای کاری خود را ایجاد کنید.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(searchTerm || filterPlan !== 'all' || filterRole !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="px-5 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                پاک کردن فیلترها
              </button>
            )}
            <Link
              to={'/workspace/create'}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
            >
              ایجاد فضای کاری جدید
            </Link>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pb-6 md:pb-8 mt-6 md:mt-8">
        <Pagination
          page={page}
          perpage={perpage}
          totalPages={totalPages}
          totalItems={filteredWorkspaces.length}
          handlePageChange={setPage}
        />
      </div>
    </div>
  );
};

export default WorkspaceIndexPage;
