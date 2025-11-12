import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const EditInstructionLoading = () => {
  return (
    <div className="w-full max-w-[680px] mx-auto">
      <div className="grid grid-cols-1">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={30}
          width={180}
          className="inline mt-4"
        />
      </div>
      <div className="grid gap-1 mt-5">
        <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} width={100} />
        <Skeleton baseColor="#374151" highlightColor="#5c626b" height={40} className="w-full" />
      </div>
      <div className="grid gap-1 mt-5">
        <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} width={100} />
        <Skeleton baseColor="#374151" highlightColor="#5c626b" height={100} className="w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div className="grid gap-1">
          <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} width={70} className="ml-auto" />
          <Skeleton baseColor="#374151" highlightColor="#5c626b" height={40} className="w-full" />
        </div>
        <div className="grid gap-1">
          <Skeleton baseColor="#374151" highlightColor="#5c626b" height={18} width={60} className="ml-auto" />
          <Skeleton baseColor="#374151" highlightColor="#5c626b" height={40} className="w-full" />
        </div>
      </div>
      <div className="flex gap-3 justify-end ltr:justify-start mt-4 w-full">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={44}
          containerClassName="w-[90px]"
          className="inline"
        />
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={44}
          containerClassName="w-[130px]"
          className="inline"
        />
      </div>
    </div>
  );
};

export default EditInstructionLoading;