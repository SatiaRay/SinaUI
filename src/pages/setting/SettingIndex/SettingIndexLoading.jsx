// components/Setting/SettingSkeleton.jsx
import React from 'react';

const SettingIndexLoading = () => {
  return (
    <section className="flex px-4 py-12 gap-10 h-screen overflow-hidden items-center justify-center text-black dark:text-white w-full">
      <main className="md:w-[40%] w-full flex flex-col items-center justify-center p-4 rounded-lg border shadow-lg dark:bg-gray-800 dark:border-gray-700 animate-pulse">
        {/* Header skeleton */}
        <div className="w-full flex flex-col gap-3 mb-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* Fields skeleton */}
        <div className="flex flex-col gap-4 w-full">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Buttons skeleton */}
        <div className="w-full flex items-center justify-center pt-6 border-t gap-4 border-gray-300 dark:border-gray-700 mt-6">
          <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
          <div className="h-10 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        </div>
      </main>
    </section>
  );
};

export default SettingIndexLoading;
