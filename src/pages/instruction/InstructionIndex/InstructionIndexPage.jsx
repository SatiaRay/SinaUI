// InstructionIndexPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@components/ui/Icon';
import { Pagination } from '@components/ui/pagination';
import { confirm } from '@components/ui/alert/confirmation';
import { notify } from '@components/ui/toast';
import { InstructionIndexLoading } from './InstructionIndexLoading';
import {
  useDeleteInstructionMutation,
  useGetInstructionsQuery,
} from 'store/api/ai-features/instructionApi';
import InstructionCard from '@components/instruction/InstructionCard';

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
  if (isSuccess && !instructions) setInstructions(data.items);

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
  if (isLoading) return <InstructionIndexLoading />;

  /**
   * Display error message when fetching fails
   */
  if (isError) return <p className="text-center">مشکلی پیش آمده است 🛑</p>;

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
        <h3 className="text-xl md:text-2xl">دستورالعمل‌ها</h3>
        <Link
          to={'/instruction/create'}
          className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span className="hidden md:inline">دستورالعمل جدید</span>
          <span className="md:hidden">جدید</span>
          <Icon name="PlusCircle" size={22} className="pr-2 box-content" />
        </Link>
      </div>

      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {instructions.map((instruction) => (
          <InstructionCard
            instruction={instruction}
            handleDelete={handleDeleteInstruction}
          />
        ))}
      </div>

      {/* Empty instructions message  */}
      {instructions.length < 1 && (
        <div className="text-center mx-auto">
          <p>هیچ دستورالعملی ثبت شده ای یافت نشد.</p>
          <Link to={'/instruction/create'} className="underline text-blue-300">
            ثبت دستور جدید
          </Link>
        </div>
      )}

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
