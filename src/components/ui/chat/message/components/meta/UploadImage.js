import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Dropzone from '../../../../../../ui/Dropzone';
import { fileEndpoints } from '../../../../../../utils/apis';
import imageCompression from 'browser-image-compression';
import styled from 'styled-components';

const CancelButton = styled.button`
  pointer-events: all !important;
  z-index: 1000 !important;
  position: relative !important;
  cursor: pointer !important;
  opacity: 1 !important;
  visibility: visible !important;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #dc2626 !important;
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #dbeafe;
  color: #1e40af;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 80px;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    background-color: #bfdbfe !important;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background-color: #f3f4f6 !important;
    color: #9ca3af !important;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const MAX_SIZE_BYTES = 500 * 1024; // 500KB

const UploadImage = ({ onCancel, onUpload, isLoading }) => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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

  const handleCancel = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Cancel button clicked', { images, isCanceling });
    if (isCanceling) return;

    setIsCanceling(true);
    await new Promise((resolve) => setTimeout(resolve, 150));

    setImages([]);
    setError(null);
    setUploading(false);

    if (typeof onCancel === 'function') {
      onCancel();
    }

    setIsCanceling(false);
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
        <SendButton
          type="button"
          onClick={() => handleUpload(images)}
          disabled={images.length === 0 || uploading || isLoading}
        >
          {uploading || isLoading ? (
            <ClipLoader size={16} color="#1e40af" />
          ) : (
            'ارسال'
          )}
        </SendButton>

        <CancelButton
          type="button"
          onClick={handleCancel}
          disabled={isCanceling}
        >
          {isCanceling ? '...در حال لغو' : 'انصراف'}
        </CancelButton>
      </div>
    </div>
  );
};

export default UploadImage;
