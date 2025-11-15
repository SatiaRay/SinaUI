// components/instruction/InstructionCard.js
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../ui/toast';
import { useUpdateInstructionMutation } from 'store/api/ai-features/instructionApi';

const InstructionCard = ({ instruction, handleDelete }) => {
  const navigate = useNavigate();
  const [localStatus, setLocalStatus] = useState(instruction.status);
  const [updateInstruction, result] = useUpdateInstructionMutation();
  const isLoading = result.isLoading ?? false;

  const toggleVectorStatus = async () => {
    setLocalStatus(!localStatus);
    const data = { ...instruction, status: !localStatus };
    try {
      await updateInstruction({ id: instruction.id, data }).unwrap();
    } catch (err) {
      setLocalStatus(instruction.status); // Rollback if error
      notify.error('خطا در تغییر وضعیت دستورالعمل!');
    }
  };

  return (
    <div
      onClick={() => navigate(`/instruction/edit/${instruction.id}`)}
      className="w-full bg-white relative dark:bg-black/50 rounded-xl overflow-hidden dark:shadow-white/10 shadow-lg p-4 transition-shadow cursor-pointer hover:scale-105 transition-transform duration-200"
    >
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium w-2/3 text-gray-900 dark:text-white truncate">
          {instruction.label}
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
            {localStatus ? 'فعال' : 'غیر فعال'}
          </button>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2 justify-between items-center py-1">
          <span className="py-1 flex gap-2 text-xs">
            <p>آخرین بروزرسانی:</p>
            {new Date(instruction.updated_at).toLocaleDateString('fa-IR')}
          </span>
          <FaTrash
            className="text-red-500 dark:text-red-700 pb-1 box-content px-1"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(instruction.id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InstructionCard;