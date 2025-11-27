// EditInstructionLoading.js
import { SkeletonLoading } from '@components/ui/loading/skeletonLoading';
import 'react-loading-skeleton/dist/skeleton.css';

export const EditInstructionLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-3 md:p-8 pt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between">
        <SkeletonLoading
          height={30}
          className="inline mt-4"
          width={150}
        />
        <div className="flex gap-3 justify-end mt-3 w-full">
          <SkeletonLoading
            height={45}
            containerClassName="w-1/2 md:w-[80px]"
            className="inline"
          />
          <SkeletonLoading
            height={45}
            containerClassName="w-1/2 md:w-[110px]"
            className="inline"
          />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
        <div className="grid gap-1 mt-5 md:mt-5">
          <SkeletonLoading
            height={30}
            width={80}
          />
          <SkeletonLoading
            height={45}
            className="w-full"
          />
        </div>

        <div className="grid gap-1 mt-5">
          <SkeletonLoading
            height={30}
            width={80}
          />
          <SkeletonLoading
            height={45}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-1 mt-5">
        <SkeletonLoading
          height={30}
          width={80}
        />
        <SkeletonLoading
          height={200}
          className="w-full"
        />
      </div>
    </div>
  );
};
