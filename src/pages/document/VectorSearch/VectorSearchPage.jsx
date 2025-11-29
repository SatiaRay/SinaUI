import React, { useEffect, useState, useMemo } from 'react';
import { Search, Clock, Activity, Database } from 'lucide-react';
import VectorSearchLoading from './VectorSearchLoading';
import { VectorDocumentCard } from '@components/document/vector-searching/VectorDocumentCard';

/**
 * Mock data for vector search collections
 * This will be replaced with actual API data later
 */
const mockVectorData = {
  items: [
    {
      id: 1,
      title: 'مستندات فنی',
      description: 'مجموعه‌ای از مستندات فنی و راهنماهای سیستم',
      status: 'active',
      documentCount: 1247,
      lastUpdated: '۲ ساعت پیش',
      dimensions: 768,
    },
    {
      id: 2,
      title: 'مقالات علمی',
      description: 'مقالات و پژوهش‌های علمی در زمینه هوش مصنوعی',
      status: 'active',
      documentCount: 856,
      lastUpdated: '۱ روز پیش',
      dimensions: 1024,
    },
    {
      id: 3,
      title: 'پرسش‌های متداول',
      description: 'پرسش‌های پرتکرار و پاسخ‌های مربوط به سرویس',
      status: 'inactive',
      documentCount: 342,
      lastUpdated: '۳ روز پیش',
      dimensions: 512,
    },
    {
      id: 4,
      title: 'مستندات API',
      description: 'مستندات کامل رابط برنامه‌نویسی نرم‌افزار',
      status: 'active',
      documentCount: 567,
      lastUpdated: '۵ ساعت پیش',
      dimensions: 768,
    },
    {
      id: 5,
      title: 'دانش‌پایه داخلی',
      description: 'اطلاعات و دانش داخلی سازمان و شرکت',
      status: 'active',
      documentCount: 2105,
      lastUpdated: 'هم اکنون',
      dimensions: 1536,
    },
    {
      id: 6,
      title: 'مقالات بازاریابی',
      description: 'محتواهای بازاریابی و معرفی محصولات',
      status: 'inactive',
      documentCount: 189,
      lastUpdated: '۱ هفته پیش',
      dimensions: 512,
    },
  ],
  total_count: 6,
  page: 1,
  total_pages: 1,
};

/**
 * VectorSearchPage Component
 * Displays vector search collections with search functionality
 * Uses mock data temporarily until API is ready
 */
const VectorSearchPage = () => {
  // State for search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

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
   * Clear search
   */
  const clearSearch = () => {
    setSearchQuery('');
    setLocalSearchQuery('');
    setPage(1);
  };

  /**
   * Mock data filtering based on search query
   * This will be replaced with actual API call later
   */
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return mockVectorData;
    }

    const filteredItems = mockVectorData.items.filter(
      (item) =>
        item.title.includes(searchQuery) ||
        item.description.includes(searchQuery)
    );

    return {
      ...mockVectorData,
      items: filteredItems,
      total_count: filteredItems.length,
    };
  }, [searchQuery]);

  /**
   * Extract vector searches and pagination info from filtered data
   */
  const vectorSearches = filteredData.items || [];
  const totalPages = filteredData.total_pages || 1;
  const currentPage = filteredData.page || page;
  const totalItems = filteredData.total_count || 0;

  /**
   * Handle page change
   * Updates page state which will trigger refetch when API is ready
   * @param {number} newPage - Target page number
   */
  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  /**
   * Mock loading state for demonstration
   * Remove this when real API is implemented
   */
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto scrollbar-hide">
      <div className="max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold dark:text-white mb-2">
            جستجوی برداری
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            مدیریت و مشاهده مستندات با جستجوی برداری
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative min-w-0 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو در مستندات..."
                value={localSearchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-3 pr-9 sm:pr-10 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl
                         dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* Clear Search Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600
                         bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm sm:text-base
                         hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 w-full lg:w-auto justify-center"
              >
                <span>پاک کردن جستجو</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {!isLoading && vectorSearches.length > 0 && (
          <div className="mb-3 sm:mb-4 px-1 sm:px-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              نمایش {vectorSearches.length} مستند از {totalItems} نتیجه
              {searchQuery && ' (جستجو فعال)'}
            </p>
          </div>
        )}

        {/* Loading State - Show skeletons for vector searches */}
        {isLoading && <VectorSearchLoading count={6} />}

        {/* Empty State */}
        {!isLoading && vectorSearches.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Search className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              سندی یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4 max-w-md mx-auto px-4">
              {searchQuery
                ? 'هیچ سندی با معیارهای جستجوی شما مطابقت ندارد.'
                : 'هیچ سندی موجود نیست.'}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        )}

        {/* Vector Searches Grid */}
        {!isLoading && vectorSearches.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {vectorSearches.map((collection) => (
                <VectorDocumentCard key={collection.id} collection={collection} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="flex items-center gap-3 sm:gap-4 order-2 sm:order-1">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm font-medium
                             bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                             text-gray-700 dark:text-gray-200
                             disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600
                             transition-all duration-200 min-w-[80px] sm:min-w-[100px] justify-center"
                  >
                    قبلی
                  </button>

                  {/* Next Page Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm font-medium
                             bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                             text-gray-700 dark:text-gray-200
                             disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-600
                             transition-all duration-200 min-w-[80px] sm:min-w-[100px] justify-center"
                  >
                    بعدی
                  </button>
                </div>

                {/* Page Indicator */}
                <div className="flex items-center gap-2 order-1 sm:order-2 mb-2 sm:mb-0">
                  <span className="text-sm dark:text-gray-300">
                    صفحه {currentPage} از {totalPages}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VectorSearchPage;
