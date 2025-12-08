import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * EditWorkspaceLoading Component - Skeleton loading for edit workspace page
 * @component
 * @returns {JSX.Element} Rendered skeleton loading component
 */
const EditWorkspaceLoading = () => {
  const { isMobile, isDesktop } = useDisplay();

  return (
    <div className="h-full flex flex-col justify-start px-3 md:px-0 pt-4 md:pt-6">
      {/* Header skeleton */}
      <div className="md:mx-0 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <div className="w-full md:w-auto">
            <SkeletonLoading
              height={isMobile ? 28 : 36}
              width={isMobile ? 160 : 200}
              containerClassName="mb-1 md:mb-2"
            />
            <SkeletonLoading
              height={isMobile ? 16 : 20}
              width={isMobile ? 220 : 280}
            />
          </div>
          <SkeletonLoading
            height={isMobile ? 40 : 48}
            width={isMobile ? '100%' : 140}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Main content skeleton - Two column layout */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Left column skeleton */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
              {/* Workspace info skeleton */}
              <div className="mb-8">
                <SkeletonLoading
                  height={24}
                  width={160}
                  containerClassName="mb-6"
                />
                <div className="flex items-center gap-4 mb-6">
                  <SkeletonLoading
                    height={64}
                    width={64}
                    className="rounded-xl"
                  />
                  <div className="space-y-2 flex-1">
                    <SkeletonLoading height={28} width="70%" />
                    <SkeletonLoading height={20} width="50%" />
                  </div>
                </div>
              </div>

              {/* Form fields skeleton */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i}>
                    <SkeletonLoading
                      height={20}
                      width={120}
                      containerClassName="mb-2"
                    />
                    <SkeletonLoading
                      height={48}
                      containerClassName="w-full"
                      className="rounded-lg"
                    />
                    {i <= 2 && (
                      <SkeletonLoading
                        height={16}
                        width={200}
                        containerClassName="mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Danger zone skeleton */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <SkeletonLoading
                  height={24}
                  width={180}
                  containerClassName="mb-6"
                />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <SkeletonLoading height={20} width={140} />
                          <SkeletonLoading height={16} width={200} />
                        </div>
                        <SkeletonLoading
                          height={40}
                          width={100}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column skeleton */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              {/* Preview skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm mb-6">
                <SkeletonLoading
                  height={24}
                  width={160}
                  containerClassName="mb-6"
                />
                <div className="flex flex-col items-center text-center">
                  <SkeletonLoading
                    height={96}
                    width={96}
                    className="rounded-xl mb-6"
                  />
                  <SkeletonLoading
                    height={28}
                    width="80%"
                    containerClassName="mb-2"
                  />
                  <SkeletonLoading
                    height={20}
                    width="60%"
                    containerClassName="mb-6"
                  />
                  <div className="flex gap-2">
                    <SkeletonLoading
                      height={32}
                      width={80}
                      className="rounded-full"
                    />
                    <SkeletonLoading
                      height={32}
                      width={80}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Stats skeleton */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                <SkeletonLoading
                  height={24}
                  width={120}
                  containerClassName="mb-6"
                />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <SkeletonLoading height={20} width={100} />
                      <SkeletonLoading height={24} width={60} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="mt-8 md:mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <SkeletonLoading height={20} width={300} />
              <div className="flex gap-3 w-full sm:w-auto">
                <SkeletonLoading
                  height={48}
                  width={120}
                  className="rounded-lg"
                />
                <SkeletonLoading
                  height={48}
                  width={160}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EditWorkspaceLoading };
