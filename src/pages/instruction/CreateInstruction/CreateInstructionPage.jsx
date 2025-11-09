import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomDropdown from '../../../ui/dropdown';
import { notify } from '../../../ui/toast';
import { Sppiner } from '../../../components/ui/sppiner';
import { useCreateInstructionMutation } from '../../../store/api/instructionApi';
import Error from '../Error';

const CreateInstructionPage = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

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
   * Create instruction request hook
   */
  const [createInstruction, { isLoading, isSuccess, isError, error, reset }] =
    useCreateInstructionMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isSuccess) {
      notify.success('دستورالعمل با موفقیت ایجاد شد !');
      navigate('/instructions');
    }
  }, [isSuccess, navigate]);

  /**
   * Create instruction handler
   */
  const handleCreateInstruction = () => {
    createInstruction(instruction);
  };

  /**
   * Form field change handler
   */
  const handleChange = (name, value) => {
    setInstruction((prev) => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value,
    }));
  };

  const agentTypeOptions = [
    { value: 'both', label: 'همه' },
    { value: 'text_agent', label: 'ربات متنی' },
    { value: 'voice_agent', label: 'ربات صوتی' },
  ];

  const statusOptions = [
    { value: 1, label: 'فعال' },
    { value: 0, label: 'غیرفعال' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              ایجاد دستورالعمل جدید
            </h2>
          </div>

          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleCreateInstruction}
              disabled={isLoading}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 gap-2"
            >
              {isLoading ? <Sppiner size={8} /> : 'ذخیره'}
            </button>

            <Link
              to="/instructions"
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>
        {isError && (
          <div className="mb-4">
            <Error
              message={error?.data?.message}
              defaultMessage="خطایی در ایجاد دستورالعمل رخ داده است."
              reset={() => reset()}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">برچسب:</h3>
            <input
              type="text"
              value={instruction.label}
              onChange={(e) => handleChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="برچسب دستورالعمل"
            />
          </div>
          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">متن:</h3>
            <textarea
              rows={6}
              value={instruction.text}
              onChange={(e) => handleChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="متن دستورالعمل..."
            />
          </div>
          <div className="my-2 md:my-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">نوع ربات:</h3>
              <CustomDropdown
                options={agentTypeOptions}
                value={instruction.agent_type}
                onChange={(value) => handleChange('agent_type', value)}
                placeholder="نوع ربات را انتخاب کنید"
                className="w-full"
                parentStyle="w-full"
              />
            </div>
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">وضعیت:</h3>
              <CustomDropdown
                options={statusOptions}
                value={instruction.status}
                onChange={(value) => handleChange('status', value)}
                placeholder="وضعیت را انتخاب کنید"
                className="w-full"
                parentStyle="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInstructionPage;