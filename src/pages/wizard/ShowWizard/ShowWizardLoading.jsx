import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ShowWizardLoading = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-3 md:p-8 pt-7">
      <div className="flex items-center justify-between">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={10}  
          width={120}
          style={{
            display: 'block',     // جلوگیری از کشش در flex
            lineHeight: '1',      // حذف فاصله‌ی عمودی اضافی
            transform: 'scaleY(0.7)', // فشرده‌تر شدن ظاهری (اختیاری ولی مؤثر)
            transformOrigin: 'top',   // از بالا فشرده شود
          }}
          className="rounded-md"
        />


        <div className="flex gap-3">
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            width={170}   
            className="rounded-lg"
          />
          <Skeleton
            baseColor="#374151"
            highlightColor="#5c626b"
            height={40}
            width={90}    
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="grid gap-1 mt-6">
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={40}
          width={80}
          className="rounded"
        />
        <Skeleton
          baseColor="#374151"
          highlightColor="#5c626b"
          height={160}
          className="w-full rounded-lg"
        />
      </div>

      <div className="grid gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <Skeleton
            key={i}
            baseColor="#374151"
            highlightColor="#5c626b"
            height={48}         
            className="w-full rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default ShowWizardLoading;