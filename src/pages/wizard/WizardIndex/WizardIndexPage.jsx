import React, { useState } from 'react';
import WizardCard from './WizardCard';
import { useGetWizardsQuery } from '../../../store/api/AiApi';
import 'react-loading-skeleton/dist/skeleton.css';
import WizardIndexLoading from './WizardIndexLoading';
import { Pagination } from '../../../components/ui/pagination';
import { notify } from '../../../ui/toast';
import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';

const WizardIndexPage = () => {
  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);
  const perpage = 20;

  /**
   * List of wizards
   */
  const [wizards, setWizards] = useState(null);

  /**
   * Fetch wizards list api hook
   */
  const { data, isLoading, isSuccess, isError, error } = useGetWizardsQuery({
    page,
    perpage,
  });

  /**
   * Store wizards from request response data to state prop
   */
  if (isSuccess && !wizards) setWizards(data.wizards);

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
   * Prevent map wizards when it is null
   */
  if (!wizards) return null;

  /**
   * Display wizard cards list
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">ویزاردها</h3>
        <Link
        //   to={'/wizard/create'}
        //   className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span>ویزارد جدید</span>
          <GoPlusCircle size={22} className="pr-2 box-content" />
        </Link>
      </div>
      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-3 gap-3">
        {wizards.map((wizard) => (
          <WizardCard wizard={wizard} key={wizard.id} onDelete={() => {}} />
        ))}
      </div>
      <Pagination
        page={page}
        perpage={perpage}
        totalPages={data.pages}
        totalItems={data.total}
        handlePageChange={setPage}
      />
    </div>
  );
};

export default WizardIndexPage;
