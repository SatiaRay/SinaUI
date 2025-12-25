import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * ApiIntegrationLoading Component - Loading skeleton for API integrations index page
 * @component
 * @returns {JSX.Element} Rendered loading skeleton component
 */
export const ApiIntegrationLoading = () => {
  /**
   * Display hook for responsive design
   */
  const { height, isDesktop } = useDisplay();

  /**
   * Calculate perpage exactly like the main component
   * @constant
   * @type {number}
   */
  const perpage = isDesktop
    ? Math.max(6, Math.floor((height - 200) / 115) * 3)
    : 6;

  return (
    <div className="h-full flex flex-col justify-start md:pb-0">
      {/* Header skeleton */}
      <div className="mx-3 md:mx-0 md:mb-6 pb-4 pt-3 md:pt-0 border-b border-gray-600 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <SkeletonLoading
            width={56}
            height={56}
            className="rounded-xl"
            containerClassName="inline bg-gradient-to-r from-indigo-500 to-purple-500"
          />
          <div>
            <SkeletonLoading
              width={200}
              height={32}
              className="rounded-lg mb-2"
              containerClassName="inline"
            />
            <SkeletonLoading
              width={250}
              height={20}
              className="rounded"
              containerClassName="inline"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start lg:justify-end w-full lg:w-auto">
          <SkeletonLoading
            width={140}
            height={48}
            className="rounded-xl"
            containerClassName="inline"
          />
          <SkeletonLoading
            width={140}
            height={48}
            className="rounded-xl"
            containerClassName="inline"
          />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mx-3 md:mx-0">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <SkeletonLoading
                  width={80}
                  height={16}
                  className="rounded"
                  containerClassName="inline"
                />
                <SkeletonLoading
                  width={60}
                  height={24}
                  className="rounded"
                  containerClassName="inline"
                />
                <SkeletonLoading
                  width={100}
                  height={12}
                  className="rounded"
                  containerClassName="inline"
                />
              </div>
              <SkeletonLoading
                width={48}
                height={48}
                className="rounded-lg"
                containerClassName="inline"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Demo alert skeleton */}
      <div className="mx-3 md:mx-0 mb-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <SkeletonLoading
            width={40}
            height={40}
            className="rounded-lg"
            containerClassName="inline"
          />
          <div className="space-y-2 flex-1">
            <SkeletonLoading
              width={120}
              height={20}
              className="rounded"
              containerClassName="inline"
            />
            <SkeletonLoading
              width="100%"
              height={16}
              className="rounded"
              containerClassName="inline"
            />
            <SkeletonLoading
              width="80%"
              height={16}
              className="rounded"
              containerClassName="inline"
            />
          </div>
        </div>
      </div>

      {/* Title and count skeleton */}
      <div className="mb-4 flex items-center justify-between px-3 md:px-0">
        <SkeletonLoading
          width={150}
          height={24}
          className="rounded"
          containerClassName="inline"
        />
        <SkeletonLoading
          width={80}
          height={16}
          className="rounded"
          containerClassName="inline"
        />
      </div>

      {/* Cards grid skeleton - Fixed to match main component exactly */}
      <div className="p-3 md:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: perpage }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <SkeletonLoading
                    width={48}
                    height={48}
                    className="rounded-xl"
                    containerClassName="inline"
                  />
                  <div>
                    <SkeletonLoading
                      width={120}
                      height={20}
                      className="rounded-lg mb-1"
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
                  width={60}
                  height={32}
                  className="rounded-lg"
                  containerClassName="inline"
                />
              </div>

              <SkeletonLoading
                width="100%"
                height={40}
                className="rounded mb-3"
                containerClassName="inline"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SkeletonLoading
                    width={80}
                    height={16}
                    className="rounded"
                    containerClassName="inline"
                  />
                  <SkeletonLoading
                    width={60}
                    height={16}
                    className="rounded"
                    containerClassName="inline"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonLoading
                    width={32}
                    height={32}
                    className="rounded-lg"
                    containerClassName="inline"
                  />
                  <SkeletonLoading
                    width={32}
                    height={32}
                    className="rounded-lg"
                    containerClassName="inline"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="mt-8 pb-5 md:pb-0 px-3 md:px-0">
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3, 4, 5].map((item) => (
            <SkeletonLoading
              key={item}
              width={40}
              height={40}
              className="rounded-lg"
              containerClassName="inline"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
