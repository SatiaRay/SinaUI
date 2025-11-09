import { useRef, useState } from 'react';
import { useUploadSystemImportMutation } from '../../store/api/SystemApi';
import { notify } from '../../ui/toast';

export const Import = () => {
  const [statusType, setStatusType] = useState('');
  const fileInputRef = useRef(null);
  const [uploadImport, { isLoading }] = useUploadSystemImportMutation();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={triggerFileInput}
        disabled={isLoading}
        className="bg-green-800 text-sm font-bold text-white w-1/2 h-10 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'در حال آپلود...' : 'آپلود فایل پشتیبان'}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        className="hidden"
      />
    </>
  );
};

export default Import;
