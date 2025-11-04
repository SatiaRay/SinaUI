import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetWizardQuery, useDeleteWizardMutation } from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import Swal from 'sweetalert2';
import DeleteWizardLoading from './DeleteWizardLoading';

/**
 * DeleteWizardPage component for confirming and deleting a wizard
 */
const DeleteWizardPage = () => {
  /**
   * Destruct wizard_id from uri
   */
  const { wizard_id } = useParams();

  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Fetching Wizard data using RTK Query hook
   */
  const { data, isLoading, isError, error } = useGetWizardQuery({
    id: wizard_id,
  });

  /**
   * Delete wizard mutation hook
   */
  const [deleteWizard] = useDeleteWizardMutation();

  /**
   * Notify failure fetching
   */
  if (isError) {
    notify.error('خطا در دریافت ویزارد. لطفاً دوباره تلاش کنید.');
    return <p>مشکلی پیش آمده است 🛑</p>;
  }

  /**
   * Display loading page on loading state
   */
  if (isLoading || !data) return <DeleteWizardLoading />;

  /**
   * Handle delete confirmation
   */
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `آیا مطمئن هستید؟`,
      text: `آیا از حذف ${data.title} مطمئن هستید؟ این عملیات قابل بازگشت نیست.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'لغو',
      confirmButtonText: 'بله، حذف کن!',
      customClass: {
        confirmButton: 'swal2-confirm-btn',
        cancelButton: 'swal2-cancel-btn',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteWizard(data.id).unwrap();
        notify.success(`${data.title} با موفقیت حذف شد.`);
        navigate('/wizard'); 
      } catch (err) {
        notify.error('خطا در حذف ویزارد. لطفاً دوباره تلاش کنید.');
        console.error('Error deleting wizard:', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">حذف ویزارد</h2>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          آیا می‌خواهید ویزارد <strong>{data.title}</strong> را حذف کنید؟
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            حذف
          </button>
          <button
            onClick={() => navigate('/wizard')}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteWizardPage;