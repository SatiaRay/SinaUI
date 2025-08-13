import { useRef, useState } from "react";
import { uploadSystemImport } from "../../services/api";

export const Import = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("bg-white");
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setStatusMessage('')
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    try {
      const res = await uploadSystemImport(file);
      console.log("Server response:", res);
      setStatusMessage("آپلود با موفقیت انجام شد");
      setStatusColor("bg-green-600");
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      setStatusMessage("آپلود ناموفق بود");
      setStatusColor("bg-red-400");
    }
  };
  

  return (
    <div className="space-y-4 md:w-1/3 w-full text-white p-6 pt-8 shadow-lg relative flex items-center justify-center flex-col overflow-hidden rounded-xl bg-gray-800 shadow-[rgba(1,1,1,0.5)]">
      <p className="w-1/2 text-center absolute top-0 bg-white rounded-b-xl text-black text-sm py-1">
        Import Backup
      </p>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".zip"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className={`w-12 h-12 mx-auto ${isDragging ? "text-blue-500" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <p className="text-sm">
            {isDragging ? "فایل را اینجا رها کنید" : "فایل را بکشید و رها کنید یا برای انتخاب کلیک کنید"}
          </p>
          <p className="text-xs text-gray-200">لطفا فایل zip خود را بارگذاری کنید</p>
        </div>
      </div>

      {file && (
        <div className="border border-gray-300 rounded-lg w-full p-2 bg-white flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-50">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="flex-1 w-full">
              <p className="text-sm font-medium text-black max-w-44 truncate">{file.name}</p>
              <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} کیلوبایت</p>
            </div>
          </div>

          <button
            onClick={removeFile}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="حذف فایل"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {file && (
        <button
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          onClick={handleUpload}
        >
          آپلود فایل
        </button>
      )}

      {/* Status message */}
      {statusMessage && (
        <div className={`font-bold rounded-lg w-full p-2 flex items-center justify-center text-white ${statusColor}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default Import;
