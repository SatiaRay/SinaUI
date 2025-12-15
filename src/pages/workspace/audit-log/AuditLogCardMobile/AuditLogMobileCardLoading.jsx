import React from 'react';
import { SkeletonLoading } from '../../../../components/ui/loading/skeletonLoading';

/**
 * AuditLogMobileCardSkeleton
 * Skeleton card used for mobile/tablet audit log list.
 * @return {JSX.Element} mobile/tablet audit log card skeleton
 */
export const AuditLogMobileCardLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center px-5 pt-5 border-b border-gray-100 dark:border-gray-700">
        <SkeletonLoading height={8} width={50} className="rounded-lg" />
        <SkeletonLoading height={12} width={135} className="rounded-lg" />
      </div>

      <div className="px-5 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-3">
          <SkeletonLoading
            height={10}
            width={80}
            containerClassName="ml-auto !my-0"
            className="rounded-md"
          />
          <div className="flex flex-col gap-1">
            <SkeletonLoading
              height={10}
              width={70}
              containerClassName="!my-0"
              className="rounded-md"
            />
            <SkeletonLoading
              height={10}
              width={100}
              containerClassName="!my-0"
              className="rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-between items-center gap-3">
          <SkeletonLoading
            height={10}
            width={60}
            containerClassName="ml-auto !my-0"
            className="rounded-md"
          />
          <SkeletonLoading
            height={20}
            width={50}
            containerClassName="!my-0"
            className="rounded-full"
          />
        </div>

        <div className="flex justify-between items-center gap-3">
          <SkeletonLoading
            height={10}
            width={70}
            containerClassName="ml-auto !my-0"
            className="rounded-md"
          />
          <SkeletonLoading
            height={10}
            width={70}
            containerClassName="!my-0"
            className="rounded-md"
          />
        </div>

        <div className="flex justify-between items-center gap-3">
          <SkeletonLoading
            height={10}
            width={85}
            containerClassName="ml-auto !my-0"
            className="rounded-md"
          />
          <SkeletonLoading
            height={10}
            width={115}
            containerClassName="!my-0"
            className="rounded-md"
          />
        </div>

        <div className="flex justify-between items-start gap-3">
          <SkeletonLoading
            height={10}
            width={65}
            containerClassName="ml-auto !my-0"
            className="rounded-md"
          />
          <SkeletonLoading
            height={10}
            width={165}
            containerClassName="!my-0"
            className="rounded-md"
          />
        </div>

        <SkeletonLoading
          height={10}
          width={110}
          containerClassName="!my-0"
          className="rounded-md"
        />
      </div>
    </div>
  );
};

export default AuditLogMobileCardLoading;
