import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const DecisionNode = ({ data }) => {
  const validConditions = data.conditions?.filter(condition => condition && condition.trim() !== '') || [];
  const handleSpacing = 100 / (validConditions.length + 1);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-yellow-400">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-yellow-500 hover:!bg-yellow-600 transition-colors" 
      />
      <div className="flex items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center bg-yellow-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500 text-sm break-words" style={{ maxWidth: '250px' }}>{data.description}</div>
        </div>
      </div>
      {validConditions.map((condition, index) => (
        <div key={index} className="relative group">
          <Handle
            type="source"
            position={Position.Right}
            id={condition}
            style={{ 
              top: `${(index + 1) * handleSpacing}%`,
              transform: 'translateY(-50%)',
              right: '-4px'
            }}
            className="w-3 h-3 !bg-yellow-500 hover:!bg-yellow-600 transition-colors cursor-crosshair"
            isConnectable={true}
          />
          <div 
            className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md z-50"
            style={{ 
              top: `${(index + 1) * handleSpacing}%`,
              transform: 'translateY(-50%)'
            }}
          >
            {condition}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(DecisionNode); 