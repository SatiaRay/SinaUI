import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const SkeletonLoading = ({
  rows = 1,
  cols = 1,
  height = 20,
  containerClassName = 'flex flex-row gap-2 my-3',
  className = '',
}) => {
  const skeletonRows = Array.from({ length: rows }).map((_, i) => (
    <Skeleton
      key={i}
      count={cols}
      containerClassName={containerClassName}
      className={className}
      height={height}
    />
  ));

  return (
    <SkeletonTheme
      baseColor="var(--skeleton-base-color)"
      highlightColor="var(--skeleton-highlight-color)"
    >
      {skeletonRows}
    </SkeletonTheme>
  );
};
