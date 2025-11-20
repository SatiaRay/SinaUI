// components/workflow/EditWorkflowLoading.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const EditWorkflowLoading = () => {
  /**
   * Generates skeleton elements for simulating workflow editor nodes component
   * @param {number} count of nodes
   */
  const generateNodeSkeleton = (count = 1) => {
    const nodeSkeleton = (
      <div className="bg-gray-800 border-2 border-gray-700 rounded-xl px-8 py-5 shadow-xl flex items-center gap-5 min-w-160">
        <Skeleton
          circle
          width={46}
          height={46}
          baseColor="#374151"
          highlightColor="#4b5563"
        />
        <div>
          <Skeleton
            width={120}
            height={20}
            baseColor="#374151"
            highlightColor="#4b5563"
          />
          <Skeleton
            width={160}
            height={14}
            className="mt-2"
            baseColor="#374151"
            highlightColor="#4b5563"
          />
        </div>
      </div>
    );

    return Array(count).fill(nodeSkeleton).flat();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
        <Skeleton
          width={220}
          height={28}
          baseColor="#374151"
          highlightColor="#4b5563"
        />
        <div className="flex gap-3">
          <Skeleton
            width={95}
            height={42}
            borderRadius={8}
            baseColor="#374151"
            highlightColor="#4b5563"
          />
          <Skeleton
            width={115}
            height={42}
            borderRadius={8}
            baseColor="#374151"
            highlightColor="#4b5563"
          />
        </div>
      </div>

      <div className='grid lg:grid-cols-2 lg:gap-3'>
          <div className="grid gap-1 my-3">
            <Skeleton
              baseColor="#374151"
              highlightColor="#5c626b"
              height={30}
              width={80}
            />
            <Skeleton
              baseColor="#374151"
              highlightColor="#5c626b"
              height={45}
              className="w-full"
            />
          </div>
          <div className="grid gap-1 my-3">
            <Skeleton
              baseColor="#374151"
              highlightColor="#5c626b"
              height={30}
              width={80}
            />
            <Skeleton
              baseColor="#374151"
              highlightColor="#5c626b"
              height={45}
              className="w-full"
            />
          </div>
        </div>

      <div className="flex-1 flex relative border border-gray-700 rounded-lg p-3 mt-3">
        {/* Left Sidebar – Collapsed */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gray-800 border-r border-gray-700 z-10 flex flex-col items-center gap-4 pt-4">
          {/* 6 node icons */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              width={40}
              height={40}
              baseColor="#374151"
              highlightColor="#4b5563"
            />
          ))}

          {/* Run button at bottom */}
          <div className="mt-auto mb-6 grid gap-3">
            <Skeleton
              width={40}
              height={40}
              baseColor="#374151"
              highlightColor="#4b5563"
            />
            <Skeleton
              width={40}
              height={40}
              baseColor="#374151"
              highlightColor="#4b5563"
            />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 ml-16 relative">
          {/* One realistic centered node (like your screenshot) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid lg:grid-cols-2 xl:grid-cols-3 gap-10 items-center w-[75%] h-full">
            {[3, 2, 1].map((i) => (
              <div
                className={`${i == 2 ? 'lg:grid hidden h-[65%]' : 'grid'} ${i == 3 ? 'xl:grid hidden h-full' : 'grid'} gap-3 place-items-center`}
              >
                {generateNodeSkeleton(i)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
