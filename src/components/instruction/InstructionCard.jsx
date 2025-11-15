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
      setLocalStatus(instruction.status);
      notify.error('خطا در تغییر وضعیت دستورالعمل!');
    }
  };

  return (
    <div
      onClick={() => navigate(`/instruction/edit/${instruction.id}`)}
      className="
        w-full bg-white dark:bg-black/50 shadow-lg dark:shadow-white/10 
        rounded-xl overflow-hidden cursor-pointer p-4 
        transition-transform duration-200 hover:scale-105 
        flex flex-col gap-1
      "
    >
      {/* Title + Status */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-medium w-2/3 text-gray-900 dark:text-white truncate">
          {instruction.label}
        </h5>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoading) toggleVectorStatus();
          }}
          className={`
            px-2 py-1 w-20 text-xs font-semibold rounded-full 
            flex items-center justify-center
            ${localStatus
              ? 'bg-green-100 text-green-800 dark:bg-green-500 dark:text-white'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }
          `}
        >
          {localStatus ? 'فعال' : 'غیر فعال'}
        </button>
      </div>

      {/* Body (flex-1 keeps growing) */}
      <div className="text-gray-500 dark:text-gray-300 flex-1 mt-2">
        <p className="line-clamp-2">{instruction.text}</p>
      </div>

      {/* Footer (mt-auto forces bottom alignment) */}
      <div className="mt-auto pt-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span className="flex gap-2 text-xs">
            <p>آخرین بروزرسانی:</p>
            {new Date(instruction.updated_at).toLocaleDateString('fa-IR')}
          </span>

          <FaTrash
            className="text-red-500 dark:text-red-700 cursor-pointer px-1 box-content"
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
