import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetWizardQuery } from '../../../store/api/AiApi';
import ShowWizardLoading from './ShowWizardLoading';
import { notify } from '../../../ui/toast';

const ShowWizard = () => {
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
  const { data, isSuccess, isLoading, isError, error } = useGetWizardQuery({
    id: wizard_id,
  });

  /**
   * Wizard object state prop
   */
  const [wizard, setWizard] = useState(null);

  useEffect(() => {
    if (isSuccess && data) {
      setWizard({
        title: data.title,
        context: data.context,
        wizard_type: data.wizard_type,
      });
    }
  }, [isSuccess, data]);

  /**
   * Notify failure fetching
   */
  useEffect(() => {
    if (isError) {
      notify.error('خطا در دریافت ویزارد. لطفاً دوباره تلاش کنید.');
    }
  }, [isError]);

  /**
   * Display loading page on loading state
   */
  if (isLoading || !wizard) return <ShowWizardLoading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              جزئیات ویزارد
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <Link
              to={'/wizard'}
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              عنوان:
            </h3>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {wizard.title}
            </p>
          </div>

          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              نوع:
            </h3>
            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {wizard.wizard_type === 'answer' ? 'جواب' : 'سوال'}
            </p>
          </div>

          <div className="my-2 md:my-3 h-1/2 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <div
              className="min-h-0 max-h-[900px] overflow-y-auto prose dark:prose-invert max-w-none text-gray-800 dark:text-white"
              dangerouslySetInnerHTML={{ __html: wizard.context }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowWizard;
