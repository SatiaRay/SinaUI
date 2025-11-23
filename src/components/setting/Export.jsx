import { useState } from 'react';
import { useLazyDownloadSystemExportQuery } from '../../store/api/ai-features/SystemApi';
import { notify } from '../ui/toast';

/**
 * Export Component - Handles system settings export functionality
 *
 * This component provides download functionality for exporting system settings
 * as a ZIP file. It handles blob download and file creation.
 *
 * @component
 * @example
 * return <Export />
 *
 * @returns {JSX.Element} Export component
 */
export const Export = () => {
  const [triggerDownload, { isLoading }] = useLazyDownloadSystemExportQuery();

  /**
   * Handle download process for system settings export
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleDownload = async () => {
    try {
      const blob = await triggerDownload().unwrap();
      if (!blob) throw new Error('فایل دریافت نشد');

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'system_export.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up URL object
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      notify.success('دانلود با موفقیت انجام شد');
    } catch (error) {
      console.error('Download error:', error);
      notify.error('دانلود ناموفق بود');
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-blue-500/20"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">در حال دانلود...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span className="text-sm">دانلود فایل پشتیبان</span>
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        دریافت پشتیبان تنظیمات
      </p>
    </div>
  );
};

export default Export;
