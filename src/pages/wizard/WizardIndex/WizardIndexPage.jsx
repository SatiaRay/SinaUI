import React, { useState } from 'react';
import WizardCard from '../../../components/Wizard/WizardCard';
import { useGetWizardsQuery } from '../../../store/api/AiApi';
import 'react-loading-skeleton/dist/skeleton.css';
import WizardIndexLoading from './WizardIndexLoading';
import { Pagination } from '../../../components/ui/pagination';
import { notify } from '../../../ui/toast';
import CreateWizardPage from '../CreateWizard/CreateWizardPage';
import UpdateWizardPage from '../UpdateWizard/UpdateWizardPage'; 
import { GoPlusCircle } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

/**
 * WizardIndexPage component for displaying and managing wizards
 */
const WizardIndexPage = () => {
  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);
  const perpage = 20;

  const navigate = useNavigate();

  /**
   * Wizards list query hook
   */
  const { data, isLoading, isError, refetch } = useGetWizardsQuery({
    page,
    perpage,
  });

  /**
   * State for modals
   */
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [editTarget, setEditTarget] = useState(null); 

  /**
   * Handle wizard creation
   */
  const handleWizardCreated = () => {
    setShowCreateWizard(false);
    refetch();
    notify.success('ویزارد با موفقیت ایجاد شد');
  };

  /**
   * Display loading page
   */
  if (isLoading) return <WizardIndexLoading />;

  /**
   * Display error message when fetching fails
   */
  if (isError) {
    notify.error('خطا در دریافت ویزاردها. لطفاً دوباره تلاش کنید.');
    return <p>مشکلی پیش آمده است 🛑</p>;
  }

  /**
   * Normalize list shape
   */
  const items = Array.isArray(data?.wizards)
    ? data.wizards
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
    ? data
    : [];

  /**
   * Display wizard cards list
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">ویزاردها</h3>
        <button
          onClick={() => setShowCreateWizard(true)}
          className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span>ویزارد جدید</span>
          <GoPlusCircle size={22} className="pr-2 box-content" />
        </button>
      </div>

      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-3 gap-3">
        {items.length > 0 ? (
          items.map((wizard) => (
            <WizardCard
              key={wizard.id}
              wizard={wizard}
              onClickWizard={(wizard) => navigate(`/wizard/${wizard.id}`)}
              selectedWizardForUpdate={(w) => setEditTarget(w)} 
              onDeleteWizard={() => refetch()}                  
              onToggleWizard={() => refetch()}                
            />
          ))
        ) : (
          <p>هیچ ویزاردی برای نمایش وجود ندارد.</p>
        )}
      </div>

      <Pagination
        page={page}
        perpage={perpage}
        totalPages={data?.pages}
        totalItems={data?.total}
        handlePageChange={setPage}
      />

      {showCreateWizard && (
        <CreateWizardPage
          onClose={() => setShowCreateWizard(false)}
          onWizardCreated={handleWizardCreated}
        />
      )}

      {editTarget && (
        <UpdateWizardPage
          wizard={editTarget}
          onClose={() => setEditTarget(null)}
          onWizardUpdated={() => {
            setEditTarget(null);
            refetch(); 
          }}
        />
      )}
    </div>
  );
};

export default WizardIndexPage;