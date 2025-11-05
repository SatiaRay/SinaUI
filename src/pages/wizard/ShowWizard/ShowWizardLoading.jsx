import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShowWizardLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full px-0 pt-0 pb-3 md:px-0">
      <div className="flex items-start justify-between">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={40}
          width={100}
          className="block leading-none align-top !m-0 rounded-md"
        />
        <div className="flex gap-3 ml-3">
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            width={140}
            className="block leading-none align-top !m-0 rounded-lg"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            width={90}
            className="block leading-none align-top !m-0 rounded-lg"
          />
        </div>
      </div>
      <div className="grid gap-1 mt-6">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={70}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
};

export default ShowWizardLoading;
