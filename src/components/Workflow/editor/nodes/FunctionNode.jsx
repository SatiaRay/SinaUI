import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const FunctionNode = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-black/50 border-2 border-purple-400 dark:border-purple-600">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-purple-500 hover:!bg-purple-600 transition-colors"
      />
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-500 dark:text-purple-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2m4 6v-4a2 2 0 00-2-2h-2m0 0l-3-3m0 0l-3 3"
            />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {data.label || 'تابع'}
          </div>
          <div
            className="text-gray-600 dark:text-gray-300 text-sm break-words"
            style={{ maxWidth: '250px' }}
          >
            {data.description}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-purple-500 hover:!bg-purple-600 transition-colors"
      />
    </div>
  );
};

export default memo(FunctionNode);
