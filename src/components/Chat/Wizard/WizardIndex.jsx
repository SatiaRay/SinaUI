import React, { useState, useEffect } from 'react';
import CreateWizard from './CreateWizard';
import ShowWizard from './ShowWizard';
import WizardCard from './WizardCard';
import UpdateWizard from './UpdateWizard';
import { useGetWizardsQuery } from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';

/**
 * WizardIndex component for managing all wizards
 */
const WizardIndex = () => {
  /**
   * State for managing modals
   */
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedWizard, setSelectedWizard] = useState(null);
  const [selectedWizardForUpdate, setSelectedWizardForEdit] = useState(null);

  /**
   * Wizards list query hook
   */
  const { data: wizards, isLoading, isError, error, refetch } = useGetWizardsQuery({ enableOnly: true });

  /**
   * Sync wizards data on load
   */
  useEffect(() => {
    refetch(); // Initial fetch
  }, [refetch]);

  /**
   * Create wizard handler
   */
  const handleWizardCreated = (newWizard) => {
    setShowCreateWizard(false);
    refetch(); 
    notify.success('ویزارد با موفقیت ایجاد شد');
  };

  /**
   * Delete wizard handler
   */
  const handleWizardDeleted = (wizardId) => {
    refetch(); 
    notify.success('ویزارد با موفقیت حذف شد');
  };

  /**
   * Wizard selection handler
   */
  const handleWizardClick = (wizard) => {
    setSelectedWizard(wizard);
  };

  /**
   * Update wizard handler
   */
  const handleWizardUpdated = (updatedWizard) => {
    setSelectedWizardForEdit(null); 
    refetch();
    notify.success('ویزارد با موفقیت به‌روزرسانی شد');
  };

  /**
   * Toggle wizard status handler
   */
  const handleWizardToggled = (updatedWizard) => {
    refetch(); 
    notify.success('وضعیت ویزارد با موفقیت تغییر کرد');
  };

  if (selectedWizard) {
    return (
      <ShowWizard wizard={selectedWizard} onWizardSelect={setSelectedWizard} />
    );
  }

  return (
    <>
      {selectedWizardForUpdate ? (
        <UpdateWizard
          wizard={selectedWizardForUpdate}
          onClose={() => setSelectedWizardForEdit(null)}
          onWizardUpdated={handleWizardUpdated}
        />
      ) : (
        <div className="space-y-6 mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2">
              پاسخ‌های ویزارد
            </h2>
            <button
              onClick={() => setShowCreateWizard(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ایجاد ویزارد جدید
            </button>
          </div>

          {showCreateWizard ? (
            <CreateWizard
              onClose={() => setShowCreateWizard(false)}
              onWizardCreated={handleWizardCreated}
            />
          ) : isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : isError ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
              <p className="text-red-500 dark:text-red-400">{error?.data?.message || 'خطا در دریافت ویزاردها'}</p>
              <button
                onClick={refetch}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                تلاش مجدد
              </button>
            </div>
          ) : wizards?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                هیچ ویزاردی یافت نشد
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                برای ایجاد ویزارد جدید، روی دکمه "ایجاد ویزارد جدید" کلیک کنید
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-4">
              {wizards.map((wizard) => (
                <WizardCard
                  key={wizard.id}
                  wizard={wizard}
                  onClickWizard={handleWizardClick}
                  onDeleteWizard={handleWizardDeleted}
                  selectedWizardForUpdate={setSelectedWizardForEdit}
                  onToggleWizard={handleWizardToggled}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WizardIndex;