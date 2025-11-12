'use client';
import React from 'react';

/**
 * Reusable Error banner
 */
const Error = ({ message, defaultMessage, reset, className = '' }) => {
  const finalMessage =
    message ||
    defaultMessage ||
    'خطایی رخ داد. لطفاً دوباره تلاش کنید.';

  return (
    <div
      className={
        'bg-red-50 dark:bg-red-900/20 p-6 rounded-lg text-center shadow-md border border-red-200 dark:border-red-0 ' +
        className
      }
    >
      <p className="text-red-600 dark:text-red-400 text-sm md:text-base">
        {finalMessage}
      </p>

      {typeof reset === 'function' && (
        <button
          onClick={() => reset()}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  );
};

export default Error;
