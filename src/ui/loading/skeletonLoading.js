import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export const SkeletonLoading = ({ rows = 1, cols = 1, height = 20, baseColor ="#132440", highlightColor ="#222", containerClassName="flex flex-row gap-2 my-3" }) => {
  let skeletonRows = [];

  for (let i = 0; i < rows; i++) {
    skeletonRows.push(
      <Skeleton
        key={i}
        count={cols}
        containerClassName={containerClassName}
        height={height}
      />
    );
  }

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      {skeletonRows}
    </SkeletonTheme>
  );
};
