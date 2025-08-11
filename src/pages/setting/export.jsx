import { useState } from "react";
import { downloadSystemExport } from "../../services/api";

export const Export = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleDownload = async () => {
    try {
      await downloadSystemExport();
      setStatusMessage("دانلود با موفقیت انجام شد");
      setStatusType("success");
    } catch (error) {
      console.error("Download failed:", error);
      setStatusMessage("دانلود ناموفق بود");
      setStatusType("error");
    }
  };

  return (
    <div className="space-y-4 md:w-1/3 w-full text-white p-6 pt-8 shadow-lg relative flex items-center justify-center flex-col overflow-hidden rounded-xl bg-gray-800 shadow-[rgba(1,1,1,0.5)]">
      <p className="w-1/2 text-center absolute top-0 bg-white rounded-b-xl text-black text-sm py-1">
        Fetch Backup
      </p>

      <div
        onClick={handleDownload}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className={`w-12 h-12 mx-auto`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7.5 10.5L12 15l4.5-4.5M12 3v12"
            />
          </svg>

          <p className="text-sm">برای دانلود فایل کلیک کنید</p>
        </div>
      </div>

      <div
        className={`rounded-lg w-full p-2 flex font-bold items-center justify-center
          ${statusType === "success" ? "bg-green-600 text-white" : ""}
          ${statusType === "error" ? "bg-red-400 text-white" : ""}
          ${!statusType ? "bg-white border-gray-300 text-black" : ""}
        `}
      >
        {statusMessage || "هنوز دانلودی انجام نشده"}
      </div>
    </div>
  );
};

export default Export;
