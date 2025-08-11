import { useState, useCallback } from 'react';

function Setting() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.zip')) {
      setFile(droppedFile);
      const url = URL.createObjectURL(droppedFile);
      setDownloadUrl(url);
    } else {
      alert('لطفا یک فایل ZIP آپلود کنید');
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.zip')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setDownloadUrl(url);
    } else {
      alert('لطفا یک فایل ZIP انتخاب کنید');
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4">
      <section className="w-full max-w-md space-y-4">
        <div className="space-y-1">
          <h1 className="text-sm font-medium text-gray-700">بارگذاری فایل ZIP</h1>
          <div
            className={`border rounded-lg p-3 text-center transition-all duration-200 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-white'
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex items-center justify-between">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
              <p className="text-xs text-gray-500">
                {isDragging
                  ? 'رها کردن فایل اینجا'
                  : file
                  ? file.name
                  : 'فایل را بکشید و رها کنید یا کلیک کنید'}
              </p>
              <label className="cursor-pointer px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                <span>انتخاب فایل</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".zip"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-sm font-medium text-gray-700">دانلود فایل</h1>
          <div className="border border-gray-200 rounded-lg p-3 bg-white flex items-center justify-between">
            {file ? (
              <>
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-gray-700 truncate max-w-[180px]">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <a
                  href={downloadUrl}
                  download={file.name}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  دانلود
                </a>
              </>
            ) : (
              <p className="text-xs text-gray-500 w-full text-center">هنوز فایلی آپلود نشده است</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Setting;