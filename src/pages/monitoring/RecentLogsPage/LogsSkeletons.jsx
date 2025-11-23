import React from 'react';

/**
 * SkeletonLoader Component
 * Displays loading animation for individual log cards
 * Matches the new design of LogCard component
 */
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header with tool info and status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
          <div className="flex flex-col gap-1.5">
            <div className="w-28 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-20 h-7 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      {/* Content section */}
      <div className="space-y-3 mb-4">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-3/5 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Metadata section */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Footer with timestamp and actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-24 h-8 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
      </div>
    </div>
  </div>
);

/**
 * LogsSkeleton Component
 * Displays grid of skeleton loaders for logs page
 * Matches the responsive grid layout of the main component
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton items to display
 */
export const LogsSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonLoader key={index} />
      ))}
    </div>
  );
};

/**
 * FiltersSkeleton Component
 * Displays loading animation for filters section
 * Matches the new collapsible filter design
 */
export const FiltersSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Main search and filter bar */}
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-4">
      {/* Search input skeleton */}
      <div className="flex-1 relative min-w-0">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>

      {/* Filter buttons skeleton */}
      <div className="flex gap-3">
        <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        <div className="w-20 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>

    {/* Advanced filters skeleton - always visible in loading state */}
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter skeletons with labels */}
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index}>
            <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * ResultsSummarySkeleton Component
 * Displays loading animation for results summary
 */
export const ResultsSummarySkeleton = () => (
  <div className="mb-4 px-2 animate-pulse">
    <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

/**
 * PaginationSkeleton Component
 * Displays loading animation for pagination controls
 */
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center gap-4 mt-8 animate-pulse">
    <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
    <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
    <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
  </div>
);

/**
 * EmptyStateSkeleton Component
 * Displays loading animation for empty state
 */
export const EmptyStateSkeleton = () => (
  <div className="text-center py-12 animate-pulse">
    <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
    <div className="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto mb-2"></div>
    <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
  </div>
);

export default {
  LogsSkeleton,
  FiltersSkeleton,
  ResultsSummarySkeleton,
  PaginationSkeleton,
  EmptyStateSkeleton,
};
