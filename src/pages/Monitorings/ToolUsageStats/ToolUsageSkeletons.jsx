import React from 'react';

/**
 * HeaderSkeleton Component
 * Displays loading animation for header section
 */
export const HeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-40 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
    </div>
  </div>
);

/**
 * StatCardSkeleton Component
 * Displays loading animation for statistic cards
 */
export const StatCardSkeleton = () => (
  <div className="rounded-2xl shadow-md p-4 flex flex-col items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-full animate-pulse">
    {/* Tool Name Skeleton */}
    <div className="w-24 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>

    {/* Main Stat Skeleton */}
    <div className="text-center w-full">
      <div className="w-16 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-1 mx-auto"></div>
      <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 mx-auto"></div>

      {/* Details Skeleton */}
      <div className="grid grid-cols-2 gap-2 text-xs border-t border-gray-100 dark:border-gray-800 pt-3">
        <div className="text-gray-500 dark:text-gray-400">میانگین مدت:</div>
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>

        <div className="text-gray-500 dark:text-gray-400">تعداد خطا:</div>
        <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * ChartSkeleton Component
 * Displays loading animation for chart section
 */
export const ChartSkeleton = () => (
  <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mt-4 animate-pulse">
    {/* Chart Header Skeleton */}
    <div className="flex items-center justify-between mb-3">
      <div className="w-48 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    {/* Chart Area Skeleton */}
    <div className="flex items-center justify-center h-[50vh] bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin mx-auto mb-2"></div>
        <div className="w-32 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * CardsGridSkeleton Component
 * Displays grid of skeleton cards
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 */
export const CardsGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
    {Array.from({ length: count }, (_, index) => (
      <StatCardSkeleton key={index} />
    ))}
  </div>
);
