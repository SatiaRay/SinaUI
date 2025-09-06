import Dropzone from '../../../../../../ui/Dropzone';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const UploadImage = ({ onCacnel, onUpload, isLoading }) => {
  const [images, setImages] = useState([]);

  return (
    <>
      <Dropzone darkModel={true} onChange={setImages} />
      <div className="flex justify-end gap-2">
        <button
          style={{ visibility: images.length > 0 ? 'visible' : 'hidden' }}
          type="button"
          className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => onUpload(images)}
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
