import React from 'react';

/**
 * ShowWorkspaceLoading Component - Loading skeleton for ShowFlowWorkspacePage
 * @component
 * @returns {JSX.Element} Rendered loading skeleton for project detail page
 */
const ShowWorkspaceLoading = () => {
  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Breadcrumb skeleton */}
      <div className="md:mx-0 mb-6">
        <div className="flex items-center gap-2 text-sm">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-4 text-gray-400">›</div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-4 text-gray-400">›</div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content skeleton */}
        <div className="flex-1">
          {/* Header skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div>
                  <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Description skeleton */}
            <div className="mb-6">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Details skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                >
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Recent activity skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="lg:w-80">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse"></div>
            <div className="space-y-2 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1 animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowWorkspaceLoading;
