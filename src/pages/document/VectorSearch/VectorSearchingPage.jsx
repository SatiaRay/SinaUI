import React, { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import VectorSearchLoading from './VectorSearchLoading';
import { VectorDocumentCard } from '@components/document/vector-searching/VectorDocumentCard';
import { useVectorSearchQuery } from 'store/api/knowledgeApi';
import { skipToken } from '@reduxjs/toolkit/query';

/**
 * VectorSearchingPage Component
 * Displays vector search collections with search functionality
 * Uses mock data temporarily until API is ready
 */
const VectorSearchingPage = () => {
  /**
   * State for search parameters
   */
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
   * Search API - with debounce and minimum character (3)
   */
  const isValidQuery = searchQuery && searchQuery.length >= 3;
  const {
    data = [],
    isFetching,
    isError,
  } = useVectorSearchQuery(isValidQuery ? searchQuery : skipToken, {
    skip: !isValidQuery,
  });

  /**
   * Decide which data to show: API if valid, fallback to mock
   */
  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    if (isValidQuery && data) {
      return data;
    }
    return [];
  }, [isValidQuery, data, searchQuery]);

  /**
   * Extract vector searches and pagination info from filtered data
   */
  const totalPages = filteredData.total_pages || 1;
  const currentPage = filteredData.page || page;

  /**
   * Compute variable for define serach result
   */
  const nothingFound = useMemo(
    () => searchQuery && data.length < 0,
    [searchQuery, data]
  );

  /**
   * Handle page change
   * Updates page state which will trigger refetch when API is ready
   * @param {number} newPage - Target page number
   */
  const handlePageChange = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div
      className={`flex p-3 sm:p-4 md:p-6 overflow-y-auto scrollbar-hide w-full h-full ${searchQuery && data.length > 0 ? 'items-start' : 'items-center'}`}
    >
      <div className="mx-auto w-full">
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
        <div
          className={`bg-white dark:bg-gray-800 shadow-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 mx-auto ${data.length > 0 ? 'w-full' : 'w-[75%]'}`}
        >
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-start lg:items-center">
            {/* Search Input */}
            <div className="flex-1 relative min-w-0 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="متن یا سوال مورد نظر را وارد کنید ..."
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
        {!isFetching && isValidQuery && data.length > 0 && (
          <div className="mb-3 sm:mb-4 px-1 sm:px-2">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {`${data.length} سند یافت شد.`}
            </p>
          </div>
        )}

        {/* Loading State - Show skeletons for vector searches */}
        {isFetching && <VectorSearchLoading count={6} />}

        {/* Empty State */}
        {!isFetching && searchQuery && data.length === 0 && (
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
        {!isFetching && isValidQuery && data && data.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {data.map((document) => (
                <VectorDocumentCard key={document.id} document={document} />
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

export default VectorSearchingPage;
