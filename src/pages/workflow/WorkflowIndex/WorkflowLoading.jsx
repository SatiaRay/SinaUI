// src/components/workflow/WorkflowLoading.tsx

import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * WorkflowIndexLoading Component
 * Skeleton loading state for the Workflow Index page.
 * Matches the exact layout of WorkflowIndexPage (header + responsive card grid).
 * Relies on globally defined CSS variables (--skeleton-base-color & --skeleton-highlight-color)
 * that you already set in your index.css for perfect light/dark mode consistency.
 */
const WorkflowIndexLoading = () => {
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      <div className="rounded-lg  flex flex-col h-full overflow-hidden w-full">
        {/* Header Skeleton */}
        <div className="mx-3 md:mx-0 md:mb-6 pb-3 pt-3 md:pt-0 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
          {/* Page Title */}
          <Skeleton
            height={32}
            width={220}
            borderRadius={8}
            baseColor="var(--skeleton-base-color)"
            highlightColor="var(--skeleton-highlight-color)"
          />

          <div className="flex gap-2 items-center">
            {/* Import Button */}
            <Skeleton
              height={48}
              width={160}
              borderRadius={12}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            {/* Create New Workflow Button */}
            <Skeleton
              height={48}
              width={160}
              borderRadius={12}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
        </div>

        {/* Workflow Cards Grid Skeleton */}
        <div className="px-3 md:px-0 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* 6 skeleton cards – feel free to adjust the count */}
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
              >
                <div className="p-5 flex flex-col ">
                  {/* Card Header: Workflow Name + Status Badge */}
                  <div className="flex items-center justify-between">
                    <Skeleton
                      height={24}
                      width={140}
                      borderRadius={8}
                      baseColor="var(--skeleton-base-color)"
                      highlightColor="var(--skeleton-highlight-color)"
                    />
                    <Skeleton
                      height={24}
                      width={80}
                      borderRadius={999}
                      baseColor="var(--skeleton-base-color)"
                      highlightColor="var(--skeleton-highlight-color)"
                    />
                  </div>

                  {/* Separator Line */}
                  <div className="my-4 border-t border-gray-200 dark:border-gray-600" />

                  {/* Action Buttons */}
                  <div className="mt-auto flex gap-2">
                    {/* Desktop View – 3 buttons with text */}
                    <div className="hidden sm:flex gap-2 w-full">
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                    </div>

                    {/* Mobile View – Icon-only buttons */}
                    <div className="sm:hidden flex gap-2 w-full">
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                      <Skeleton
                        height={40}
                        borderRadius={8}
                        containerClassName="flex-1"
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { WorkflowIndexLoading };
