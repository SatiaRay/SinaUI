import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';


export const SkeletonLoading = ({rows= 1, cols=1, height=20}) => {

    let skeletonRows = []

    for (let i = 0; i < rows; i++) {
        skeletonRows.push(<Skeleton count={cols} containerClassName='flex flex-row gap-2 my-3' height={height}/>)        
    }

  return (
    <SkeletonTheme baseColor="#132440" highlightColor="#222">
      {skeletonRows}
    </SkeletonTheme>
  );
};
