import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';
import 'react-loading-skeleton/dist/skeleton.css';

export const ChatIntegrationsLoading = () => {
  const { height, isLargeDisplay } = useDisplay();
  const listRows = Math.max(4, Math.floor(height / 120));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-2xl mx-auto px-2 md:px-3 py-2 flex flex-col min-h-screen">
        <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              یکپارچه‌سازی‌ها
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <SkeletonLoading height={28} width={100} containerClassName="inline rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-2">
          {/* Security Note */}
          <div className="mb-2">
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 shadow-sm">
              <div className="flex items-start gap-1.5">
                <div className="mt-0 text-base leading-none">⚠️</div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <SkeletonLoading height={16} width={80} />
                    <SkeletonLoading height={16} width={80} />
                  </div>

                  <div>
                    <SkeletonLoading height={10} width="40%" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-3">
            {/* Create Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  یکپارچه‌سازی‌ جدید
                </h4>
              </div>
              <div className="p-3 space-y-4">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  پیش‌نمایش ویجت
                </h4>
              </div>
              <div className="flex flex-col items-center justify-center text-center mt-8">
                <SkeletonLoading height={28} width={40} />
                <SkeletonLoading height={12} width={190} className="mt-2" />
              </div>
            </div>
          </div>

          {/* List Panel */}
          <div className="mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  لیست یکپارچه‌سازی‌ها
                </h4>
              </div>

              <div className="p-3">
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
    </div>
  );
};