// ShowWizardPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useGetWizardQuery,
  useDeleteWizardMutation,
  useUpdateWizardMutation,
} from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { GoPlusCircle } from 'react-icons/go';
import ShowWizardLoading from './ShowWizardLoading';

const ShowWizardPage = () => {
  const { wizard_id } = useParams();
  const navigate = useNavigate();

  /* -------------------------------------------------- */
  /* RTK Query */
  /* -------------------------------------------------- */
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetWizardQuery(
    { id: wizard_id },
    {
      skip: !wizard_id,
      refetchOnMountOrArgChange: true,
    }
  );

  const [deleteWizard] = useDeleteWizardMutation();
  const [updateWizard] = useUpdateWizardMutation();

  /* -------------------------------------------------- */
  /* Sync state */
  /* -------------------------------------------------- */
  const [wizard, setWizard] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      setWizard(data);
    }
  }, [isSuccess, data]);

  /* -------------------------------------------------- */
  /* Delete (optimistic) */
  /* -------------------------------------------------- */
  const handleDelete = async (childId) => {
    confirm({
      title: 'حذف ویزارد',
      text: 'آیا از حذف این ویزارد مطمئن هستید؟',
      onConfirm: async () => {
        setWizard((prev) => ({
          ...prev,
          children: prev.children.filter((c) => c.id !== childId),
        }));

        try {
          await deleteWizard(childId).unwrap();
          notify.success('ویزارد با موفقیت حذف شد');
        } catch {
          notify.error('خطا در حذف ویزارد');
          setWizard(data);
        }
      },
    });
  };

  /* -------------------------------------------------- */
  /* Toggle status (optimistic) – FULL PAYLOAD */
  /* -------------------------------------------------- */
  const handleToggle = async (child) => {
    const childId = child.id;
    const newEnabled = !child.enabled;

    // Optimistic UI update
    setWizard((prev) => ({
      ...prev,
      children: prev.children.map((c) =>
        c.id === childId ? { ...c, enabled: newEnabled } : c
      ),
    }));

    try {
      await updateWizard({
        id: childId,
        data: {
          ...child,           // Send ALL fields
          enabled: newEnabled // Only change this
        },
      }).unwrap();

      notify.success('وضعیت ویزارد با موفقیت تغییر کرد');
    } catch (err) {
      const msg = err?.data?.detail?.[0]?.msg || 'خطا در تغییر وضعیت';
      notify.error(msg);
      setWizard(data); // Revert on error
    }
  };

  /* -------------------------------------------------- */
  /* Render States */
  /* -------------------------------------------------- */
  if (isLoading) return <ShowWizardLoading />;
  if (isError)
    return (
      <p className="text-center text-red-600 p-4">
        {error?.data?.message || 'مشکلی پیش آمده است'}
      </p>
    );
  if (!wizard) return null;

  /* -------------------------------------------------- */
  /* Main Render */
  /* -------------------------------------------------- */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">{wizard.title}</h3>
        <div className="flex gap-2">
          <Link
            to={`/wizard/create?parent_id=${wizard.id}`}
            className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span>ویزارد فرزند جدید</span>
            <GoPlusCircle size={22} className="pr-2 box-content" />
          </Link>
          <Link
            to={wizard.parent_id ? `/wizard/${wizard.parent_id}` : '/wizard'}
            className="px-6 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            بازگشت
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
            dangerouslySetInnerHTML={{ __html: wizard.context }}
          />
        </div>
      </div>

      {/* Children Table */}
      {wizard.children?.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              ویزارد های فرزند
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    تاریخ ایجاد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {wizard.children.map((child) => (
                  <tr
                    key={child.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/wizard/${child.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {child.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(child.created_at).toLocaleString('fa-IR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(child);
                        }}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                          child.enabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                        }`}
                      >
                        {child.enabled ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex gap-2">
                        <Link
                          to={`/wizard/edit/${child.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ویرایش
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(child.id);
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowWizardPage;