import { SkeletonLoading } from '../../../ui/loading/skeletonLoading';
import { useDisplay } from '../../../hooks/display';
import Skeleton from 'react-loading-skeleton';

export const DocumentIndexLoading = () => {
  /**
   * Response props
   */
  const { height, isLargeDisplay } = useDisplay();

  return (
    <div className="text-center container mx-auto mt-3 md:mt-0 px-3 md:px-0">
      <div className="flex justify-between md:pl-2 mb-6 items-center">
        <h3 className="text-3xl">مستندات</h3>

        <Skeleton
          baseColor="var(--skeleton-base-color)"
          highlightColor="var(--skeleton-highlight-color)"
          height={45}
          className="inline"
          width={110}
        />
      </div>
      <SkeletonLoading
        rows={Math.floor(height / 150)}
        cols={!isLargeDisplay ? 1 : 3}
        height={110}
        containerClassName="flex flex-row my-3"
        className="md:mx-2"
      />
    </div>
  );
};
