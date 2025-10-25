import { useState } from 'react';
import { FaTrash, FaMicrophone, FaKeyboard, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { documentEndpoints } from '../../../utils/apis';
import { notify } from '../../../ui/toast';
import {PulseLoader} from "react-spinners"
import { useUpdateDocumentMutation } from '../../../store/api/knowledgeApi';

const DocumentCard = ({ document, onStatusChange, handleDelete }) => {
  const navigate = useNavigate();

  const [updateDocument, result] = useUpdateDocumentMutation()

  const isLoading = result.isLoading ?? false

  console.log(result);
  


  const toggleVectorStatus = async () => {
      const data = {...document, status: !document.status}

      updateDocument(data)
  };

  return (
    <div
      onClick={() => navigate(`/document/edit/${document.id}`)}
      className="bg-white relative dark:bg-black/50 rounded-xl overflow-hidden dark:shadow-white/10 shadow-lg p-4 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
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
              isLoading
                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                : document.status
                  ? 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {isLoading ? (
              <PulseLoader size={5}/>
            ) : document.status ? (
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
