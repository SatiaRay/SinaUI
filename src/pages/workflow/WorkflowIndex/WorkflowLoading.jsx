import Skeleton from 'react-loading-skeleton';
import { useDisplay } from '../../../hooks/display';

/**
 * Loading component for WorkflowIndexPage – fully responsive with desktop table + mobile cards
 */
export const WorkflowIndexLoading = () => {
  /**
   * useDisplay: Dynamically calculates available height and whether it's a large display
   */
  const { height, isLargeDisplay } = useDisplay();

  /**
   * Dynamic row count: Ensures skeleton fills viewport without overflow
   * 150px per row (approx. card/table row height) → height / 150
   */
  const rowCount = Math.max(3, Math.floor(height / 150));

  return (
    <div className="container mx-auto w-full p-3 md:p-0">
      {/* Header Section Skeleton */}
      <div className="">
        <div className="flex justify-between items-center w-full mb-5">
          <h3 className="text-2xl md:text-3xl">گردش کارها</h3>
          {/* Desktop: Action Buttons Skeleton (Import + Create) */}
          <div className="flex flex-row gap-3 hidden md:flex">
            <Skeleton
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
              height={45}
              width={120}
              className="w-full"
            />
            <Skeleton
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
              height={45}
              width={120}
              className="w-full"
            />
          </div>

          {/* Mobile: Action Buttons Skeleton (Import + Create) */}
          <div className="flex gap-3 md:hidden">
            <Skeleton
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
              height={35}
              width={90}
            />
            <Skeleton
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
              height={35}
              width={90}
            />
          </div>
        </div>
      </div>

      {/* Desktop Table Skeleton – Hidden on mobile */}
      <div className="sm:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-neutral-200 dark:bg-gray-700">
              <tr>
                {['نام', 'وضعیت', 'عملیات'].map((header, index) => (
                  <th key={index} className="px-4 py-3 text-center">
                    <Skeleton
                      baseColor="var(--skeleton-base-color)"
                      highlightColor="var(--skeleton-highlight-color)"
                      height={20}
                      width={70}
                      className="mx-auto"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: rowCount }).map((_, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {/* Name */}
                  <td className="px-4 py-4 text-center">
                    <Skeleton
                      baseColor="var(--skeleton-base-color)"
                      highlightColor="var(--skeleton-highlight-color)"
                      height={20}
                      width={120}
                      className="mx-auto"
                    />
                  </td>
                  {/* Status Badge */}
                  <td className="px-4 py-4 text-center">
                    <Skeleton
                      baseColor="var(--skeleton-base-color)"
                      highlightColor="var(--skeleton-highlight-color)"
                      height={26}
                      width={70}
                      className="mx-auto rounded-full"
                    />
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Skeleton
                        baseColor="var(--skeleton-base-color)"
                        highlightColor="var(--skeleton-highlight-color)"
                        height={36}
                        width={80}
                        className="rounded-lg"
                      />
                      <div className="hidden lg:flex flex-row gap-2">
                        <Skeleton
                          baseColor="var(--skeleton-base-color)"
                          highlightColor="var(--skeleton-highlight-color)"
                          height={36}
                          width={60}
                          className="rounded-lg hidden"
                        />
                        <Skeleton
                          baseColor="var(--skeleton-base-color)"
                          highlightColor="var(--skeleton-highlight-color)"
                          height={36}
                          width={60}
                          className="rounded-lg hidden"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowIndexLoading;
