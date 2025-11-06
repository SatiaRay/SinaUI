import { useRef, useState } from 'react';
import { systemEndpoints } from '../../utils/apis';
import { notify } from '../../ui/toast';

export const Import = () => {
  const [statusType, setStatusType] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await systemEndpoints.uploadSystemImport(file);
      notify.success(' آپلود با موفقیت انجام شد');
      setStatusType('success');
    } catch (error) {
      notify.error(' آپلود ناموفق بود');
      setStatusType('error');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <button
        onClick={triggerFileInput}
        className="bg-green-800 text-sm font-bold text-white w-1/2 h-10 rounded-lg hover:bg-green-700"
      >
        آپلود فایل پشتیبان
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
