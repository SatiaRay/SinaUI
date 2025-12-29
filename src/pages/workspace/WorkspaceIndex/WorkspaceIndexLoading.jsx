import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * WorkspaceIndexLoading Component - Skeleton loading for workspace index page (Mobile Optimized)
 * @component
 * @returns {JSX.Element} Rendered skeleton loading component
 */
const WorkspaceIndexLoading = () => {
  /**
   * Display util hook for responsive design
   */
  const { height, isLargeDisplay, isDesktop, isMobile } = useDisplay();

  /**
   * Calculate number of skeleton rows based on screen height and device type
   */
  const calculateRows = () => {
    if (isMobile) return 3;
    if (!isDesktop) return 4;
    return Math.floor((height - 350) / 180);
  };

  /**
   * Calculate number of columns based on screen size
   */
  const calculateCols = () => {
    if (isMobile) return 1;
    if (!isDesktop) return 1;
    if (isLargeDisplay) return 3;
    return 2;
  };

  /**
   * Calculate total skeleton cards to display
   */
  const totalCards = calculateRows() * calculateCols();

  return (
    <div className="h-full flex flex-col justify-start pb-0 px-3 md:px-0">
      {/* Page header skeleton - Mobile optimized */}
      <div className="md:mx-0 md:mb-6 pb-4 md:pb-6 pt-1 md:pt-0 border-b border-gray-600 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
        <div className="w-full md:w-auto">
          <SkeletonLoading
            height={isMobile ? 28 : 36}
            width={isMobile ? 140 : 180}
            containerClassName="mb-1 md:mb-2"
          />
          <SkeletonLoading
            height={isMobile ? 16 : 20}
            width={isMobile ? 200 : 250}
          />
        </div>
        <div className="flex flex-row-reverse gap-2 md:gap-3 w-full md:w-auto">
          <SkeletonLoading
            height={isMobile ? 40 : 48}
            width={isMobile ? '100%' : 160}
            className="rounded-lg md:rounded-xl"
          />
          {isDesktop && (
            <SkeletonLoading height={48} width={140} className="rounded-xl" />
          )}
        </div>
      </div>

      {/* Search and filter bar skeleton */}
      <div className="md:mx-0 my-4 md:my-6">
        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
          <SkeletonLoading
            height={isMobile ? 44 : 56}
            containerClassName="flex-1"
            className="rounded-lg md:rounded-xl"
          />

          {isDesktop ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SkeletonLoading height={20} width={20} />
                <SkeletonLoading height={20} width={40} />
              </div>
              <SkeletonLoading height={56} width={120} className="rounded-lg" />
              <SkeletonLoading height={56} width={120} className="rounded-lg" />
            </div>
          ) : (
            <div className="flex gap-2">
              <SkeletonLoading
                height={44}
                width="100%"
                className="rounded-lg"
              />
              <SkeletonLoading height={44} width={100} className="rounded-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Results count skeleton */}
      <div className="md:mx-0 mb-3 md:mb-4">
        <SkeletonLoading
          height={isMobile ? 16 : 20}
          width={isMobile ? 150 : 200}
        />
      </div>

      {/* Workspace cards skeleton grid - Responsive auto-fit with minimum 400px */}
      <div className="flex flex-col p-0">
        <div
          className="grid gap-4 md:gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          }}
        >
          {Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 shadow-sm"
            >
              {/* Card header skeleton */}
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                  {/* Workspace icon skeleton */}
                  <SkeletonLoading
                    height={isMobile ? 48 : 56}
                    width={isMobile ? 48 : 56}
                    className="rounded-lg md:rounded-xl"
                  />

                  {/* Workspace info skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                      <SkeletonLoading
                        height={isMobile ? 20 : 24}
                        width={isMobile ? '60%' : '70%'}
                      />
                      <SkeletonLoading
                        height={isMobile ? 14 : 16}
                        width={isMobile ? 14 : 16}
                      />
                    </div>
                    <SkeletonLoading
                      height={isMobile ? 14 : 16}
                      width={isMobile ? '80%' : '90%'}
                    />
                  </div>
                </div>

                {/* Current workspace indicator skeleton */}
                <SkeletonLoading
                  height={isMobile ? 24 : 28}
                  width={isMobile ? 50 : 60}
                  className="rounded-full"
                />
              </div>

              {/* Workspace metadata and actions skeleton */}
              <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                    {/* Plan badge skeleton */}
                    <SkeletonLoading
                      height={isMobile ? 24 : 28}
                      width={isMobile ? 70 : 80}
                      className="rounded-full"
                    />

                    {/* Role badge skeleton */}
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <SkeletonLoading
                        height={isMobile ? 14 : 16}
                        width={isMobile ? 14 : 16}
                      />
                      <SkeletonLoading
                        height={isMobile ? 16 : 20}
                        width={isMobile ? 35 : 40}
                      />
                    </div>

                    {/* Members count skeleton */}
                    <div className="flex items-center gap-1 md:gap-1.5">
                      <SkeletonLoading
                        height={isMobile ? 14 : 16}
                        width={isMobile ? 14 : 16}
                      />
                      <SkeletonLoading
                        height={isMobile ? 16 : 20}
                        width={isMobile ? 50 : 60}
                      />
                    </div>
                  </div>

                  {/* Action buttons skeleton */}
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <SkeletonLoading
                      height={isMobile ? 32 : 36}
                      width={isMobile ? 32 : 36}
                      className="rounded-lg"
                    />
                    <SkeletonLoading
                      height={isMobile ? 32 : 36}
                      width={isMobile ? 32 : 36}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton - Mobile optimized */}
      <div className="pb-6 md:pb-8 mt-6 md:mt-8">
        <SkeletonLoading
          height={isMobile ? 40 : 48}
          containerClassName="max-w-full md:max-w-md mx-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export { WorkspaceIndexLoading };
