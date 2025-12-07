import React from "react";
import { SkeletonLoading } from "../../../../components/ui/loading/skeletonLoading";
import { useDisplay } from "../../../../hooks/display";

/**
 * AuditLogIndexLoading
 */
export const AuditLogIndexLoading = () => {
  useDisplay();

  // Mobile Card 
  const MobileCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center px-5 pt-5 border-b border-gray-100 dark:border-gray-700">
        <SkeletonLoading height={8} width={50} className="rounded-lg" />
        <SkeletonLoading height={12} width={135} className="rounded-lg" />
      </div>

      <div className="px-5">
        <div className="flex justify-between items-start">
          <SkeletonLoading height={10} width={80} className="ml-auto rounded-md" />
          <div>
            <SkeletonLoading height={10} width={70} className="rounded-md" />
            <SkeletonLoading height={10} width={100} className="rounded-md" />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <SkeletonLoading height={10} width={60} className="ml-auto rounded-md" />
          <SkeletonLoading height={20} width={50} className="rounded-full" />
        </div>

        <div className="flex justify-between items-center">
          <SkeletonLoading height={10} width={70} className="ml-auto rounded-md" />
          <SkeletonLoading height={10} width={70} className="rounded-md" />
        </div>

        <div className="flex justify-between items-center">
          <SkeletonLoading height={10} width={85} className="ml-auto rounded-md" />
          <SkeletonLoading height={10} width={115} className="rounded-md" />
        </div>

        <div className="flex justify-between items-start">
          <SkeletonLoading height={10} width={65} className="ml-auto rounded-md" />
          <SkeletonLoading height={10} width={165} className="rounded-md" />
        </div>

        <SkeletonLoading height={10} width={110} className="rounded-md" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-3 xl:px-0 mt-3 xl:mt-0">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-3xl">لاگ‌های فضای کاری</h3>
        <SkeletonLoading height={20} width={140} className="rounded-lg" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
        {/* Mobile */}
        <div className="xl:hidden space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonLoading height={10} width={70 + i * 15} className="ml-auto rounded-md" />
              <SkeletonLoading height={44} width="100%" className="rounded-xl" />
            </div>
          ))}
          <SkeletonLoading height={44} width="100%" className="rounded-xl" />
        </div>

        {/* Desktop */}
        <div className="hidden xl:flex items-end gap-2 w-full">
          {[60, 60, 80].map((w, i) => (
            <div key={i} className={`flex flex-col ${i === 2 ? "flex-1" : ""}`}>
              <SkeletonLoading height={10} width={w} containerClassName="ml-auto !mb-1"  className="rounded-md" />
              <SkeletonLoading height={36} width={i === 2 ? "100%" : 165} containerClassName="!mt-0" className="rounded-xl" />
            </div>
          ))}
          <SkeletonLoading height={42} width={140} className="rounded-lg" />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden xl:block mt-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="grid grid-cols-6 border-b border-gray-200 dark:border-gray-700">
            {Array(6).fill().map((_, i) => (
              <SkeletonLoading key={i} height={18} width="40%" className="rounded-lg" />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-0 items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <SkeletonLoading height={14} width={120} className="rounded-md" />
              <div className="space-y-1">
                <SkeletonLoading height={10} width={60} className="rounded-md" />
                <SkeletonLoading height={10} width={100} className="rounded-md" />
              </div>
              <SkeletonLoading height={28} width={50} className="rounded-full" />
              <SkeletonLoading height={14} width={50} className="rounded-md" />
              <SkeletonLoading height={14} width={70} className="rounded-md" />
              <SkeletonLoading height={28} width="100%" className="rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="xl:hidden mt-5 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MobileCardSkeleton key={i} />
        ))}
      </div>

      <div className="mt-6 pb-6 flex justify-center">
        <SkeletonLoading height={42} width={260} className="rounded-full" />
      </div>
    </div>
  );
};

export default AuditLogIndexLoading;