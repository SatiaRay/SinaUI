// components/Wizard/WizardCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaSync } from 'react-icons/fa';
import { confirm } from '../ui/alert/confirmation';
import { useUpdateWizardMutation } from 'store/api/ai-features/wizardApi';
import { notify } from '../ui/toast';

/**
 * WizardCard Component - Displays wizard information with interactive controls
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.wizard - Wizard data object
 * @param {Function} props.handleDelete - Function to handle wizard deletion
 * @returns {JSX.Element} Rendered wizard card component
 */
const WizardCard = ({ wizard, handleDelete }) => {
  /**
   * Use navigation hook
   */
  const navigate = useNavigate();

  /**
   * Store wizard status in state for optimistic toggling
   */
  const [status, setStatus] = useState(wizard.enabled);

  /**
   * Update mutation
   */
  const [updateWizard, { isLoading: isUpdating }] = useUpdateWizardMutation();

  /**
   * Delete handler with confirmation
   * Stops propagation to prevent navigation
   */
  const onDeleteClick = (e) => {
    e.stopPropagation();
    confirm({
      title: 'حذف ویزارد',
      text: `آیا از حذف "${wizard.title}" مطمئن هستید؟`,
      onConfirm: () => {
        handleDelete(wizard.id);
      },
    });
  };

  /**
   * Edit handler
   */
  const onEditClick = (e) => {
    e.stopPropagation();
    navigate(`/wizard/edit/${wizard.id}`);
  };

  /**
   * Card click handler
   */
  const onCardClick = () => {
    navigate(`/wizard/${wizard.id}`);
  };

  /**
   * Toggle wizard status
   */
  const handleToggleStatus = async (e) => {
    e.stopPropagation();

    const newEnabled = !status;
    confirm({
      title: 'تغییر وضعیت ویزارد',
      text: `آیا مطمئن هستید که می‌خواهید این ویزارد را ${newEnabled ? 'فعال' : 'غیرفعال'} کنید؟`,
      onConfirm: async () => {
        // Optimistic update
        setStatus(newEnabled);

        try {
          await updateWizard({
            id: wizard.id,
            data: {
              ...wizard,
              enabled: newEnabled,
            },
          }).unwrap();
          notify.success('وضعیت ویزارد با موفقیت تغییر کرد');
        } catch (err) {
          // Rollback on error
          const original = wizard.enabled;
          setStatus(original);

          const msg =
            err?.data?.detail?.[0]?.msg || 'خطا در تغییر وضعیت ویزارد';
          notify.error(msg);
        }
      },
    });
  };

  return (
    <div
      onClick={onCardClick}
      className="group w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative overflow-hidden"
    >
      {/* Loading overlay */}
      {isUpdating && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
          <FaSync className="animate-spin text-white text-xl" />
        </div>
      )}

      <div className="p-5 h-full flex flex-col">
        {/* Header section with title and status */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1 mr-3">
            {wizard.title}
          </h3>

          {/* Status badge */}
          <div
            onClick={handleToggleStatus}
            className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 min-w-[80px] justify-center flex-shrink-0 cursor-pointer ${
              status
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {status ? (
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

        {/* Wizard metadata */}
        <div className="flex-1 mb-4">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <span className="font-medium">شناسه:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {wizard.id}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">نوع:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {wizard.wizard_type === 'answer' ? 'پاسخ' : 'سوال'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">تاریخ ایجاد:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {new Date(wizard.created_at).toLocaleDateString('fa-IR')}
              </span>
            </div>
          </div>
        </div>

        {/* Separator border */}
        <div className="border-t border-gray-200 dark:border-gray-600 mb-4"></div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-2">
          {/* Desktop action buttons - Full text */}
          <div className="hidden sm:flex items-center gap-2 w-full">
            <button
              onClick={onEditClick}
              className="flex-1 py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap min-w-0"
            >
              <FaEdit size={12} />
              <span className="truncate">ویرایش</span>
            </button>
            <button
              onClick={onDeleteClick}
              className="flex-1 py-2.5 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white font-medium text-xs transition-colors duration-200 flex items-center justify-center gap-1 whitespace-nowrap min-w-0"
            >
              <FaTrash size={12} />
              <span className="truncate">حذف</span>
            </button>
          </div>

          {/* Mobile action buttons - Icons only */}
          <div className="sm:hidden flex items-center gap-2 w-full">
            <button
              onClick={onEditClick}
              className="flex-1 py-2.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 flex items-center justify-center"
              title="ویرایش"
            >
              <FaEdit size={14} />
            </button>
            <button
              onClick={onDeleteClick}
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

export default WizardCard;
