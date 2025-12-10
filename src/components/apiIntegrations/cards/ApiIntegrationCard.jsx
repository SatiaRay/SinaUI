import React, { useState } from 'react';
import { FaTrash, FaEdit, FaSync, FaKey, FaLink, FaCopy } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { notify } from '../../ui/toast';

/**
 * ApiIntegrationCard Component - Displays API integration information with interactive controls
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.integration - API integration data object
 * @param {Function} props.handleDelete - Function to handle integration deletion
 * @param {Function} props.handleStatusToggle - Function to handle status toggle
 * @returns {JSX.Element} Rendered API integration card component
 */
const ApiIntegrationCard = ({
  integration,
  handleDelete,
  handleStatusToggle,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [localStatus, setLocalStatus] = useState(integration.is_active);

  /**
   * Handles status toggle with optimistic update
   * @async
   * @function handleStatusToggleLocal
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleStatusToggleLocal = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    // Optimistic update
    const newStatus = !localStatus;
    setLocalStatus(newStatus);

    // Simulate API call delay
    setTimeout(() => {
      if (handleStatusToggle) {
        handleStatusToggle(integration.id, newStatus);
      }
      setIsLoading(false);
      notify.success('وضعیت API با موفقیت تغییر کرد!');
    }, 300);
  };

  /**
   * Handles card click navigation to edit page
   * @function handleCardClick
   */
  const handleCardClick = () => {
    navigate(`/api-integrations/edit/${integration.id}`);
  };

  /**
   * Handles delete button click
   * @function handleDeleteClick
   * @param {React.MouseEvent} e - Mouse event
   */
  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleDelete(integration.id);
  };

  /**
   * Formats API key for display (shows first and last characters)
   * @function formatApiKey
   * @returns {string} Formatted API key
   */
  const formatApiKey = () => {
    const key = integration.api_key;
    if (!key || key.length <= 12) return key || 'تعریف نشده';
    return `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
  };

  /**
   * Copies API key to clipboard
   * @async
   * @function copyApiKey
   * @param {React.MouseEvent} e - Mouse event
   */
  const copyApiKey = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(integration.api_key);
      notify.success('کلید API کپی شد!');
    } catch (err) {
      notify.error('خطا در کپی کلید API!');
    }
  };

  /**
   * Gets the integration type icon based on integration type
   * @function getIntegrationIcon
   * @returns {JSX.Element} Appropriate icon for integration type
   */
  const getIntegrationIcon = () => {
    switch (integration.integration_type) {
      case 'openai':
        return <FaKey className="text-purple-500" />;
      case 'anthropic':
        return <FaKey className="text-blue-500" />;
      case 'custom':
        return <FaLink className="text-green-500" />;
      default:
        return <FaKey className="text-gray-500" />;
    }
  };

  /**
   * Gets integration type label in Persian
   * @function getIntegrationTypeLabel
   * @returns {string} Persian label for integration type
   */
  const getIntegrationTypeLabel = () => {
    switch (integration.integration_type) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic';
      case 'custom':
        return 'سفارشی';
      default:
        return integration.integration_type;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group w-full min-h-[140px] bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
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
          <div className="flex-1 mr-3">
            <div className="flex items-center gap-2 mb-2">
              {getIntegrationIcon()}
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                {getIntegrationTypeLabel()}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
              {integration.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
              {integration.base_url || integration.description}
            </p>
          </div>

          {/* Status toggle button */}
          <button
            onClick={handleStatusToggleLocal}
            disabled={isLoading}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 flex items-center gap-1.5 min-w-[80px] justify-center ${
              localStatus
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-800'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {localStatus ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                فعال
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                غیرفعال
              </>
            )}
          </button>
        </div>

        {/* Integration metadata */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex flex-col gap-1 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FaKey className="text-xs text-indigo-500" />
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {formatApiKey()}
                </span>
                <button
                  onClick={copyApiKey}
                  className="p-1 text-gray-400 hover:text-indigo-500 transition-colors"
                  title="کپی کلید API"
                >
                  <FaCopy className="text-xs" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span>آخرین بروزرسانی:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(integration.updated_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group/delete"
                title="حذف API"
              >
                <FaTrash className="text-red-500 group-hover/delete:scale-110 transition-transform duration-200" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/api-integrations/edit/${integration.id}`);
                }}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 group/edit"
                title="ویرایش API"
              >
                <FaEdit className="text-blue-500 group-hover/edit:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default ApiIntegrationCard;
