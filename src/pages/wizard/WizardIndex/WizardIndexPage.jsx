// WizardIndexPage.js
import React, { useState, useEffect } from 'react';
import WizardCard from '../../../components/Wizard/WizardCard';
import {
  useGetWizardsQuery,
  useDeleteWizardMutation,
} from '../../../store/api/AiApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { Pagination } from '../../../components/ui/pagination';
import { notify } from '../../../ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { WizardIndexLoading } from './WizardIndexLoading';

const WizardIndexPage = () => {
  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);
  const perpage = 20;

  /**
   * List of wizards (for optimistic delete)
   */
  const [wizards, setWizards] = useState(null);

  /**
   * Fetch wizards
   */
  const { data, isLoading, isSuccess, isError, error } = useGetWizardsQuery({
    page,
    perpage,
  });

  /**
   * Store initial data for optimistic updates
   */
  if (isSuccess && !wizards) {
    setWizards(data);
  }

  /**
   * Delete mutation
   */
  const [deleteWizard] = useDeleteWizardMutation();

  /**
   * Delete handler (optimistic + confirm)
   */
  const handleDeleteWizard = async (id) => {
    try {
      // Remove wizard optimistic
      setWizards(wizards.filter((wizard) => wizard.id != id));

      await deleteWizard(id).unwrap();
      notify.success('ویزارد با موفقیت حذف شد');
    } catch (err) {
      notify.error('خطا در حذف ویزارد!');
      // Revert: refetch latest data
      setWizards(data.wizards);
    }
  };

  /**
   * Loading
   */
  if (isLoading) return <WizardIndexLoading />;

  /**
   * Error
   */
  if (isError) return <p>مشکلی پیش آمده است</p>;

  /**
   * Prevent render until data ready
   */
  if (!wizards) return null;

  /**
   * Render
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">ویزاردها</h3>
        <Link
          to="/wizard/create"
          className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span>ویزارد جدید</span>
          <GoPlusCircle size={22} className="pr-2 box-content" />
        </Link>
      </div>

      {/* Wizards Grid */}
      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {wizards.length > 0 ? (
          wizards.map((wizard) => (
            <WizardCard
              key={wizard.id}
              wizard={wizard}
              handleDelete={handleDeleteWizard}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            هیچ ویزاردی یافت نشد.
          </p>
        )}
      </div>

      {/* Pagination */}
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
