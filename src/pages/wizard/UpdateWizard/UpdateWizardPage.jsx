import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomDropdown from '../../../ui/dropdown';
import { useUpdateWizardMutation } from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import UpdateWizardLoading from './UpdateWizardLoading';
import WizardError from '../WizardError'; 

/**
 * Show skeleton only on first fetch
 */
let __UPDATE_WIZARD_FIRST_FETCH_DONE__ = false;

/**
 * UpdateWizard component
 */
const UpdateWizardPage = ({ wizard, onClose, onWizardUpdated }) => {
  /**
   * Wizard object state prop
   */
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [wizardType, setWizardType] = useState('answer');

  /**
   * Update wizard request hook
   */
  const [updateWizard, { isLoading, isError, error, reset }] =
    useUpdateWizardMutation();

  /**
   * Fill form with wizard data on mount
   */
  useEffect(() => {
    if (wizard) {
      setTitle(wizard.title || '');
      setContext(wizard.context || '');
      setWizardType(wizard.wizard_type || 'answer');
    }
  }, [wizard]);

  /**
   * Skeleton delay
   */
  const [showSkeleton, setShowSkeleton] = useState(
    !__UPDATE_WIZARD_FIRST_FETCH_DONE__
  );
  const hasEverLoadedRef = useRef(__UPDATE_WIZARD_FIRST_FETCH_DONE__);

  useEffect(() => {
    if (!hasEverLoadedRef.current) {
      if (!wizard || !wizard.title) {
        setShowSkeleton(true);
        return;
      }
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        hasEverLoadedRef.current = true;
        __UPDATE_WIZARD_FIRST_FETCH_DONE__ = true;
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [wizard]);

  /**
   * Update wizard handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      notify.error('لطفا عنوان را پر کنید');
      return;
    }

    /**
     * Update wizard constructor
     */
    const wizardData = {
      title,
      context,
      wizard_type: wizardType,
    };

    try {
      const updatedWizard = await updateWizard({
        id: wizard.id,
        data: wizardData,
      }).unwrap();
      if (onWizardUpdated) {
        onWizardUpdated(updatedWizard);
      }
      onClose();
      notify.success('ویزارد با موفقیت ویرایش شد');
    } catch (err) {
      notify.error(err.data?.message || 'خطا در بروزرسانی ویزارد');
      console.error('Error updating wizard:', err);
    }
  };

  /**
   * Display skeleton only on first fetch
   */
  if (showSkeleton && !hasEverLoadedRef.current) {
    return (
      <div className="transition-opacity duration-500 opacity-100">
        <UpdateWizardLoading />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          ویرایش ویزارد
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            عنوان ویزارد
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="wizard_type"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            نوع ویزارد
          </label>
          <CustomDropdown
            options={[
              { value: 'answer', label: 'جواب' },
              { value: 'question', label: 'سوال' },
            ]}
            value={wizardType}
            onChange={setWizardType}
            placeholder="انتخاب نوع ویزارد"
            className="w-full"
            parentStyle="w-full"
          />
        </div>

        <div>
          <label
            htmlFor="context"
            className="block text.sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            متن ویزارد
          </label>
          <div className="h-[calc(100%-8rem)]">
            <CKEditor
              editor={ClassicEditor}
              data={context}
              onChange={(event, editor) => setContext(editor.getData())}
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
              style={{ direction: 'rtl', textAlign: 'right' }}
            />
          </div>
        </div>

        {isError && (
          <div className="p-2">
            <WizardError
              message={error?.data?.message}
              defaultMessage="خطا در بروزرسانی ویزارد"
              reset={() => reset()}
            />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                در حال بروزرسانی...
              </>
            ) : (
              'بروزرسانی ویزارد'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateWizardPage;
