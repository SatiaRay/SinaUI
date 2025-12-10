import { useDisplay } from '../../../hooks/display';
import { SkeletonLoading } from '@components/ui/loading/skeletonLoading';

/**
 * Loading component for WorkflowIndexPage - Responsive card-based skeleton matching the actual UI
 * @component
 * @returns {JSX.Element} Rendered skeleton loading component
 */
export const WorkflowIndexLoading = () => {
  const { height } = useDisplay();

  // Calculate number of skeleton cards to fill the viewport
  const cardCount = Math.max(3, Math.floor(height / 220));

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header Section Skeleton */}
      <div className="mx-3 md:mx-0 md:mb-6 pb-3 pt-3 md:pt-0 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        {/* Title Skeleton */}
        <SkeletonLoading height={36} width={120} className="rounded-lg" />

        {/* Action Buttons Skeleton */}
        <div className="flex gap-2 items-center">
          {/* Import Button Skeleton */}
          <SkeletonLoading
            height={48}
            width={130}
            className="rounded-xl hidden md:block"
          />
          <SkeletonLoading
            height={48}
            width={90}
            className="rounded-xl md:hidden"
          />

          {/* Create Button Skeleton */}
          <SkeletonLoading
            height={48}
            width={130}
            className="rounded-xl hidden md:block"
          />
          <SkeletonLoading
            height={48}
            width={90}
            className="rounded-xl md:hidden"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-3 md:px-0 mt-6">
        {/* Skeleton Cards Grid - Matches actual layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: cardCount }).map((_, index) => (
            <div
              key={index}
              className="group w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm relative overflow-hidden"
            >
              <div className="p-5 h-full flex flex-col">
                {/* Card Header - Name and Status */}
                <div className="flex items-center justify-between mb-4">
                  {/* Workflow Name Skeleton */}
                  <div className="flex-1 mr-3">
                    <SkeletonLoading
                      height={24}
                      width="70%"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Status Badge Skeleton */}
                  <div className="flex-shrink-0">
                    <SkeletonLoading
                      height={28}
                      width={80}
                      className="rounded-full"
                    />
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-200 dark:border-gray-600 mb-4"></div>

                {/* Action Buttons Skeleton */}
                <div className="flex items-center justify-between gap-2">
                  {/* Desktop Action Buttons */}
                  <div className="hidden sm:flex items-center gap-2 w-full">
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="sm:hidden flex items-center gap-2 w-full">
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                    <SkeletonLoading
                      height={40}
                      width="100%"
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Hover Effect Skeleton */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0"></div>
            </div>
          ))}
        </div>

        {/* Empty State Skeleton (optional - shows while loading) */}
        {cardCount === 0 && (
          <div className="text-center mx-auto py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <SkeletonLoading
                height={24}
                width="60%"
                className="mx-auto mb-4 rounded-lg"
              />
              <SkeletonLoading
                height={48}
                width={200}
                className="mx-auto rounded-xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowIndexLoading;
