import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * EditApiIntegrationLoading Component - Loading skeleton for API integration edit page
 * @component
 * @returns {JSX.Element} Rendered loading skeleton component
 */
export const EditApiIntegrationLoading = () => {
  const { isMobile } = useDisplay();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <SkeletonLoading
                width={40}
                height={40}
                className="rounded-lg"
                containerClassName="inline"
              />
              <div className="flex items-center gap-2 sm:gap-3">
                <SkeletonLoading
                  width={48}
                  height={48}
                  className="rounded-lg"
                  containerClassName="inline"
                />
                <div>
                  <SkeletonLoading
                    width={200}
                    height={32}
                    className="rounded-lg mb-2"
                    containerClassName="inline"
                  />
                  <SkeletonLoading
                    width={150}
                    height={16}
                    className="rounded"
                    containerClassName="inline"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile tab selector skeleton */}
              {isMobile && (
                <SkeletonLoading
                  width={100}
                  height={40}
                  className="rounded-lg"
                  containerClassName="inline"
                />
              )}

              <SkeletonLoading
                width={120}
                height={40}
                className="rounded-lg"
                containerClassName="inline"
              />

              <SkeletonLoading
                width={120}
                height={40}
                className="rounded-lg"
                containerClassName="inline"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          {/* Tab Navigation - Desktop skeleton */}
          {!isMobile && (
            <nav className="hidden md:flex flex-col w-full md:w-64 border-b md:border-b-0 md:border-r dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="p-4 border-b dark:border-gray-700">
                <SkeletonLoading
                  width={120}
                  height={24}
                  className="rounded mb-2"
                  containerClassName="inline"
                />
                <SkeletonLoading
                  width={80}
                  height={16}
                  className="rounded"
                  containerClassName="inline"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="p-4 border-r-2 border-transparent">
                    <div className="flex items-center gap-3">
                      <SkeletonLoading
                        width={40}
                        height={40}
                        className="rounded-lg"
                        containerClassName="inline"
                      />
                      <div className="text-right flex-1">
                        <SkeletonLoading
                          width={80}
                          height={20}
                          className="rounded mb-1"
                          containerClassName="inline"
                        />
                        <SkeletonLoading
                          width={120}
                          height={16}
                          className="rounded"
                          containerClassName="inline"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </nav>
          )}

          {/* Content Area skeleton */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Mobile tab indicator skeleton */}
              {isMobile && (
                <div className="md:hidden mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <SkeletonLoading
                          width={48}
                          height={48}
                          className="rounded-lg"
                          containerClassName="inline"
                        />
                        <div>
                          <SkeletonLoading
                            width={120}
                            height={24}
                            className="rounded mb-1"
                            containerClassName="inline"
                          />
                          <SkeletonLoading
                            width={80}
                            height={16}
                            className="rounded"
                            containerClassName="inline"
                          />
                        </div>
                      </div>
                      <SkeletonLoading
                        width={40}
                        height={20}
                        className="rounded"
                        containerClassName="inline"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column: Form skeleton */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  {[1, 2].map((section) => (
                    <div
                      key={section}
                      className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5"
                    >
                      <div className="mb-3 sm:mb-4">
                        <SkeletonLoading
                          width={200}
                          height={28}
                          className="rounded-lg mb-2"
                          containerClassName="inline"
                        />
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {[1, 2, 3].map((field) => (
                          <div key={field}>
                            <SkeletonLoading
                              width={100}
                              height={20}
                              className="rounded mb-2"
                              containerClassName="inline"
                            />
                            <SkeletonLoading
                              width="100%"
                              height={48}
                              className="rounded-lg"
                              containerClassName="inline"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Preview & Test skeleton */}
                <div className="space-y-4 sm:space-y-6">
                  {[1, 2, 3].map((card) => (
                    <div
                      key={card}
                      className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5"
                    >
                      <div className="mb-3 sm:mb-4">
                        <SkeletonLoading
                          width={150}
                          height={24}
                          className="rounded mb-2"
                          containerClassName="inline"
                        />
                      </div>
                      <div className="space-y-3">
                        <SkeletonLoading
                          width="100%"
                          height={120}
                          className="rounded-lg"
                          containerClassName="inline"
                        />
                        <SkeletonLoading
                          width="100%"
                          height={48}
                          className="rounded-lg"
                          containerClassName="inline"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="sticky bottom-0 z-50 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 md:order-1">
              <SkeletonLoading
                width={200}
                height={20}
                className="rounded"
                containerClassName="inline"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 order-1 md:order-2 w-full md:w-auto justify-between md:justify-normal">
              <SkeletonLoading
                width={100}
                height={44}
                className="rounded-lg"
                containerClassName="inline flex-1 md:flex-none"
              />
              <SkeletonLoading
                width={150}
                height={44}
                className="rounded-lg"
                containerClassName="inline flex-1 md:flex-none"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
