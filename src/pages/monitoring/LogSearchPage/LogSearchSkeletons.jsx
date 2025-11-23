import React from 'react';

/**
 * SearchSectionSkeleton Component
 * Displays loading animation for search section
 */
export const SearchSectionSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <div className="relative flex-1 max-w-md w-full">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
      <div className="flex gap-3">
        <div className="w-32 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        <div className="w-32 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
      </div>
    </div>
  </div>
);

/**
 * LogDetailSkeleton Component
 * Displays loading animation for log details section
 */
export const LogDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
        <div className="flex-1">
          <div className="w-40 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <div className="p-6 space-y-6">
      {/* Basic Info Section Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-start gap-3 py-2">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Params and Response Section Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-40"></div>
          </div>
        ))}
      </div>

      {/* Additional Metadata Section Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="w-40 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 h-32"></div>
      </div>
    </div>
  </div>
);

/**
 * LoadingSpinner Component
 * Displays centered loading spinner
 */
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-4 border-blue-200 dark:border-blue-800"></div>
      <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
    </div>
  </div>
);

/**
 * EmptyStateSkeleton Component
 * Displays loading animation for empty state
 */
export const EmptyStateSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="mx-auto w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
    <div className="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
    <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
  </div>
);

export default {
  SearchSectionSkeleton,
  LogDetailSkeleton,
  LoadingSpinner,
  EmptyStateSkeleton,
};
