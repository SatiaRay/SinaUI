import { useState } from 'react';
import { useLazyDownloadSystemExportQuery } from '../../store/api/SystemApi';
import { notify } from '../../ui/toast';

export const Export = () => {
  const [triggerDownload, { isLoading }] = useLazyDownloadSystemExportQuery();

  const handleDownload = async () => {
    try {
      const blob = await triggerDownload().unwrap();
      if (!blob) throw new Error('فایل دریافت نشد');

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'system_export.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      notify.success('دانلود با موفقیت انجام شد');
    } catch (error) {
      console.error('Download error:', error);
      notify.error('دانلود ناموفق بود');
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="bg-blue-600 text-sm font-bold text-white h-10 w-1/2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'در حال دانلود...' : 'دانلود فایل پشتیبان'}
      </button>
    </>
  );
};

export default Export;
