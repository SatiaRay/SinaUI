import { useState, useRef } from "react";
import { uploadSystemImport } from "../../services/api";
import { toast } from "react-toastify";

export const Import = () => {
  const [statusType, setStatusType] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadSystemImport(file);
      toast.success(" آپلود با موفقیت انجام شد");
      setStatusType("success");
    } catch (error) {
      toast.error(" آپلود ناموفق بود");
      setStatusType("error");
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
