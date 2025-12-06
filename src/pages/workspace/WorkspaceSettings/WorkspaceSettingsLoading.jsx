import React from "react";
import { SkeletonLoading } from "@components/ui/loading/skeletonLoading";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * OverviewSectionLoading
 */
export const OverviewSectionLoading = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg md:p-6
                 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-2 ">
        <SkeletonLoading height={32} width={32} className="rounded-xl " />
        <SkeletonLoading height={22} width={140} className="rounded-md " />
      </div>

      <div className="grid grid-cols-1 gap-0.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonLoading
            key={i}
            height={60}
            className="w-full rounded-xl !m-0 block"
          />
        ))}
      </div>
    </div>
  );
};

/**
 * MembersSectionLoading
 */
export const MembersSectionLoading = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 md:p-6
                 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <SkeletonLoading height={36} width={36} className="rounded-xl " />
          <SkeletonLoading height={22} width={140} className="rounded-md " />
        </div>

        <SkeletonLoading height={38} width={160} className="rounded-xl" />
      </div>

      <SkeletonLoading
        height={38}
        width={280}
        className="rounded-xl"
      />

      <div className="grid grid-cols-1 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonLoading key={i} height={68} className="w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
};

/**
 * BillingPlaceholderLoading
 */
export const BillingPlaceholderLoading = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3
                 border border-gray-200 dark:border-gray-700 text-center"
    >
      <div className="w-full flex justify-center">
        <SkeletonLoading
          height={20}
          width={240}
          className="rounded-md !m-0"
        />
      </div>
    </div>
  );
};

/**
 * DangerZonePlaceholderLoading
 */
export const DangerZonePlaceholderLoading = () => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3
                 border border-gray-200 dark:border-gray-700 text-center"
    >
      <div className="w-full flex justify-center">
        <SkeletonLoading
          height={20}
          width={350}
          className="rounded-md !m-0"
        />
      </div>
    </div>
  );
};