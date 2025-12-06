import React from 'react';
import { SkeletonLoading } from '../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../hooks/display';

export const WorkspaceAuditLogsLoading = () => {
  /* 
   * Response props
   */
  const { height } = useDisplay();

  return (
    <div className="text-center container mx-auto mt-3 xl:mt-0 px-3 xl:px-0">
      <div className="flex justify-between xl:pl-2 mb-6 items-center">
        <h3 className="text-3xl">لاگ‌های فضای کاری</h3>
        <SkeletonLoading height={20} width={120} containerClassName="inline" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col xl:flex-row gap-3 xl:items-end">
        {/* Mobile/Tablet */}
        <div className="flex flex-col gap-2 xl:hidden w-full">
          <div className="flex flex-col gap-1">
            <SkeletonLoading height={12} width={60} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width="100%" containerClassName="inline" />
          </div>
          <div className="flex flex-col gap-1">
            <SkeletonLoading height={12} width={60} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width="100%" containerClassName="inline" />
          </div>
          <div className="flex flex-col gap-1">
            <SkeletonLoading height={12} width={80} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width="100%" containerClassName="inline" />
          </div>
          <SkeletonLoading height={42} width="100%" containerClassName="inline" />
        </div>

        {/* Desktop */}
        <div className="hidden xl:flex xl:flex-row xl:gap-3 xl:items-end xl:w-full">
          <div className="flex flex-col gap-1">
            <SkeletonLoading height={12} width={60} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width={165} containerClassName="inline" />
          </div>
          <div className="flex flex-col gap-1">
            <SkeletonLoading height={12} width={60} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width={165} containerClassName="inline" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <SkeletonLoading height={12} width={80} containerClassName="inline ml-auto" />
            <SkeletonLoading height={42} width="100%" containerClassName="inline" />
          </div>
          <SkeletonLoading height={42} width={140} containerClassName="inline" />
        </div>
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden xl:block mt-3 bg-white dark:bg-gray-800 rounded-lg shadow p-3">
        <div className="grid grid-cols-6 gap-3 mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoading
              key={i}
              height={18}
              width="100%"
              containerClassName="inline"
            />
          ))}
        </div>

        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, r) => (
            <div key={r} className="grid grid-cols-6 gap-3 items-center">
              {Array.from({ length: 6 }).map((_, c) => (
                <SkeletonLoading
                  key={c}
                  height={50}
                  width="100%"
                  containerClassName="inline"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet cards skeleton */}
      <div className="xl:hidden mt-3 space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 space-y-10"
          >
            {Array.from({ length: 6 }).map((_, r) => (
              <SkeletonLoading
                key={r}
                height={25}
                width="100%"
                containerClassName="inline"
              />
            ))}
          </div>
        ))}
      </div>

      <div className="pb-5 xl:pb-0 mt-8 flex justify-center">
        <SkeletonLoading height={40} width={220} containerClassName="inline" />
      </div>
    </div>
  );
};

export default WorkspaceAuditLogsLoading;