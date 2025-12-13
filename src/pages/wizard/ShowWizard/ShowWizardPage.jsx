// ShowWizardPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  useGetWizardQuery,
  useDeleteWizardMutation,
  useUpdateWizardMutation,
} from 'store/api/ai-features/wizardApi';
import { notify } from '@components/ui/toast';
import { confirm } from '@components/ui/alert/confirmation';
import Icon from '@components/ui/Icon';
import { ShowWizardLoading } from './ShowWizardLoading';
import WizardCard from '../../../components/wizard/WizardCard'; // Import WizardCard

const ShowWizardPage = () => {
  const { wizard_id } = useParams();
  const navigate = useNavigate();

  /* -------------------------------------------------- */
  /* RTK Query */
  /* -------------------------------------------------- */
  const { data, isLoading, isSuccess, isError, error } = useGetWizardQuery(
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
  /* Delete handler (optimistic) */
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
          ...child,
          enabled: newEnabled,
        },
      }).unwrap();

      notify.success('وضعیت ویزارد با موفقیت تغییر کرد');
    } catch (err) {
      const msg = err?.data?.detail?.[0]?.msg || 'خطا در تغییر وضعیت';
      notify.error(msg);
      setWizard(data);
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
      {/* Static Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          جزئیات ویزارد
        </h3>
        <div className="flex gap-2">
          <Link
            to={`/wizard/create?parent_id=${wizard.id}`}
            className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span className="hidden sm:inline">ویزارد فرزند جدید</span>
            <span className="sm:hidden">جدید</span>
            <Icon name="PlusCircle" size={22} className="pr-2 box-content" />
          </Link>
          <Link
            to={wizard.parent_id ? `/wizard/${wizard.parent_id}` : '/wizard'}
            className="px-6 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            بازگشت
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-0 flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
          {/* Wizard Title */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <h1
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white line-clamp-2 break-words"
              title={wizard.title}
            >
              {wizard.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>شناسه: {wizard.id}</span>
              <span>
                نوع: {wizard.wizard_type === 'answer' ? 'پاسخ' : 'سوال'}
              </span>
              <span>وضعیت: {wizard.enabled ? 'فعال' : 'غیرفعال'}</span>
            </div>
          </div>

          {/* Wizard Context */}
          <div
            className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300"
            dangerouslySetInnerHTML={{ __html: wizard.context }}
          />
        </div>

        {/* Children as WizardCard List */}
        {wizard.children?.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {wizard.children.map((child) => (
              <WizardCard
                key={child.id}
                wizard={child}
                handleDelete={handleDelete}
                onToggle={() => handleToggle(child)} // Optional: if card supports toggle
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-gray-500 dark:text-gray-400">
            هیچ ویزارد فرزند یافت نشد.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShowWizardPage;
