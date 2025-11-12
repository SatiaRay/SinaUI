// CreateWizardPage.js
import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomDropdown from '../../../ui/dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../../ui/toast';
import { useCreateWizardMutation } from '../../../store/api/AiApi';
import { ckEditorConfig } from '../../../configs';
import { Sppiner } from '../../../components/ui/sppiner';

const CreateWizardPage = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Wizard object state
   */
  const [wizard, setWizard] = useState({
    title: '',
    context: '',
    wizard_type: 'answer',
  });

  /**
   * Create wizard mutation
   */
  const [createWizard, { isLoading, isSuccess, isError, error }] =
    useCreateWizardMutation();

  /**
   * Notify success + redirect
   */
  useEffect(() => {
    if (isSuccess) {
      notify.success('ویزارد با موفقیت ایجاد شد!');
      navigate('/wizard');
    }
  }, [isSuccess, navigate]);

  /**
   * Handle form submit
   */
  const handleCreateWizard = () => {
    if (!wizard.title.trim() || !wizard.context.trim()) {
      notify.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    createWizard(wizard);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        {/* Header */}
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              افزودن ویزارد جدید
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleCreateWizard}
              disabled={isLoading}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Sppiner size={8} /> : 'ذخیره'}
            </button>
            <Link
              to="/wizard"
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Title */}
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

          {/* Wizard Type */}
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

          {/* Context (Rich Text) */}
          <div className="my-2 md:my-3 h-1/2 flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <div className="min-h-0 max-h-[900px] overflow-y-auto">
              <CKEditor
                editor={ClassicEditor}
                data={wizard.context}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setWizard({ ...wizard, context: data });
                }}
                config={ckEditorConfig}
                style={{
                  direction: 'rtl',
                  textAlign: 'right',
                  overflow: 'auto',
                }}
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {isError && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error?.data?.message || 'خطا در ایجاد ویزارد'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateWizardPage;