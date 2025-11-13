// components/Wizard/WizardCard.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { confirm } from '../ui/alert/confirmation';

const WizardCard = ({ wizard, handleDelete }) => {
  /**
   * Use navigation hook
   */
  const navigate = useNavigate()

  /**
   * Delete handler with confirmation
   * Stops propagation to prevent navigation
   */
  const onDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card click → navigation
    confirm({
      title: 'حذف ویزارد',
      text: `آیا از حذف "${wizard.title}" مطمئن هستید؟`,
      onConfirm: () => {
        handleDelete(wizard.id);
      },
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/wizard/${wizard.id}`)}
    >
      <div className="space-y-4">
        {/* Title + Actions */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {wizard.title}
          </h3>

          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                wizard.enabled
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}
            >
              {wizard.enabled ? 'فعال' : 'غیرفعال'}
            </span>

            {/* Edit Link */}
            <Link
              to={`/wizard/edit/${wizard.id}`}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1 text-xs font-medium rounded-full bg-blue-200 dark:bg-blue-900 hover:bg-blue-300 dark:hover:bg-blue-800 transition-colors"
            >
              ویرایش
            </Link>

            {/* Delete Button */}
            <button
              onClick={onDeleteClick}
              className="px-3 py-1 text-xs font-medium rounded-full bg-red-200 dark:bg-red-900 hover:bg-red-300 dark:hover:bg-red-800 transition-colors"
            >
              حذف
            </button>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>شناسه: {wizard.id}</span>
          <span>نوع: {wizard.wizard_type === 'answer' ? 'پاسخ' : 'سوال'}</span>
          <span>{new Date(wizard.created_at).toLocaleString('fa-IR')}</span>
        </div>
      </div>
    </div>
  );
};

export default WizardCard;