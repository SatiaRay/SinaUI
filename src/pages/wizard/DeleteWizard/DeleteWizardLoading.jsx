import Skeleton from 'react-loading-skeleton';

/**
 * DeleteWizardLoading component for displaying loading state
 */
const DeleteWizardLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-6">
      <Skeleton
        baseColor="#374151"
        highlightColor="#5c626b"
        height={30}
        className="mb-4"
        width={150}
      />
      <Skeleton
        baseColor="#374151"
        highlightColor="#5c626b"
        height={20}
        className="mb-2"
        width={300}
      />
      <div className="flex gap-4 mt-4">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={40}
          width={80}
        />
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={40}
          width={80}
        />
      </div>
    </div>
  );
};

export default DeleteWizardLoading;