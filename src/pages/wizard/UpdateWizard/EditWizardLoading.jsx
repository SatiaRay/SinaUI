import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import 'react-loading-skeleton/dist/skeleton.css';

export const EditWizardLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-3 md:p-8 pt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 justify-between">
        <SkeletonLoading
          height={30}
          width={160}
          className="inline mt-4"
        />
      </div>

      <div className="grid gap-1 mt-6">
        <SkeletonLoading
          height={30}
          width={100}
        />
        <SkeletonLoading
          height={45}
          className="w-full"
        />
      </div>

      <div className="grid gap-1 mt-6">
        <SkeletonLoading
          height={30}
          width={100}
        />
        <SkeletonLoading
          height={45}
          className="w-full"
        />
      </div>

      <div className="grid gap-1 mt-6">
        <SkeletonLoading
          height={30}
          width={120}
        />
        <SkeletonLoading
          height={100}
          className="w-full"
        />
      </div>
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
  );
};