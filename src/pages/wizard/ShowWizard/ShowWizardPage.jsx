// ShowWizardPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetWizardQuery, useDeleteWizardMutation, useToggleStatusWizardMutation } from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { GoPlusCircle } from 'react-icons/go';
import ShowWizardLoading from './ShowWizardLoading';
import { Sppiner } from '../../../components/ui/sppiner';

const ShowWizardPage = () => {
  /* -------------------------------------------------- */
  /* 1. Params & navigation                              */
  /* -------------------------------------------------- */
  const { wizard_id } = useParams();               // <-- from URL /wizard/:wizard_id
  const navigate = useNavigate();
  if(!wizard_id)
    console.error(`wizard_id param is: ${wizard_id}`)

  /* -------------------------------------------------- */
  /* 2. RTK-Query hooks                                 */
  /* -------------------------------------------------- */
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetWizardQuery({ id: wizard_id }, { skip: !wizard_id });

  const [deleteWizard] = useDeleteWizardMutation();
  const [toggleStatusWizard] = useToggleStatusWizardMutation();

  /* -------------------------------------------------- */
  /* 3. Optimistic cache (same as DocumentIndex)        */
  /* -------------------------------------------------- */
  const [wizard, setWizard] = useState(null);
  if (isSuccess && !wizard) setWizard(data);   // store once for optimistic updates

  /* -------------------------------------------------- */
  /* 4. Delete handler (optimistic + confirm)           */
  /* -------------------------------------------------- */
  const handleDelete = async (childId) => {
    confirm({
      title: 'حذف ویزارد',
      text: 'آیا از حذف این ویزارد مطمئن هستید؟',
      onConfirm: async () => {
        // optimistic remove
        setWizard((prev) => ({
          ...prev,
          children: prev.children.filter((c) => c.id !== childId),
        }));

        try {
          await deleteWizard(childId).unwrap();
          notify.success('ویزارد با موفقیت حذف شد');
        } catch {
          notify.error('خطا در حذف ویزارد');
          // revert
          setWizard(data);
        }
      },
    });
  };

  /* -------------------------------------------------- */
  /* 5. Toggle status (optimistic)                     */
  /* -------------------------------------------------- */
  const handleToggle = async (childId, currentEnabled) => {
    const newEnabled = !currentEnabled;

    // optimistic UI
    setWizard((prev) => ({
      ...prev,
      children: prev.children.map((c) =>
        c.id === childId ? { ...c, enabled: newEnabled } : c
      ),
    }));

    try {
      await toggleStatusWizard({
        wizardId: childId,
        endpoint: newEnabled ? 'enable' : 'disable',
      }).unwrap();
    } catch {
      notify.error('خطا در تغییر وضعیت');
      // revert
      setWizard(data);
    }
  };

  /* -------------------------------------------------- */
  /* 6. Loading / Error / Empty                         */
  /* -------------------------------------------------- */
  if (isLoading) return <ShowWizardLoading />;
  if (isError) return <p className="text-center text-red-600">مشکلی پیش آمده است</p>;
  if (!wizard) return null;

  /* -------------------------------------------------- */
  /* 7. Render                                          */
  /* -------------------------------------------------- */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* ---------- Header ---------- */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">{wizard.title}</h3>

        <div className="flex gap-2">
          {/* Create child */}
          <Link
            to={`/wizard/create?parent_id=${wizard.id}`}
            className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span>ویزارد فرزند جدید</span>
            <GoPlusCircle size={22} className="pr-2 box-content" />
          </Link>

          {/* Back */}
          <Link
            to={wizard.parent_id ? `/wizard/${wizard.parent_id}` : '/wizard'}
            className="px-6 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            بازگشت
          </Link>
        </div>
      </div>

      {/* ---------- Wizard content ---------- */}
      <div className="p-3 md:p-0">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
            dangerouslySetInnerHTML={{ __html: wizard.context }}
          />
        </div>
      </div>

      {/* ---------- Children table ---------- */}
      {wizard.children?.length > 0 && (
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              زیر ویزاردها
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
                    {/* Title */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {child.title}
                    </td>

                    {/* Created at */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(child.created_at).toLocaleString('fa-IR')}
                    </td>

                    {/* Status toggle */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle(child.id, child.enabled);
                        }}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors ${
                          child.enabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                            : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                        }`}
                        disabled={false}
                      >
                        {child.enabled ? 'فعال' : 'غیرفعال'}
                      </button>
                    </td>

                    {/* Actions */}
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