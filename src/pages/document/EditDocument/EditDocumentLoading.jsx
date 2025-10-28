import Skeleton from 'react-loading-skeleton';

export const EditDocumentLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-3 md:p-8 pt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={30}
          className="inline mt-4"
          width={150}
        />
        <div className='flex gap-3 justify-end mt-3 w-full'>
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={45}
            containerClassName='w-1/2 md:w-[80px]'
            className="inline"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={45}
            containerClassName='w-1/2 md:w-[110px]'
            className="inline"
          />
        </div>
      </div>
      <div className='grid gap-1 mt-5 md:mt-5'>
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={30}
            width={80}
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={45}
            className='w-full'
          />
        </div>

        <div className='grid gap-1 mt-5'>
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={30}
            width={80}
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={45}
            className='w-full'
          />
        </div>

        <div className='grid gap-1 mt-5'>
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={30}
            width={80}
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={200}
            className='w-full'
          />
        </div>
    </div>
  );
};

