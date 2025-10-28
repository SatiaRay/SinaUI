import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../ui/toast';
import { useUpdateDocumentMutation } from '../../store/api/knowledgeApi';

const DocumentCard = ({ document,  handleDelete }) => {
  const navigate = useNavigate();

  const [localStatus , setLocalStatus] = useState(document.status)

  const [updateDocument, result] = useUpdateDocumentMutation()

  const isLoading = result.isLoading ?? false

  const toggleVectorStatus = async () => {
      setLocalStatus(!localStatus)

      const data = {...document, status: !document.status}

      try {
        console.log(data)
        await updateDocument({id: document.id, data}).unwrap();
      } catch (err) {
        setLocalStatus(document.status); // Rollback if error
        notify.error('خطا در تغییر وضعیت سند!');
      }
  };

  return (
    <div
      onClick={() => navigate(`/document/edit/${document.id}`)}
      className="w-full bg-white relative dark:bg-black/50 rounded-xl overflow-hidden dark:shadow-white/10 shadow-lg p-4 transition-shadow cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium w-2/3 text-gray-900 dark:text-white truncate">
          {document.title}
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
               localStatus
                  ? 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            { localStatus ? (
              'فعال'
            ) : (
              'غیر فعال'
            )}
          </button>
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
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
