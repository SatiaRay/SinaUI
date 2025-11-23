// components/Setting/SettingSkeleton.jsx
import React from 'react';

/**
 * SettingIndexLoading Component - Skeleton loading for settings page
 *
 * This component displays a skeleton loading state while settings data is being fetched.
 * It provides a visual placeholder that matches the actual settings page layout.
 *
 * @component
 * @example
 * return <SettingIndexLoading />
 *
 * @returns {JSX.Element} Skeleton loading component
 */
const SettingIndexLoading = () => {
  return (
    <section className="flex px-4 py-8 gap-10 min-h-screen items-center justify-center text-black dark:text-white w-full">
      {/* Main skeleton card */}
      <main className="md:w-[45%] w-full flex flex-col items-center justify-center p-6 rounded-2xl border shadow-2xl dark:bg-gray-800 dark:border-gray-700 bg-white/95 backdrop-blur-sm animate-pulse">
        {/* Header skeleton */}
        <div className="w-full text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-300 dark:bg-gray-600 rounded-xl mb-3"></div>
          <div className="h-7 bg-gray-300 dark:bg-gray-600 rounded-lg w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto"></div>
        </div>

        {/* Form fields skeleton */}
        <div className="w-full h-full mb-6 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
            </div>
          ))}

          {/* Boolean field skeleton */}
          <div className="flex items-center gap-3 p-2">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>

        {/* Data management section skeleton */}
        <div className="w-full flex items-center justify-center pt-6 border-t gap-4 border-gray-200 dark:border-gray-600">
          <div className="w-full">
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-lg w-32 mx-auto mb-4"></div>

            <div className="flex flex-col md:flex-row w-full items-center justify-center gap-4 mb-6">
              <div className="flex-1 w-full">
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mt-2"></div>
              </div>
              <div className="flex-1 w-full">
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto mt-2"></div>
              </div>
            </div>

            {/* Help card skeleton */}
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full mt-0.5 flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status skeleton */}
        <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default SettingIndexLoading;
