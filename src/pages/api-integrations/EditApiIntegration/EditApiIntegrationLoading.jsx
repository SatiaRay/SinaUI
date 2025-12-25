import React from 'react';
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';

/**
 * EditApiIntegrationLoading Component - Loading skeleton for API integration edit page
 * @component
 * @returns {JSX.Element} Rendered loading skeleton component
 */
export const EditApiIntegrationLoading = () => {
  const { isMobile, isVerticalLayout } = useDisplay();
  const isOverlayMode =
    typeof window !== 'undefined' ? window.innerWidth < 1150 : false;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <header className="sticky top-0 z-50 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="mx-auto px-2 sm:px-4 py-2 sm:py-3 max-w-full">
          <div className="flex items-center justify-between">
            {/* Left section - Back button, icon and title */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                <SkeletonLoading
                  width={40}
                  height={40}
                  className="rounded-lg"
                  containerClassName="flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    <SkeletonLoading
                      width={160}
                      height={20}
                      className="rounded-lg"
                      containerClassName="block truncate flex-1"
                    />
                  </div>
                  <SkeletonLoading
                    width={120}
                    height={14}
                    className="rounded hidden sm:block"
                    containerClassName="block truncate"
                  />
                  <SkeletonLoading
                    width={80}
                    height={12}
                    className="rounded sm:hidden"
                    containerClassName="block truncate"
                  />
                </div>
              </div>
            </div>

            {/* Right section - Action buttons - ONLY 2 BUTTONS (Test and Save) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Test button */}
              <SkeletonLoading
                width={isMobile ? 36 : 100}
                height={36}
                className="rounded-lg"
                containerClassName="flex-shrink-0"
              />

              {/* Save button */}
              <SkeletonLoading
                width={isMobile ? 60 : 110}
                height={36}
                className="rounded-lg"
                containerClassName="flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row">
          {/* Sidebar skeleton - only show in desktop mode and when NOT in overlay mode */}
          {!isOverlayMode && !isMobile && (
            <div className="relative h-full flex-shrink-0">
              <div className="flex flex-col h-full border-r dark:border-gray-700 bg-white dark:bg-gray-900 w-64">
                {/* Header section */}
                <div className="p-4 border-b dark:border-gray-700">
                  <SkeletonLoading
                    width={120}
                    height={24}
                    className="rounded mb-2"
                    containerClassName="block w-full"
                  />
                  <SkeletonLoading
                    width={80}
                    height={16}
                    className="rounded"
                    containerClassName="block w-full"
                  />
                </div>

                {/* Tabs list */}
                <div className="flex-1 overflow-y-auto p-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="p-3 mb-1">
                      <div className="flex items-center">
                        <SkeletonLoading
                          width={40}
                          height={40}
                          className="rounded-lg"
                          containerClassName="flex-shrink-0"
                        />
                        <div className="mr-3 flex-1 min-w-0">
                          <SkeletonLoading
                            width={100}
                            height={18}
                            className="rounded mb-1 truncate"
                            containerClassName="block w-full"
                          />
                          <SkeletonLoading
                            width={140}
                            height={14}
                            className="rounded truncate"
                            containerClassName="block w-full"
                          />
                        </div>
                        <SkeletonLoading
                          width={16}
                          height={16}
                          className="rounded"
                          containerClassName="flex-shrink-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Content Area skeleton */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              {/* Mobile tab indicator skeleton */}
              {isMobile && (
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <SkeletonLoading
                        width={40}
                        height={40}
                        className="rounded-lg"
                        containerClassName="flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <SkeletonLoading
                          width={100}
                          height={18}
                          className="rounded mb-1 truncate"
                          containerClassName="block w-full"
                        />
                        <SkeletonLoading
                          width={70}
                          height={14}
                          className="rounded truncate"
                          containerClassName="block w-full"
                        />
                      </div>
                    </div>
                    <SkeletonLoading
                      width={40}
                      height={18}
                      className="rounded"
                      containerClassName="flex-shrink-0"
                    />
                  </div>
                </div>
              )}

              {/* Layout based on window width */}
              {isVerticalLayout ? (
                // Vertical layout (window width < 1630px)
                <div className="space-y-4 sm:space-y-6">
                  {/* Main content skeleton */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Form section skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <div className="mb-4">
                        <SkeletonLoading
                          width={180}
                          height={24}
                          className="rounded-lg mb-2 truncate"
                          containerClassName="block w-full"
                        />
                        <SkeletonLoading
                          width={250}
                          height={18}
                          className="rounded truncate"
                          containerClassName="block w-full"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((field) => (
                          <div key={field} className="space-y-2">
                            <SkeletonLoading
                              width={80}
                              height={16}
                              className="rounded truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width="100%"
                              height={40}
                              className="rounded-lg"
                              containerClassName="block"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 sm:mt-6">
                        <SkeletonLoading
                          width="100%"
                          height={100}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                      </div>
                    </div>

                    {/* Parameters/Headers skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <SkeletonLoading
                          width={140}
                          height={24}
                          className="rounded-lg truncate"
                          containerClassName="block sm:flex-1"
                        />
                        <SkeletonLoading
                          width={100}
                          height={36}
                          className="rounded-lg"
                          containerClassName="block sm:flex-shrink-0"
                        />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 border dark:border-gray-700 rounded-lg"
                          >
                            <SkeletonLoading
                              width={80}
                              height={20}
                              className="rounded flex-1 min-w-[80px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={70}
                              height={20}
                              className="rounded flex-1 min-w-[70px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={60}
                              height={20}
                              className="rounded flex-1 min-w-[60px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={36}
                              height={36}
                              className="rounded-lg"
                              containerClassName="flex-shrink-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Side components at the bottom skeleton */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Quick test panel skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={140}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <div className="space-y-3">
                        <SkeletonLoading
                          width="100%"
                          height={40}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                        <SkeletonLoading
                          width="100%"
                          height={100}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                        <div className="flex gap-2">
                          <SkeletonLoading
                            width={70}
                            height={36}
                            className="rounded-lg flex-1"
                            containerClassName="block"
                          />
                          <SkeletonLoading
                            width={70}
                            height={36}
                            className="rounded-lg flex-1"
                            containerClassName="block"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Response schema preview skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={160}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={150}
                        className="rounded-lg"
                        containerClassName="block"
                      />
                    </div>

                    {/* Info card skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={110}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={60}
                        className="rounded-lg mb-3"
                        containerClassName="block"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={60}
                        className="rounded-lg"
                        containerClassName="block"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Horizontal layout (window width >= 1630px)
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Main content skeleton */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Form section skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <div className="mb-4">
                        <SkeletonLoading
                          width={180}
                          height={24}
                          className="rounded-lg mb-2 truncate"
                          containerClassName="block w-full"
                        />
                        <SkeletonLoading
                          width={250}
                          height={18}
                          className="rounded truncate"
                          containerClassName="block w-full"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((field) => (
                          <div key={field} className="space-y-2">
                            <SkeletonLoading
                              width={80}
                              height={16}
                              className="rounded truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width="100%"
                              height={40}
                              className="rounded-lg"
                              containerClassName="block"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 sm:mt-6">
                        <SkeletonLoading
                          width="100%"
                          height={100}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                      </div>
                    </div>

                    {/* Parameters/Headers skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <SkeletonLoading
                          width={140}
                          height={24}
                          className="rounded-lg truncate"
                          containerClassName="block sm:flex-1"
                        />
                        <SkeletonLoading
                          width={100}
                          height={36}
                          className="rounded-lg"
                          containerClassName="block sm:flex-shrink-0"
                        />
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 border dark:border-gray-700 rounded-lg"
                          >
                            <SkeletonLoading
                              width={90}
                              height={20}
                              className="rounded flex-1 min-w-[90px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={80}
                              height={20}
                              className="rounded flex-1 min-w-[80px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={70}
                              height={20}
                              className="rounded flex-1 min-w-[70px] truncate"
                              containerClassName="block"
                            />
                            <SkeletonLoading
                              width={36}
                              height={36}
                              className="rounded-lg"
                              containerClassName="flex-shrink-0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar on the right skeleton */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Quick test panel skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={140}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <div className="space-y-3">
                        <SkeletonLoading
                          width="100%"
                          height={40}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                        <SkeletonLoading
                          width="100%"
                          height={100}
                          className="rounded-lg"
                          containerClassName="block"
                        />
                        <div className="flex gap-2">
                          <SkeletonLoading
                            width={70}
                            height={36}
                            className="rounded-lg flex-1"
                            containerClassName="block"
                          />
                          <SkeletonLoading
                            width={70}
                            height={36}
                            className="rounded-lg flex-1"
                            containerClassName="block"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Response schema preview skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={160}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={150}
                        className="rounded-lg"
                        containerClassName="block"
                      />
                    </div>

                    {/* Info card skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
                      <SkeletonLoading
                        width={110}
                        height={24}
                        className="rounded-lg mb-4 truncate"
                        containerClassName="block w-full"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={60}
                        className="rounded-lg mb-3"
                        containerClassName="block"
                      />
                      <SkeletonLoading
                        width="100%"
                        height={60}
                        className="rounded-lg"
                        containerClassName="block"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer skeleton */}
      <footer className="sticky bottom-0 z-50 border-t dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="mx-auto px-3 sm:px-4 py-3 sm:py-4 max-w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="order-2 sm:order-1 w-full sm:w-auto">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <SkeletonLoading
                  width={16}
                  height={16}
                  className="rounded"
                  containerClassName="flex-shrink-0"
                />
                <SkeletonLoading
                  width={100}
                  height={16}
                  className="rounded truncate"
                  containerClassName="block"
                />
              </div>
            </div>
            <div className="order-1 sm:order-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 sm:gap-3 justify-between">
                <SkeletonLoading
                  width={80}
                  height={40}
                  className="rounded-lg"
                  containerClassName="flex-1 sm:flex-none min-w-[80px]"
                />
                <SkeletonLoading
                  width={80}
                  height={40}
                  className="rounded-lg"
                  containerClassName="flex-1 sm:flex-none min-w-[80px]"
                />
                <SkeletonLoading
                  width={120}
                  height={40}
                  className="rounded-lg"
                  containerClassName="flex-1 sm:flex-none min-w-[120px]"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
