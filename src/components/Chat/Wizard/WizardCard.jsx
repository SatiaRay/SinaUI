import React, { useState } from 'react';
import { ShowWizard, UpdateWizard } from './index';
import { wizardEndpoints } from '../../../utils/apis';
import Swal from 'sweetalert2';

const WizardCard = ({
  wizard,
  onClickWizard,
  onDeleteWizard,
  selectedWizardForUpdate,
  onToggleWizard,
}) => {
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const toggleWizardStatus = async (wizardId, currentStatus) => {
    setUpdatingStatus((prev) => ({ ...prev, [wizardId]: true }));
    try {
      const endpoint = currentStatus ? 'disable' : 'enable';
      await wizardEndpoints.toggleStatusWizard(wizardId, endpoint);

      // به جای تغییر مستقیم props از callback والد استفاده می‌کنیم
      onToggleWizard({ ...wizard, enabled: !wizard.enabled });
    } catch (err) {
      setError(err.message || 'خطا در تغییر وضعیت ویزارد');
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [wizardId]: false }));
    }
  };

  const submitDelete = async (wizard) => {
    const result = await Swal.fire({
      title: `آیا از حذف ${wizard.title} مطمئن هستید؟`,
      text: 'این عملیات قابل بازگشت نیست.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'بله، حذف کن!',
    });
    if (result.isConfirmed) {
      try {
        await wizardEndpoints.deleteWizard(wizard.id);
        await Swal.fire({
          title: 'حذف شد!',
          text: `${wizard.title} با موفقیت حذف شد.`,
          icon: 'success',
        });
        onDeleteWizard(wizard.id);
      } catch (error) {
        await Swal.fire({
          title: 'خطا!',
          text: 'خطا در حذف ویزارد. لطفاً دوباره تلاش کنید.',
          icon: 'error',
        });
      }
    }
  };

  return (
    <>
      <div
        onClick={() => onClickWizard(wizard)}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {wizard.title}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWizardStatus(wizard.id, wizard.enabled);
                }}
                disabled={updatingStatus[wizard.id]}
                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors ${
                  wizard.enabled
                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updatingStatus[wizard.id] ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                    <span>در حال تغییر...</span>
                  </div>
                ) : wizard.enabled ? (
                  'فعال'
                ) : (
                  'غیرفعال'
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectedWizardForUpdate(wizard);
                }}
                disabled={updatingStatus[wizard.id]}
                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800`}
              >
                ویرایش
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  submitDelete(wizard);
                }}
                disabled={updatingStatus[wizard.id]}
                className={`px-3 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors bg-red-200 dark:bg-red-900 dark:hover:bg-red-800`}
              >
                حذف
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>شناسه: {wizard.id}</span>
            <span>نوع: {wizard.wizard_type == 'answer' ? 'پاسخ' : 'سوال'}</span>
            <span>{new Date(wizard.created_at).toLocaleString('fa-IR')}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WizardCard;
