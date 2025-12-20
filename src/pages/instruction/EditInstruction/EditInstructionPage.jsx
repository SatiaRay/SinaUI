// EditInstructionPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notify } from '@components/ui/toast';
import {
  useGetInstructionQuery,
  useUpdateInstructionMutation,
} from 'store/api/ai-features/instructionApi';
import { EditInstructionLoading } from './EditInstructionLoading';
import { Sppiner } from '@components/ui/sppiner';

const EditInstructionPage = () => {
  /**
   * Distruct instruction_id from uri
   */
  const { id } = useParams();

  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Fetching Instruction data using RTK Query hook
   */
  const { data, isSuccess, isLoading, isError } = useGetInstructionQuery({
    id,
  });

  /**
   * Instruction object state prop
   */
  const [instruction, setInstruction] = useState(null);

  useEffect(() => {
    if (isSuccess && data)
      setInstruction({
        label: data.label || '',
        text: data.text || '',
        status: Number(data.status ?? 1),
      });
  }, [isSuccess, data]);

  /**
   * Update instruction request hook
   */
  const [
    updateInstruction,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSucceed,
      isError: isUpdateFailed,
    },
  ] = useUpdateInstructionMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isUpdateSucceed) {
      notify.success('دستورالعمل با موفقیت ویرایش شد !');
      navigate('/instruction');
    }
  }, [isUpdateSucceed]);

  /**
   * Notify failure mutation
   */
  useEffect(() => {
    if (isUpdateFailed)
      notify.error(
        'ویرایش دستورالعمل با خطا مواجه شد. لطفا کمی بعد تر مجددا تلاش کنید.'
      );
  }, [isUpdateFailed]);

  /**
   * Update instruction handler
   */
  const handleUpdateInstruction = () => {
    updateInstruction({ id, data: instruction });
  };

  /**
   * Display loading page on loading state
   */
  if (isLoading || !instruction) return <EditInstructionLoading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              ویرایش دستورالعمل
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleUpdateInstruction}
              disabled={false}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating ? <Sppiner size={8} /> : 'ذخیره'}
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
                onChange={(e) =>
                  setInstruction({ ...instruction, label: e.target.value })
                }
                className="w-full px-3 pt-2 pb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="برچسب دستورالعمل"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                وضعیت:
              </h3>
              <select
                value={instruction.status}
                onChange={(e) =>
                  setInstruction({
                    ...instruction,
                    status: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={1}>فعال</option>
                <option value={0}>غیرفعال</option>
              </select>
            </div>
          </div>

          <div className="my-2 md:my-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              متن:
            </h3>
            <textarea
              rows={6}
              value={instruction.text}
              onChange={(e) =>
                setInstruction({ ...instruction, text: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="متن دستورالعمل..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInstructionPage;
