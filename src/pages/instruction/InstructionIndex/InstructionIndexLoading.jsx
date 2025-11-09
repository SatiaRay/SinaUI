import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const InstructionIndexLoading = () => {
  return (
    <div className="p-4 md:pt-12 container mx-auto overflow-x-hidden">
      <div className="flex max-md:flex-col md:gap-0 gap-2 pt-6 md:pt-0 justify-between items-center mb-4">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={28}
          width={220}
          className="inline"
        />
        <div className="max-md:w-full flex justify-between items-center gap-2 w-1/2">
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={36}
            className="flex-1"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={36}
            width={140}
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="bg-neutral-200 dark:bg-gray-700 p-3">
              <Skeleton
                baseColor="#374151"
                highlightColor="#5c626b"
                height={18}
                className="w-full"
              />
            </div>
            <div className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-3 p-3">
                  <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} />
                  <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} />
                  <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} />
                  <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} />
                  <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg border-t dark:bg-gray-800 p-3 flex items-center justify-between mt-4 rounded-lg">
        <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} width={220} />
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} baseColor="#374151" highlightColor="#5c626b" height={32} width={40} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructionIndexLoading;