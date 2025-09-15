import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Dropzone from '../../../../../../ui/Dropzone';
import { fileEndpoints } from '../../../../../../utils/apis';
import imageCompression from 'browser-image-compression';

const MAX_SIZE_BYTES = 500 * 1024; // 500KB

const UploadImage = ({ onCancel, onUpload, isLoading }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const compressIfNeeded = async (files) => {
    const processed = [];

    for (const file of files) {
      if (file.size > MAX_SIZE_BYTES) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: file.type,
        };

        const compressedBlob = await imageCompression(file, options);

        const newFile = new File([compressedBlob], file.name, {
          type: file.type,
          lastModified: Date.now(),
        });

        processed.push(newFile);
      } else {
        processed.push(file);
      }
    }

    return processed;
  };

  const handleUpload = async (files) => {
    setError(null);
    if (!files || files.length === 0) {
      setError('هیچ فایلی برای ارسال انتخاب نشده است.');
      return;
    }

    try {
      setUploading(true);
      const readyFiles = await compressIfNeeded(files);
      await fileEndpoints.uploadFiles(readyFiles);
      setUploading(false);

      if (onUpload) onUpload(readyFiles);
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
    if (typeof onCancel === 'function') onCancel();
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
        maxTotalSize={10 * 1024 * 1024} // 10MB
        accept={{
          'image/jpeg': [],
          'image/png': [],
          'image/webp': [],
          'image/jpg': [],
        }}
      />

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800">
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
