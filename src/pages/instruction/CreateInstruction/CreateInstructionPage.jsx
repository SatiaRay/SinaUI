// CreateInstructionPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../../ui/toast';
import { Sppiner } from '../../../components/ui/sppiner';
import { useCreateInstructionMutation } from 'store/api/ai-features/instructionApi';
import { FaExclamationTriangle } from 'react-icons/fa';

const CreateInstructionPage = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * State for form errors
   */
  const [formErrors, setFormErrors] = useState({
    label: '',
    text: '',
    agent_type: '',
  });

  /**
   * Instruction object state prop
   */
  const [instruction, setInstruction] = useState({
    label: '',
    text: '',
    agent_type: 'both',
    status: 1,
  });

  /**
   * Store instruction request hook
   */
  const [storeInstruction, { isLoading, isSuccess, isError, error }] =
    useCreateInstructionMutation();

  /**
   * Handle 422 validation errors
   */
  useEffect(() => {
    if (isError && error?.status === 422) {
      // Reset previous errors
      setFormErrors({ label: '', text: '', agent_type: '' });

      // Extract validation errors from response
      if (error.data?.detail) {
        const newErrors = { label: '', text: '', agent_type: '' };

        error.data.detail.forEach((err) => {
          if (err.loc && Array.isArray(err.loc)) {
            const field = err.loc[err.loc.length - 1]; // Get last item which is field name
            if (
              field === 'label' ||
              field === 'text' ||
              field === 'agent_type'
            ) {
              newErrors[field] = err.msg || 'این فیلد الزامی است';
            }
          }
        });

        setFormErrors(newErrors);
      }

      notify.error('لطفا اطلاعات فرم را بررسی کنید');
    } else if (isError) {
      console.log(error);
      notify.error(
        'افزودن دستورالعمل با خطا مواجه شد. لطفا کمی بعد تر مجددا تلاش کنید.'
      );
    }
  }, [isError, error]);

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isSuccess) {
      notify.success('دستورالعمل با موفقیت اضافه شد !');
      navigate('/instruction');
    }
  }, [isSuccess]);

  /**
   * Clear error when user starts typing in a field
   */
  const handleFieldChange = (field, value) => {
    setInstruction({ ...instruction, [field]: value });

    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: '',
      });
    }
  };

  /**
   * Store instruction handler
   */
  const handleStoreInstruction = () => {
    // Clear previous errors before submitting
    setFormErrors({ label: '', text: '', agent_type: '' });
    storeInstruction(instruction);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              افزودن دستورالعمل جدید
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleStoreInstruction}
              disabled={isLoading}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Sppiner size={8} /> : 'ذخیره'}
            </button>
            <Link
              to={'/instruction'}
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                برچسب:
              </h3>
              <input
                type="text"
                value={instruction.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
                className={`w-full px-3 pt-2 pb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  formErrors.label
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="برچسب دستورالعمل"
              />
              {formErrors.label && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <FaExclamationTriangle className="text-red-500" />
                  {formErrors.label}
                </p>
              )}
            </div>

            <div>
              <div className="w-full">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  وضعیت:
                </h3>
                <select
                  value={instruction.status}
                  onChange={(e) =>
                    handleFieldChange('status', Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value={1}>فعال</option>
                  <option value={0}>غیرفعال</option>
                </select>
              </div>
            </div>
          </div>

          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <textarea
              rows={6}
              value={instruction.text}
              onChange={(e) => handleFieldChange('text', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                formErrors.text
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="متن دستورالعمل..."
            />
            {formErrors.text && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <FaExclamationTriangle className="text-red-500" />
                {formErrors.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInstructionPage;
