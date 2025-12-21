import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';
import 'react-loading-skeleton/dist/skeleton.css';

export const ChatIntegrationsLoading = () => {
  const { height, isLargeDisplay } = useDisplay();
  const listRows = Math.max(4, Math.floor(height / 120));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-4 py-3 text-white rounded-2xl shadow-md">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur">
              <span className="text-xl">🧩</span>
            </div>
            <h3 className="text-xl font-bold">یکپارچه‌سازی‌های چت</h3>
          </div>
          <SkeletonLoading
            height={22}
            width={100}
            containerClassName="inline rounded-full"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 md:p-3">
        {/* Security Note */}
        <div className="max-w-screen-2xl mx-auto mb-3">
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 shadow-sm">
            <div className="flex items-start gap-2">
              <div className="mt-0.5 text-lg">⚠️</div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <SkeletonLoading height={20} width={110} />
                  <SkeletonLoading height={20} width={90} />
                </div>
                <SkeletonLoading height={12} width={500} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-3">
          {/* Create Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-indigo-200 dark:border-indigo-900">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-white">
              <h4 className="text-lg font-bold">یکپارچه‌سازی‌ جدید</h4>
            </div>
            <div className="p-3 space-y-4 text-right">
              <div>
                <SkeletonLoading height={14} width={80} />
                <SkeletonLoading height={44} className="mt-2" />
              </div>
              <div>
                <SkeletonLoading height={14} width={95} />
                <SkeletonLoading height={44} className="mt-2" />
              </div>
              <SkeletonLoading height={44} />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-200 dark:border-teal-900">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-3 py-2 text-white">
              <h4 className="text-lg font-bold">پیش‌نمایش ویجت</h4>
            </div>
            <div className="flex flex-col items-center justify-center text-center mt-8">
              <SkeletonLoading height={28} width={40} />
              <SkeletonLoading height={12} width={190} className="mt-2" />
            </div>
          </div>
        </div>

        {/* List Panel */}
        <div className="mt-4 max-w-screen-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-orange-200 dark:border-orange-900">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-3 py-2 text-white">
              <h4 className="text-lg font-bold">لیست یکپارچه‌سازی‌ها</h4>
            </div>

            <div className="p-3 text-right">
              {!isLargeDisplay ? (
                <div className="grid grid-cols-1 gap-3 md:hidden">
                  {Array.from({ length: Math.min(6, listRows) }, (_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <SkeletonLoading height={10} width={60} />
                          <SkeletonLoading height={14} className="mt-2" />
                        </div>
                        <SkeletonLoading height={22} width={60} />
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                          <SkeletonLoading height={10} width={55} />
                          <SkeletonLoading height={14} className="mt-2" />
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3">
                          <SkeletonLoading height={10} width={70} />
                          <SkeletonLoading height={14} className="mt-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="hidden md:block overflow-auto rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="bg-gray-50 dark:bg-gray-900 px-3 py-1.5 border-b border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-4 gap-2 items-center">
                      <SkeletonLoading height={10} width={58} />
                      <SkeletonLoading height={10} width={52} />
                      <SkeletonLoading height={10} width={58} />
                      <SkeletonLoading height={10} width={52} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-900">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 border-b border-gray-200 dark:border-gray-800"
                      >
                        <div className="grid grid-cols-4 gap-2 items-center">
                          <SkeletonLoading height={10} width={95} />
                          <SkeletonLoading height={10} width={95} />
                          <SkeletonLoading height={10} width={250} />
                          <div className="flex gap-1.5">
                            <SkeletonLoading height={26} width={56} />
                            <SkeletonLoading height={26} width={56} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
