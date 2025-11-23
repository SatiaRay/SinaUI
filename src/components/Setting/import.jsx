import { useRef, useState } from 'react';
import { useUploadSystemImportMutation } from '../../store/api/ai-features/SystemApi';
import { notify } from '../../ui/toast';

/**
 * Import Component - Handles system settings import functionality
 *
 * This component provides file upload functionality for importing system settings
 * from a ZIP file. It includes validation and status feedback.
 *
 * @component
 * @example
 * return <Import />
 *
 * @returns {JSX.Element} Import component
 */
export const Import = () => {
  const [statusType, setStatusType] = useState('');
  const fileInputRef = useRef(null);
  const [uploadImport, { isLoading }] = useUploadSystemImportMutation();

  /**
   * Handle file selection and upload process
   *
   * @async
   * @param {Event} e - File input change event
   * @returns {Promise<void>}
   */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file format
    if (!file.name.endsWith('.zip')) {
      notify.error('فرمت فایل باید ZIP باشد');
      return;
    }

    try {
      await uploadImport(file).unwrap();
      notify.success('آپلود با موفقیت انجام شد');
      setStatusType('success');
    } catch (error) {
      console.error('Upload error:', error);
      notify.error('آپلود ناموفق بود');
      setStatusType('error');
    } finally {
      // Reset file input
      e.target.value = '';
    }
  };

  /**
   * Trigger the hidden file input click event
   */
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <button
        onClick={triggerFileInput}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-green-500/20"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">در حال آپلود...</span>
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="text-sm">آپلود فایل پشتیبان</span>
          </>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        className="hidden"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        فقط فایل‌های ZIP
      </p>
    </div>
  );
};

export default Import;
