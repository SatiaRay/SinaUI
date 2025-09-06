import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { instructionEndpoints } from '../../../utils/apis';
import CustomDropdown from '../../../ui/dropdown';

const InstructionIndex = () => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    total: 0,
    pages: 0,
  });

  const [agentType, setAgentType] = useState('');

  useEffect(() => {
    fetchInstructions(pagination.page);
  }, [pagination.page, agentType]);

  const fetchInstructions = async (page) => {
    try {
      const data = await instructionEndpoints.listInstructions(agentType, page);
      setInstructions(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        pages: data.pages,
      });
      setLoading(false);
    } catch (err) {
      setError('خطا در دریافت لیست دستورالعمل‌ها');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این دستورالعمل اطمینان دارید؟')) {
      try {
        await instructionEndpoints.deleteInstruction(id);
        fetchInstructions(pagination.page);
      } catch (err) {
        setError('خطا در حذف دستورالعمل');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleCreate = () => {
    navigate('/instructions/create');
  };

  const handleEdit = (id) => {
    navigate(`/instructions/edit/${id}`);
  };

  if (loading) return <div className="p-4">در حال بارگذاری...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:pt-12 container mx-auto overflow-x-hidden">
      <div className="flex max-md:flex-col md:gap-0 gap-2 pt-6 md:pt-0 justify-between items-center mb-4">
        <h1 className="md:text-2xl dark:text-white mb-2 mt-1 md:mb-0 md:mt-0 border-r-2 pr-2 border-blue-500 text-xl font-bold max-md:w-full">
          دستورالعمل‌های بات
        </h1>
        <div className="max-md:w-full flex justify-between items-center">
          <CustomDropdown
            options={[
              { value: '', label: 'همه' },
              { value: 'text_agent', label: 'ربات متنی' },
              { value: 'voice_agent', label: 'ربات صوتی' },
            ]}
            value={agentType}
            onChange={(val) => setAgentType(val)}
            placeholder="انتخاب نوع ربات"
          />

          <button
            onClick={handleCreate}
            className="bg-blue-500 text-sm font-semibold w-1/2 hover:bg-blue-600 text-white flex items-center justify-center h-9 rounded-md mr-2"
          >
            دستور العمل جدید
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border-b border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-neutral-200 dark:bg-gray-700">
                <tr>
                  {['برچسب', 'متن', 'نوع ربات', 'وضعیت', 'عملیات'].map(
                    (item, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                      >
                        {item}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {instructions.map((instruction) => (
                  <tr key={instruction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {instruction.label}
                    </td>
                    <td className="md:px-6 p-2 md:py-4 text-sm text-gray-900 dark:text-gray-300">
                      {instruction.text}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {instruction.agent_type === 'text_agent'
                        ? 'ربات متنی'
                        : instruction.agent_type === 'voice_agent'
                          ? 'ربات صوتی'
                          : instruction.agent_type === 'both'
                            ? 'همه'
                            : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {instruction.status == 1 ? 'فعال' : 'غیرفعال'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4 rtl:space-x-reverse">
                      <button
                        onClick={() => handleEdit(instruction.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(instruction.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white shadow-lg border-t dark:bg-gray-800 p-3 flex items-center justify-between mt-4 rounded-lg">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            قبلی
          </button>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            بعدی
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              نمایش{' '}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.size + 1}
              </span>{' '}
              تا{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.size, pagination.total)}
              </span>{' '}
              از <span className="font-medium">{pagination.total}</span> نتیجه
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">قبلی</span>
                &laquo;
              </button>

              {[...Array(pagination.pages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === pagination.pages ||
                  (pageNumber >= pagination.page - 2 &&
                    pageNumber <= pagination.page + 2)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNumber === pagination.page
                          ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300'
                          : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === pagination.page - 3 ||
                  pageNumber === pagination.page + 3
                ) {
                  return (
                    <span
                      key={pageNumber}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">بعدی</span>
                &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionIndex;
