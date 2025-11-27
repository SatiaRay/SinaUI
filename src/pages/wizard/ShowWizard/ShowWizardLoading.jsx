import { SkeletonLoading } from '@components/ui/loading/skeletonLoading';
import 'react-loading-skeleton/dist/skeleton.css';

export const ShowWizardLoading = () => {
  return (
    <div className="rounded-lg flex flex-col h-full overflow-hidden w-full px-0 pt-0 mb-5 md:px-0">
      <div className="flex items-start justify-between">
        <SkeletonLoading
          height={40}
          width={100}
          className="block leading-none align-top !m-0 rounded-md"
        />
        <div className="flex gap-3">
          <SkeletonLoading
            height={40}
            width={140}
            className="block leading-none align-top !m-0 rounded-lg"
          />
          <SkeletonLoading
            height={40}
            width={90}
            className="block leading-none align-top !m-0 rounded-lg"
          />
        </div>
      </div>
      <div className="grid gap-4 mt-6">
        <SkeletonLoading
          height={150}
          className="w-full rounded-lg"
        />
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonLoading
            key={i}
            height={70}
            className="w-full rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
