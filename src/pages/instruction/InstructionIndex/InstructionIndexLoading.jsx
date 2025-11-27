// InstructionIndexLoading.js
import { SkeletonLoading } from '../../../components/ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';
import 'react-loading-skeleton/dist/skeleton.css';

export const InstructionIndexLoading = () => {
  /**
   * Response props
   */
  const { height, isLargeDisplay } = useDisplay();

  return (
    <div className="text-center container mx-auto mt-3 md:mt-0 px-3 md:px-0">
      <div className='flex justify-between md:pl-2 mb-6 items-center'>
        <h3 className="text-3xl">دستورالعمل‌ها</h3>
        <SkeletonLoading
          height={45}
          containerClassName="inline"
          width={110}
        />
      </div>

      <SkeletonLoading
        rows={Math.floor(height / 150) - 1}
        cols={!isLargeDisplay ? 1 : 3}
        height={150}
        containerClassName='flex flex-row my-3'
        className='md:mx-2'
      />
    </div>
  );
};