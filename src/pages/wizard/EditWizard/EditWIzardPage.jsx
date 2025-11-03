import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomDropdown from '../../../ui/dropdown';
import { useGetWizardQuery, useUpdateWizardMutation } from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import { Sppiner } from '../../../components/ui/sppiner';
import EditWizardLoading from './EditWizardLoading';

/**
 * EditWizardPage component for editing an existing wizard
 */
const EditWizardPage = () => {
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
  const [wizard, setWizard] = useState({
    title: '',
    context: '',
    wizard_type: 'answer',
  });

  /**
   * Fill form with wizard data on success
   */
  useEffect(() => {
    if (isSuccess && data) {
      setWizard({
        title: data.title || '',
        context: data.context || '',
        wizard_type: data.wizard_type || 'answer',
      });
    }
  }, [isSuccess, data]);

  /**
   * Update wizard request hook
   */
  const [
    updateWizard,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateWizardMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isUpdateSuccess) {
      notify.success('ویزارد با موفقیت ویرایش شد !');
      navigate('/wizard');
    }
  }, [isUpdateSuccess, navigate]);

  /**
   * Notify failure mutation
   */
  useEffect(() => {
    if (isUpdateError) {
      notify.error('ویرایش ویزارد با خطا مواجه شد. لطفاً کمی بعد مجدداً تلاش کنید.');
    }
  }, [isUpdateError]);

  /**
   * Update wizard handler
   */
  const handleUpdateWizard = () => {
    updateWizard({ id: wizard_id, data: wizard });
  };

  /**
   * Display loading page on loading state
   */
  if (isLoading || !wizard.title) return <EditWizardLoading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              ویرایش ویزارد
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleUpdateWizard}
              disabled={isUpdating}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating ? <Sppiner size={8} /> : 'ذخیره'}
            </button>
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
            <input
              type="text"
              value={wizard.title}
              onChange={(e) =>
                setWizard({ ...wizard, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="عنوان ویزارد"
            />
          </div>

          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              نوع ویزارد:
            </h3>
            <CustomDropdown
              options={[
                { value: 'answer', label: 'جواب' },
                { value: 'question', label: 'سوال' },
              ]}
              value={wizard.wizard_type}
              onChange={(value) =>
                setWizard({ ...wizard, wizard_type: value })
              }
              placeholder="انتخاب نوع ویزارد"
              className="w-full"
              parentStyle="w-full"
            />
          </div>

          <div className="my-2 md:my-3 h-1/2 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <div className="min-h-0 max-h-[900px] overflow-y-auto">
              <CKEditor
                editor={ClassicEditor}
                data={wizard.context}
                onChange={(event, editor) => {
                  const value = editor.getData();
                  setWizard({ ...wizard, context: value });
                }}
                config={{
                  language: 'fa',
                  direction: 'rtl',
                  toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'insertTable',
                    'undo',
                    'redo',
                  ],
                  table: {
                    contentToolbar: [
                      'tableColumn',
                      'tableRow',
                      'mergeTableCells',
                      'tableProperties',
                      'tableCellProperties',
                    ],
                  },
                  htmlSupport: {
                    allow: [
                      {
                        name: 'table',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'tr',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'td',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                      {
                        name: 'th',
                        attributes: true,
                        classes: true,
                        styles: true,
                      },
                    ],
                  },
                }}
                style={{
                  direction: 'rtl',
                  textAlign: 'right',
                  overflow: 'auto',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditWizardPage;