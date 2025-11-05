import { useDisplay } from '../../../hooks/display';
import Skeleton from 'react-loading-skeleton';

export const WorkflowIndexLoading = () => {
  const { height, isLargeDisplay } = useDisplay();

  return (
    <div className="container mx-auto px-4 py-12 w-full">
      <div className="flex max-md:flex-col max-md:gap-4 justify-between items-center mb-4">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={32}
          width={150}
          className="max-md:w-full"
        />
        <div className="flex items-center max-md:justify-between max-md:w-full md:gap-2 gap-1">
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={36}
            width={120}
            className="max-md:w-1/4"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={36}
            width={140}
            className="max-md:w-1/2"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={36}
            width={140}
            className="max-md:w-1/2"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
            <thead className="bg-neutral-200 dark:bg-gray-700">
              <tr>
                {['نام', 'نوع ربات', 'وضعیت', 'عملیات', ''].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={60}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={100}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={20}
                      width={80}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={24}
                      width={60}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <Skeleton
                        baseColor="#374151"
                        highlightColor="#5c626b"
                        height={20}
                        width={40}
                        className="mx-2"
                      />
                      <Skeleton
                        baseColor="#374151"
                        highlightColor="#5c626b"
                        height={20}
                        width={40}
                        className="mx-2"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton
                      baseColor="#374151"
                      highlightColor="#5c626b"
                      height={32}
                      width={120}
                    />
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
