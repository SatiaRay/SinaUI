import Dropzone from '../../../../../../ui/Dropzone';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { fileEndpoints } from '../../../../../../utils/apis';

const UploadImage = ({ onCacnel, onUpload, isLoading }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  const handleUpload = async (files) => {
    setError(null); // clear last err
    try {
      await fileEndpoints.uploadFiles(files);
      onUpload(files);
    } catch (err) {
      setError(err.message || 'خطای ناشناخته رخ داد');
    }
  };

  return (
    <>
      <Dropzone darkModel={true} onChange={setImages} />

      {/* Alert برای خطا */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => handleUpload(images)}
              className="ml-4 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-600 dark:bg-gray-800 dark:text-red-200 dark:hover:bg-gray-700"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-3">
        <button
          style={{ visibility: images.length > 0 ? 'visible' : 'hidden' }}
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => handleUpload(images)}
        >
          {isLoading ? <ClipLoader size={12} color="white" /> : 'ارسال'}
        </button>
        <button
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-yellow-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-yellow-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={onCacnel}
        >
          انصراف
        </button>
      </div>
    </>
  );
};

export default UploadImage;
