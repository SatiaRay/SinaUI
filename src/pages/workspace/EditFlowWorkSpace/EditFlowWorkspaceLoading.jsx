import React from 'react';

/**
 * EditFlowWorkspaceLoading Component - Loading skeleton for EditFlowWorkspacePage
 * @component
 * @returns {JSX.Element} Rendered loading skeleton for edit project page
 */
const EditFlowWorkspaceLoading = () => {
  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Header skeleton */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse w-10 h-10"></div>
            <div>
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Form skeleton */}
      <div className="max-w-4xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
          <div className="space-y-6">
            {/* Project name skeleton */}
            <div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Description skeleton */}
            <div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Color and status section skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags section skeleton */}
            <div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Dates and budget section skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Preview section skeleton */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFlowWorkspaceLoading;
