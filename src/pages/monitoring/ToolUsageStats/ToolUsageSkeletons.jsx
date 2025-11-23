import React from 'react';

/**
 * HeaderSkeleton Component
 * Displays loading animation for header section
 */
export const HeaderSkeleton = () => (
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-xl">
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
      <div>
        <div className="w-48 h-7 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="w-64 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      {/* Sort Filter Skeleton */}
      <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl min-w-[200px]">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0"></div>
        <div className="w-full h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Days Filter Skeleton */}
      <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-xl">
        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded flex-shrink-0"></div>
        <div className="w-12 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-12 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * StatCardSkeleton Component
 * Displays loading animation for statistic cards
 * Matches the new StatCard design
 */
export const StatCardSkeleton = () => (
  <div className="rounded-2xl shadow-lg p-6 flex flex-col items-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full animate-pulse">
    {/* Tool Name Skeleton */}
    <div className="w-28 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>

    {/* Main Stat Skeleton */}
    <div className="text-center w-full">
      <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2 mx-auto"></div>
      <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>

      {/* Details Skeleton */}
      <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded text-left"></div>
        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded text-right"></div>

        <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded text-left"></div>
        <div className="w-8 h-4 bg-gray-200 dark:bg-gray-700 rounded text-right"></div>
      </div>
    </div>
  </div>
);

/**
 * ChartSkeleton Component
 * Displays loading animation for chart section
 * @param {Object} props - Component props
 * @param {boolean} props.isDark - Dark mode state
 */
export const ChartSkeleton = ({ isDark = false }) => (
  <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Chart Header Skeleton */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div className="w-56 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>

      {/* Chart Legend Skeleton */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    {/* Chart Area Skeleton */}
    <div
      className="w-full flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700"
      style={{
        height: '400px',
        maxHeight: '600px',
        minHeight: '300px',
      }}
    >
      <div className="text-center">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-spin mx-auto mb-3 border-2 border-gray-400 dark:border-gray-500 border-t-transparent"></div>
        <div className="w-40 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="w-64 h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
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
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
    {Array.from({ length: count }, (_, index) => (
      <StatCardSkeleton key={index} />
    ))}
  </div>
);

/**
 * ValidationErrorSkeleton Component
 * Displays loading animation for validation error section
 */
export const ValidationErrorSkeleton = () => (
  <div className="p-4 mb-4 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse">
    <div className="w-32 h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
    <div className="w-64 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
);

export default {
  HeaderSkeleton,
  StatCardSkeleton,
  ChartSkeleton,
  CardsGridSkeleton,
  ValidationErrorSkeleton,
};
