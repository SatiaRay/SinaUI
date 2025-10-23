import { useState } from 'react';
import { FaTrash, FaMicrophone, FaKeyboard, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { documentEndpoints } from '../../../utils/apis';
import { notify } from '../../../ui/toast';

const DocumentCard = ({ document, onStatusChange, handleDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const toggleVectorStatus = async () => {
    try {
      setIsLoading(true);
      const response = await documentEndpoints.toggleDocumentVectorStatus(document.id);

      if (response.status === 200) {
        onStatusChange(document.id, response.data.vector_id, true);

        notify.success('وضعیت سند با موفقیت تغییر کرد!');
      }
    } catch (error) {
      notify.error('خطا در تغییر وضعیت سند. دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/document/edit/${document.id}`)}
      className="bg-white relative dark:bg-black/50 rounded-xl overflow-hidden dark:shadow-white/10 shadow-lg px-4 pt-9 pb-5 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
    >
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium w-2/3 text-gray-900 dark:text-white truncate">
          {document.vector_data.metadata.title}
        </h5>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading) {
                toggleVectorStatus();
              }
            }}
            className={`px-2 py-1 w-20 text-xs font-semibold rounded-full cursor-pointer flex items-center gap-1 justify-center ${
              isLoading
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                : document.status
                  ? 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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
            ) : document.status ? (
              'فعال'
            ) : (
              'غیر فعال'
            )}
          </button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 justify-between items-center py-1">
          <span className="py-1 flex gap-2 text-xs">
            <p> آخرین بروزرسانی:</p>
            {new Date(document.updated_at).toLocaleDateString('fa-IR')}
          </span>
          <FaTrash
            className="text-red-500 dark:text-red-700 pb-1 box-content px-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(document.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
