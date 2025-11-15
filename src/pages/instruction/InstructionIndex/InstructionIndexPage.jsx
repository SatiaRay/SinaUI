// InstructionIndexPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoPlusCircle } from "react-icons/go";
import { Pagination } from '../../../components/ui/pagination';
import { confirm } from '../../../components/ui/alert/confirmation';
import { notify } from '../../../ui/toast';
import instructionApi, {
  useGetInstructionsQuery,
  useDeleteInstructionMutation,
} from '../../../store/api/instructionApi';
import { InstructionIndexLoading } from './InstructionIndexLoading';

const InstructionIndexPage = () => {
  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);
  const perpage = 20;

  /**
   * List of instructions
   */
  const [instructions, setInstructions] = useState(null);

  /**
   * Fetch instructions list api hook
   */
  const { data, isLoading, isSuccess, isError, error } =
    useGetInstructionsQuery({ page, perpage });

  /**
   * Store instructions from request response data to state prop for optimistic mutation
   */
  if (isSuccess && !instructions) setInstructions(data.instructions);

  /**
   * Delete instruction api hook
   */
  const [deleteInstruction] = useDeleteInstructionMutation();

  /**
   * Delete instruction handler
   * @param {number} id
   */
  const handleDeleteInstruction = async (id) => {
    confirm({
      title: 'حذف دستورالعمل',
      text: 'آیا از حذف این دستورالعمل مطمئن هستید؟',
      onConfirm: async () => {
        setInstructions(instructions.filter((ins) => ins.id !== id));
        try {
          await deleteInstruction(id).unwrap();
        } catch (err) {
          notify.error('خطا در حذف دستورالعمل!');
          setInstructions(data.instructions);
        }
      },
    });
  };

  /**
   * Show skeleton loading
   */
  if (isLoading)
    return <InstructionIndexLoading />;

  /**
   * Display error message when fetching fails
   */
  if (isError) return <p className='text-center'>مشکلی پیش آمده است 🛑</p>;

  /**
   * Prevent map instructions when it is null
   */
  if (!instructions) return null;

  /**
   * Display instruction cards list
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">دستورالعمل‌ها</h3>
        <Link
          to={'/instruction/create'}
          className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span>دستورالعمل جدید</span>
          <GoPlusCircle size={22} className='pr-2 box-content'/>
        </Link>
      </div>

      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-3 gap-3">
        {instructions.map((instruction) => (
          <div
            key={instruction.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col justify-between"
          >
            <div>
              <h4 className="font-semibold text-lg mb-2">{instruction.label}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {instruction.text}
              </p>
              <div className="mt-3 flex gap-3 text-sm">
                <span className="text-gray-500">
                  نوع: {
                    instruction.agent_type === 'text_agent' ? 'متن' :
                    instruction.agent_type === 'voice_agent' ? 'صوت' :
                    instruction.agent_type === 'both' ? 'همه' : '-'
                  }
                </span>
                <span className="text-gray-500">
                  وضعیت: {instruction.status == 1 ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 text-sm">
              <Link
                to={`/instruction/edit/${instruction.id}`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                ویرایش
              </Link>
              <button
                onClick={() => handleDeleteInstruction(instruction.id)}
                className="text-red-600 hover:text-red-800 dark:text-red-400"
              >
                حذف
              </button>
            </div>
          </div>
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

export default InstructionIndexPage;