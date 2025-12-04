import React from 'react';
import { SkeletonLoading } from '../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../hooks/display';

export const WorkspaceAuditLogsLoading = () => {
  /* 
   * Response props
   */
  const { height, isLargeDisplay } = useDisplay();

  return (
    <div className="text-center container mx-auto mt-3 md:mt-0 px-3 md:px-0">
      <div className="flex justify-between md:pl-2 mb-6 items-center">
        <h3 className="text-3xl">لاگ‌های فضای کاری</h3>
        <SkeletonLoading height={20} width={120} containerClassName="inline" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 flex flex-col md:flex-row gap-3 md:items-end">
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
          <SkeletonLoading height={42} width={'100%'} containerClassName="inline" />
        </div>

        <SkeletonLoading height={42} width={140} containerClassName="inline" />
      </div>

      <div className="mt-3 bg-white dark:bg-gray-800 rounded-lg shadow p-3">
        <SkeletonLoading height={38} width={'100%'} containerClassName="inline" />

        <SkeletonLoading
          rows={7}
          cols={1}
          height={52}
          containerClassName="flex flex-col my-2"
        />
      </div>

      <div className="pb-5 md:pb-0 mt-3 flex justify-center">
        <SkeletonLoading height={40} width={220} containerClassName="inline" />
      </div>
    </div>
  );
};

export default WorkspaceAuditLogsLoading;
