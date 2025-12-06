import { useState } from 'react';
import { FaTrash, FaEdit, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notify } from '../ui/toast';
import { useUpdateInstructionMutation } from 'store/api/ai-features/instructionApi';

/**
 * InstructionCard Component - Displays instruction information with interactive controls
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.instruction - Instruction data object
 * @param {Function} props.handleDelete - Function to handle instruction deletion
 * @returns {JSX.Element} Rendered instruction card component
 */
const InstructionCard = ({ instruction, handleDelete }) => {
  const navigate = useNavigate();

  // Local state for instruction status with initial value from props
  const [localStatus, setLocalStatus] = useState(instruction.status);

  // RTK Query mutation for updating instruction
  const [updateInstruction, { isLoading }] = useUpdateInstructionMutation();

  /**
   * Toggles the status of the instruction
   * @async
   * @function toggleStatus
   * @returns {Promise<void>}
   */
  const toggleStatus = async () => {
    // Optimistic update
    const newStatus = !localStatus;
    setLocalStatus(newStatus);

    const updatedInstruction = {
      ...instruction,
      status: newStatus,
    };

    try {
      await updateInstruction({
        id: instruction.id,
        data: updatedInstruction,
      }).unwrap();

      notify.success('وضعیت دستورالعمل با موفقیت تغییر کرد!');
    } catch (err) {
      // Rollback on error
      setLocalStatus(instruction.status);
      notify.error('خطا در تغییر وضعیت دستورالعمل!');
    }
  };

  /**
   * Handles card click navigation to edit page
   * @function handleCardClick
   */
  const handleCardClick = () => {
    navigate(`/instruction/edit/${instruction.id}`);
  };

  /**
   * Handles delete button click with event propagation prevention
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(instruction.id);
  };

  /**
   * Handles status toggle with event propagation prevention
   * @function handleStatusToggle
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleStatusToggle = (e) => {
    e.stopPropagation();
    if (!isLoading) {
      toggleStatus();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group w-full min-h-[140px] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
          <FaSync className="animate-spin text-white text-xl" />
        </div>
      )}

      <div className="p-5 h-full flex flex-col">
        {/* Header section with title and status */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1 mr-3">
            {instruction.label}
          </h3>

          {/* Status toggle button */}
          <button
            onClick={handleStatusToggle}
            disabled={isLoading}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 flex items-center gap-1.5 min-w-[80px] justify-center ${
              localStatus
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {localStatus ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                فعال
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                غیرفعال
              </>
            )}
          </button>
        </div>

        {/* Instruction content */}
        <div className="flex-1 mb-4">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm leading-relaxed">
            {instruction.text}
          </p>
        </div>

        {/* Instruction metadata */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FaEdit className="text-gray-500 w-4 h-4" />
              <span>آخرین بروزرسانی:</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {new Date(instruction.updated_at).toLocaleDateString('fa-IR')}
              </span>
            </div>

            {/* Delete button */}
            <button
              onClick={handleDeleteClick}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group/delete"
              title="حذف دستورالعمل"
            >
              <FaTrash className="text-red-500 group-hover/delete:scale-110 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default InstructionCard;
