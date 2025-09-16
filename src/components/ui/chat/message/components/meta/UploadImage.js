import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Dropzone from '../../../../../../ui/Dropzone';
import { fileEndpoints } from '../../../../../../utils/apis';

const UploadImage = ({ onCacnel, onUpload, isLoading }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    setError(null);
    if (!files || files.length === 0) {
      setError('هیچ فایلی برای ارسال انتخاب نشده است.');
      return;
    }

    try {
      setUploading(true);
      await fileEndpoints.uploadFiles(files);
      setUploading(false);
      if (onUpload) onUpload(files);
      setImages([]);
    } catch (err) {
      setUploading(false);
      const msg =
        err?.message ||
        err?.msg ||
        (typeof err === 'string' ? err : 'خطای ارسال رخ داد');
      setError(msg);
    }
  };

  const handleCancel = () => {
    setImages([]);
    if (typeof onCacnel === 'function') onCacnel();
  };

  return (
    <div>
      <Dropzone
        files={images}
        onChange={(next) => {
          setImages(next);
          setError(null);
        }}
        maxFiles={5}
        maxTotalSize={10 * 1024 * 1024} // مجموع همه فایل‌ها حداکثر ۱۰ مگ
        accept={{
          'image/jpeg': [],
          'image/png': [],
          'image/webp': [],
          'image/jpg': [],
        }}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => handleUpload(images)}
          disabled={images.length === 0 || uploading || isLoading}
          className={`px-3 py-2 text-xs font-medium rounded-lg text-white ${
            images.length === 0 || uploading || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading || isLoading ? (
            <ClipLoader size={12} color="white" />
          ) : (
            'ارسال'
          )}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-2 text-xs font-medium rounded-lg bg-yellow-600 text-white hover:bg-yellow-700"
        >
          انصراف
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
