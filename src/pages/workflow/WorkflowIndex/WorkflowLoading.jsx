import Skeleton from 'react-loading-skeleton';

export const WorkflowIndexLoading = () => {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 w-full">
      {/* Header Section Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={32}
          width={150}
          className="w-full sm:w-auto"
        />
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            className="w-full sm:w-28"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            className="w-full sm:w-32"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            className="w-full sm:w-32"
          />
        </div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="hidden sm:block bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="w-full overflow-hidden">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-neutral-200 dark:bg-gray-700">
              <tr>
                {['نام', 'نوع ربات', 'وضعیت', 'عملیات', ''].map((_, index) => (
                  <th key={index} className="px-4 py-3">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={60}
                      className="mx-auto"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-4">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={100}
                      className="mx-auto"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={80}
                      className="mx-auto"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={24}
                      width={60}
                      className="mx-auto"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-2">
                      <Skeleton
                        baseColor="#374151"
                        highlightColor="#5c626b"
                        height={20}
                        width={40}
                      />
                      <Skeleton
                        baseColor="#374151"
                        highlightColor="#5c626b"
                        height={20}
                        width={40}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={32}
                      width={120}
                      className="mx-auto"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Skeletons */}
      <div className="sm:hidden space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={20}
                width={120}
              />
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={24}
                width={60}
              />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={18}
                width={80}
              />
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={18}
                width={100}
              />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="flex gap-2">
                <Skeleton
                  baseColor="#374151"
                  highlightColor="#5c626b"
                  height={32}
                  width={60}
                />
                <Skeleton
                  baseColor="#374151"
                  highlightColor="#5c626b"
                  height={32}
                  width={60}
                />
              </div>
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={32}
                width={100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowIndexLoading;
