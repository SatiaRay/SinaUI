import React from 'react';

/**
 * SkeletonLoader Component
 * Displays loading animation for individual log cards
 */
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="flex flex-col gap-1">
            <div className="w-24 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="w-20 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * LogsSkeleton Component
 * Displays grid of skeleton loaders for logs page
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
 */
export const FiltersSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4 mb-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Search Input Skeleton */}
      <div className="relative">
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>

      {/* Select Input Skeleton */}
      <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

      {/* Number Input Skeletons */}
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"
        ></div>
      ))}
    </div>
  </div>
);

export default {
  LogsSkeleton,
  FiltersSkeleton,
};
