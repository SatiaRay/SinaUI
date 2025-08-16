// DocumentCard.js
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toggleDocumentVectorStatus } from "../../../services/api";

const DocumentCard = ({ document, onStatusChange, handleDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleVectorStatus = async () => {
    try {
      setIsLoading(true);
      const response = await toggleDocumentVectorStatus(document.id);
      console.log("Toggle Response:", response); // لاگ برای دیباگ
      if (response.status === 200) {
        onStatusChange(document.id, response.data.vector_id, true); // رفرش داده‌ها
      }
    } catch (error) {
      console.error("Error toggling document status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("Document Vector ID:", document.vector_id); // لاگ برای دیباگ

  return (
      <Link
        to={`/document/edit/${document.id}`}
        className="bg-white relative dark:bg-black/50 rounded-xl overflow-hidden dark:shadow-white/10 shadow-lg px-4 pt-9 pb-5  hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
      >
        <div className="flex items-center justify-between">
          <h5 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {document.title || document.uri}
          </h5>
          <div className="flex items-center gap-2">
            <span
              onClick={(e) => {
                e.preventDefault();
                if (!isLoading) {
                  toggleVectorStatus();
                }
              }}
              className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer flex items-center gap-1 min-w-[60px] justify-center ${
                isLoading
                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  : document.vector_id
                  ? "bg-green-100 text-green-800 dark:bg-green-500 dark:text-white"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-3 w-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : document.vector_id ? (
                "فعال"
              ) : (
                "غیر فعال"
              )}
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2 justify-between items-center py-1">
            {document.domain_id && <div> 
            <p>آدرس:</p>
            <p className="w-full truncate max-w-36  ">{document.uri} -</p>
             </div>}
            <span className="py-1 flex gap-2 text-xs">
              <p>  آخرین بروزرسانی:</p>
              {new Date(document.updated_at).toLocaleDateString("fa-IR")}
            </span>
            <FaTrash
              className="text-red-500 dark:text-red-700 pb-1 box-content px-3"
              onClick={(e) => {
                e.preventDefault();
                const isConfirmed = window.confirm("آیا مطمئن هستید ؟");

                if (isConfirmed) {
                  handleDelete(document.id);
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2 py-1 rounded-bl-xl absolute top-0 right-0 px-4 dark:bg-neutral-100 bg-gray-800">
            <span className="text-xs text-neutral-50 dark:text-gray-800">
              نوع ربات:{" "}
              {document.agent_type === "text_agent"
                ? "ربات متنی"
                : document.agent_type === "voice_agent"
                ? "ربات صوتی"
                : document.agent_type === "both"
                ? "همه"
                : "-"}
            </span>
          </div>
        </div>
      </Link>
  );
};

export default DocumentCard;
