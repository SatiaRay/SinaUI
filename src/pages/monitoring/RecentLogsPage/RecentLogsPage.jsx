import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useGetRecentLogsQuery } from '../../../store/api/ai-features/monitoringLogsApi';
import LogCard from '../../../components/Monitoring/LogCard';
import { LogsSkeleton, FiltersSkeleton } from './LogsSkeletons';
import Error from '../../../components/Error';
import { useDisplay } from 'hooks/display';

/**
 * RecentLogsPage Component
 * Displays function calling logs with filtering and pagination capabilities
 * Uses RTK Query for efficient data fetching and caching
 */
const RecentLogsPage = () => {
  // State for search and filter parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [hasErrors, setHasErrors] = useState('all'); // all | true | false
  const [hours, setHours] = useState(24); // Time range in hours
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [page, setPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  /**
   * Response props
   */
  const { height, isLargeDisplay } = useDisplay();

  /**
   * Calculate active filters count
   */
  useEffect(() => {
    let count = 0;
    if (hasErrors !== 'all') count++;
    if (hours !== 24) count++;
    if (minDuration) count++;
    if (maxDuration) count++;
    if (searchQuery) count++;
    setActiveFilters(count);
  }, [hasErrors, hours, minDuration, maxDuration, searchQuery]);

  /**
   * Validate hours input - maximum 3 digits (0-999)
   */
  const validateHours = (value) => {
    if (value === '') return true;
    const numValue = Number(value);
    return numValue >= 0 && numValue <= 999 && value.length <= 3;
  };

  /**
   * Handle hours change with validation
   */
  const handleHoursChange = (value) => {
    if (value === '' || validateHours(value)) {
      setHours(value);
    }
  };

  /**
   * Handle search with debounce mechanism
   */
  const handleSearchChange = (value) => {
    setLocalSearchQuery(value);
  };

  /**
   * Apply search filter after delay (debounce)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearchQuery);
      setPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchQuery]);

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    setSearchQuery('');
    setLocalSearchQuery('');
    setHasErrors('all');
    setHours(24);
    setMinDuration('');
    setMaxDuration('');
    setPage(1);
  };

  /**
   * Prepare query parameters for API call
   * Converts filter states to appropriate API parameters
   */
  const queryParams = useMemo(() => {
    const params = {
      hours: hours ? Number(hours) : 24,
      page: page,
      per_page: 12,
      // Only include filters that have values
      ...(hasErrors !== 'all' && { has_errors: hasErrors === 'true' }),
      ...(minDuration && { min_duration: Number(minDuration) }),
      ...(maxDuration && { max_duration: Number(maxDuration) }),
      // Use tool_name instead of search parameter
      ...(searchQuery && { tool_name: searchQuery }),
    };

    return params;
  }, [hours, page, hasErrors, minDuration, maxDuration, searchQuery]);

  /**
   * RTK Query hook for fetching recent logs
   * Automatically handles loading, error, and caching states
   */
  const {
    data: logsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetRecentLogsQuery(queryParams);

  /**
   * Extract logs and pagination info from API response
   * Provides fallbacks for undefined response
   */
  const logs = logsData?.items || [];
  const totalPages = logsData?.total_pages || 1;
  const currentPage = logsData?.page || page;
  const totalItems = logsData?.total_count || 0;

  /**
   * Handle page change
   * Updates page state which triggers refetch via RTK Query
   * @param {number} newPage - Target page number
   */
  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  /**
   * Handle filter changes
   * Resets to first page when filters change
   */
  const handleFilterChange = () => {
    setPage(1);
  };

  /**
   * Handle retry action for error state
   * Triggers refetch of data
   */
  const handleRetry = () => {
    refetch();
  };

  /**
   * Effect to reset page when filters change (except search)
   * Ensures user sees results from first page after filter modification
   */
  useEffect(() => {
    setPage(1);
  }, [hours, hasErrors, minDuration, maxDuration]);

  /**
   * Reset to first page when current page exceeds total pages
   */
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [currentPage, totalPages]);

  // If there's an error, show only the Error component
  if (isError) {
    return (
      <>
        <Error error={error} onRetry={handleRetry} />
      </>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto scrollbar-hide">
      <div className="max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white mb-2">
            لاگ‌های اخیر
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مشاهده و مدیریت لاگ‌های سیستم
          </p>
        </div>

        {/* Main Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative min-w-0">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام ابزار..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-3 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-200
                ${
                  showFilters
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
            >
              <Filter className="w-4 h-4" />
              <span>فیلترها</span>
              {activeFilters > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>

            {/* Clear Filters Button */}
            {activeFilters > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400
                         hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                <span>پاک کردن</span>
              </button>
            )}
          </div>

          {/* Advanced Filters - Collapsible */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Error Filter Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    وضعیت خطا
                  </label>
                  <select
                    value={hasErrors}
                    onChange={(e) => {
                      setHasErrors(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl
                             dark:bg-gray-700 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200"
                  >
                    <option value="all">همه لاگ‌ها</option>
                    <option value="true">فقط خطاها</option>
                    <option value="false">فقط موفق</option>
                  </select>
                </div>

                {/* Hours Range Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    بازه زمانی (ساعت)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="999"
                    placeholder="مثلاً 24"
                    value={hours}
                    onChange={(e) => {
                      handleHoursChange(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl
                             dark:bg-gray-700 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             appearance-none
                             [&::-webkit-outer-spin-button]:appearance-none
                             [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Minimum Duration Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    حداقل مدت (میلی‌ثانیه)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="مثلاً 100"
                    value={minDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) {
                        setMinDuration(val);
                        handleFilterChange();
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl
                             dark:bg-gray-700 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             appearance-none
                             [&::-webkit-outer-spin-button]:appearance-none
                             [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                {/* Maximum Duration Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    حداکثر مدت (میلی‌ثانیه)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="مثلاً 5000"
                    value={maxDuration}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || Number(val) >= 0) {
                        setMaxDuration(val);
                        handleFilterChange();
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl
                             dark:bg-gray-700 dark:text-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             appearance-none
                             [&::-webkit-outer-spin-button]:appearance-none
                             [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        {!isLoading && logs.length > 0 && (
          <div className="mb-4 px-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              نمایش {logs.length} لاگ از {totalItems} نتیجه
              {activeFilters > 0 && ` (${activeFilters} فیلتر فعال)`}
            </p>
          </div>
        )}

        {/* Loading State - Show skeletons for logs */}
        {isLoading && <LogsSkeleton count={Math.floor(height / 150)} />}

        {/* Empty State */}
        {!isLoading && logs.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              هیچ لاگی یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery || activeFilters > 0
                ? 'لاگ‌هایی با معیارهای جستجوی شما مطابقت ندارند.'
                : 'در بازه زمانی انتخاب شده هیچ لاگی وجود ندارد.'}
            </p>
            {activeFilters > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                پاک کردن همه فیلترها
              </button>
            )}
          </div>
        )}

        {/* Logs Grid */}
        {!isLoading && logs.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {logs.map((log) => (
                <LogCard key={log.id} log={log} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                {/* Previous Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                           bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                           text-gray-700 dark:text-gray-200
                           disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  قبلی
                </button>

                {/* Page Indicator */}
                <div className="flex items-center gap-2">
                  <span className="text-sm dark:text-gray-300">
                    صفحه {currentPage} از {totalPages}
                  </span>
                </div>

                {/* Next Page Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                           bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                           text-gray-700 dark:text-gray-200
                           disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecentLogsPage;
