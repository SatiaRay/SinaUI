import { useState } from "react";
import { downloadSystemExport } from "../../services/api";
import { toast } from "react-toastify";

export const Export = () => {
  const [statusMessage, setStatusMessage] = useState("");

  const handleDownload = async () => {
    try {
      const blob = await downloadSystemExport();
      if (!blob) throw new Error("فایل دریافت نشد");

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "system_export.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(" دانلود با موفقیت انجام شد");
    } catch (error) {
      toast.error(" دانلود ناموفق بود");
    }
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className="bg-blue-600 text-sm font-bold text-white h-10 w-1/2 rounded-lg hover:bg-blue-700"
      >
        دانلود فایل پشتیبان
      </button>
      {statusMessage && <p className="mt-2">{statusMessage}</p>}
    </>
  );
};

export default Export;
