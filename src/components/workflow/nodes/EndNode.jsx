import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EndNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-black/50 border-2 border-red-200 dark:border-red-500">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-red-600 hover:!bg-red-500 transition-colors"
      />
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-600 dark:text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {data.label}
          </div>
          <div
            className="text-gray-600 dark:text-gray-300 text-sm break-words"
            style={{ maxWidth: '250px' }}
          >
            {data.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EndNode);
