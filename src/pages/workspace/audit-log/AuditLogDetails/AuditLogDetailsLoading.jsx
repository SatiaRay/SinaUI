import React from 'react';
import { SkeletonLoading } from '../../../../components/ui/loading/skeletonLoading';

/**
 * AuditLogDetailLoading
 * Perfect skeleton for AuditLogDetailPage.
 */
export const AuditLogDetailLoading = () => {
  return (
    <div className="h-full flex flex-col gap-6 p-4 xl:p-0">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-l from-indigo-500/10 via-fuchsia-500/10 to-sky-500/10 dark:from-indigo-500/15 dark:via-fuchsia-500/15 dark:to-sky-500/15" />
        <div className="relative p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <SkeletonLoading height={36} width={180} className="rounded-xl" />
          <div className="flex items-center gap-3">
            <SkeletonLoading height={40} width={90} className="rounded-xl" />
            <SkeletonLoading height={36} width={110} className="rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <div className="flex items-center gap-3">
              <SkeletonLoading height={44} width={44} className="rounded-2xl" />
              <div className="flex-1 space-y-2">
                <SkeletonLoading
                  height={10}
                  width={80}
                  className="rounded-md"
                />
                <SkeletonLoading
                  height={16}
                  width={120}
                  className="rounded-md"
                />
                <SkeletonLoading
                  height={10}
                  width={160}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <SkeletonLoading
              height={10}
              width={60}
              className="rounded-md mb-3"
            />
            <SkeletonLoading height={32} width={90} className="rounded-full" />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
            <SkeletonLoading
              height={10}
              width={50}
              className="rounded-md mb-3"
            />
            <SkeletonLoading height={16} width={140} className="rounded-md" />
          </div>
        </div>

        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
            <SkeletonLoading
              height={20}
              width={140}
              className="rounded-lg mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <SkeletonLoading
                  height={10}
                  width={70}
                  className="rounded-md mb-2"
                />
                <SkeletonLoading
                  height={16}
                  width={90}
                  className="rounded-md"
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                <SkeletonLoading
                  height={10}
                  width={90}
                  className="rounded-md mb-2"
                />
                <SkeletonLoading
                  height={16}
                  width={180}
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <SkeletonLoading height={20} width={160} className="rounded-lg" />
              <SkeletonLoading height={12} width={50} className="rounded-md" />
            </div>
            <div className="p-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-l from-indigo-500/5 via-emerald-500/5 to-fuchsia-500/5 dark:from-indigo-500/10 dark:via-emerald-500/10 dark:to-fuchsia-500/10" />
                <div className="relative space-y-2">
                  <SkeletonLoading
                    height={16}
                    width="100%"
                    className="rounded-lg"
                  />
                  <SkeletonLoading
                    height={16}
                    width="95%"
                    className="rounded-lg"
                  />
                  <SkeletonLoading
                    height={16}
                    width="88%"
                    className="rounded-lg"
                  />
                  <SkeletonLoading
                    height={16}
                    width="92%"
                    className="rounded-lg"
                  />
                  <SkeletonLoading
                    height={16}
                    width="80%"
                    className="rounded-lg"
                  />
                  <SkeletonLoading
                    height={16}
                    width="85%"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogDetailLoading;
