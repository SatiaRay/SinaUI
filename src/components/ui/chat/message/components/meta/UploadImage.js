import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Dropzone from '../../../../../../ui/Dropzone';
import { fileEndpoints } from '../../../../../../utils/apis';
import imageCompression from 'browser-image-compression';
import { UploadErrorMessage, UploadButtonContainer, UploadButton } from '../../../../common';

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
        <UploadErrorMessage>
          {error}
        </UploadErrorMessage>
      )}

      <UploadButtonContainer>
        <UploadButton
          type="button"
          onClick={() => handleUpload(images)}
          disabled={images.length === 0 || uploading || isLoading}
        >
          {uploading || isLoading ? (
            <ClipLoader size={12} color="white" />
          ) : (
            'ارسال'
          )}
        </UploadButton>

        <UploadButton
          type="button"
          onClick={handleCancel}
          variant="cancel"
        >
          انصراف
        </UploadButton>
      </UploadButtonContainer>
    </div>
  );
};

export default UploadImage;
