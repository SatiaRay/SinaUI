import { useState } from 'react';
import { FaTrash, FaEdit, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * WorkflowCard Component - Displays workflow information with interactive controls
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.workflow - Workflow data object
 * @param {Function} props.handleDelete - Function to handle workflow deletion
 * @param {Function} props.handleDownload - Function to handle workflow export
 * @returns {JSX.Element} Rendered workflow card component
 */
const WorkflowCard = ({ workflow, handleDelete, handleDownload }) => {
  const navigate = useNavigate();

  // Local state for workflow status with initial value from props
  const [localStatus, setLocalStatus] = useState(workflow.status);

  /**
   * Handles card click navigation to edit page
   * @function handleCardClick
   */
  const handleCardClick = () => {
    navigate(`/workflow/${workflow.id}`);
  };

  /**
   * Handles delete button click with event propagation prevention
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    handleDelete(workflow.id);
  };

  /**
   * Handles download button click with event propagation prevention
   * @function handleDownloadClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleDownloadClick = async (e) => {
    e.stopPropagation();
    handleDownload(workflow.id);
  };

  /**
   * Handles edit button click with event propagation prevention
   * @function handleEditClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleEditClick = (e) => {
    e.stopPropagation();
    handleCardClick();
  };

  return (
    <div
      onClick={handleCardClick}
      className="group w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
    >
      <div className="p-5 h-full flex flex-col">
        {/* Header section with name and status */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1 mr-3">
            {workflow.name || 'بدون نام'}
          </h3>

          {/* Status badge */}
          <div
            className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 min-w-[80px] justify-center flex-shrink-0 ${
              localStatus
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
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
          </div>
        </div>

        {/* Separator border */}
        <div className="border-t border-gray-200 dark:border-gray-600 mb-4"></div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Desktop action buttons - Full text */}
          <div className="hidden sm:flex items-center gap-2 w-full">
            <button
              onClick={handleDownloadClick}
              className="flex-1 py-2.5 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap min-w-0"
            >
              <FaDownload size={12} />
              <span className="truncate">دریافت خروجی</span>
            </button>
            <button
              onClick={handleEditClick}
              className="flex-1 py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap min-w-0"
            >
              <FaEdit size={12} />
              <span className="truncate">ویرایش</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap min-w-0"
            >
              <FaTrash size={12} />
              <span className="truncate">حذف</span>
            </button>
          </div>

          {/* Mobile action buttons - Icons only */}
          <div className="sm:hidden flex items-center gap-2 w-full">
            <button
              onClick={handleDownloadClick}
              className="flex-1 py-2.5 text-green-600 border border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
              title="دریافت خروجی"
            >
              <FaDownload size={14} />
            </button>
            <button
              onClick={handleEditClick}
              className="flex-1 py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
              title="ویرایش"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
              title="حذف"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default WorkflowCard;
