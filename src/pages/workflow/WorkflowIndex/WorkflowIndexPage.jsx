import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  useDeleteWorkflowMutation,
  useGetAllWorkflowsQuery,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
} from '../../../store/api/AiApi';
import { notify } from '../../../ui/toast';
import { WorkflowIndexLoading } from '@pages/workflow/WorkflowIndex/WorkflowLoading';
import Error from '@components/Error';
import { GoPlusCircle } from 'react-icons/go';
import { LuDownload, LuUpload } from 'react-icons/lu';
import Dropdown from '@components/ui/dropdown';
import { Edit, Trash } from 'lucide-react';

const WorkflowIndexPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [agentType, setAgentType] = useState('');

  const {
    data: workflows = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllWorkflowsQuery({ agentType });
  const [exportWorkflow] = useExportWorkflowMutation();
  const [importWorkflow] = useImportWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();

  const handleCreate = useCallback(() => {
    navigate('/workflow/create');
  }, [navigate]);

  const handleEdit = useCallback(
    (workflowId) => {
      if (!workflowId) {
        console.warn('No workflow ID provided for editing');
        return;
      }
      navigate(`/workflow/${workflowId}`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    async (workflowId) => {
      if (!workflowId) return;

      try {
        const result = await Swal.fire({
          title: 'آیا مطمئن هستید؟',
          text: 'این عمل قابل بازگشت نیست!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'انصراف',
          confirmButtonText: 'بله، حذف شود!',
          reverseButtons: false,
        });

        if (result.isConfirmed) {
          await deleteWorkflow({ id: workflowId, agentType }).unwrap();
        }
      } catch (err) {
        console.error('Error in deletion process:', err);
        notify.error('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
      }
    },
    [deleteWorkflow]
  );

  const handleDownload = useCallback(
    async (workflowId) => {
      if (!workflowId) {
        console.warn('No workflow ID provided for download');
        return;
      }

      try {
        Swal.fire({
          title: 'در حال آماده‌سازی فایل...',
          text: 'لطفا منتظر بمانید',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const data = await exportWorkflow({ id: workflowId }).unwrap();

        if (!data) {
          throw new Error('No data received from server');
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `workflow-${workflowId}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        Swal.close();
        notify.success('فایل با موفقیت دانلود شد');
      } catch (err) {
        console.error('Error downloading workflow:', err);
        Swal.close();
        notify.error('خطا در دانلود فایل');
      }
    },
    [exportWorkflow]
  );

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.name.endsWith('.json')) {
        Swal.fire({
          title: 'خطا!',
          text: 'لطفاً فقط فایل‌های JSON انتخاب کنید.',
          icon: 'error',
          confirmButtonText: 'باشه',
        });
        return;
      }

      try {
        Swal.fire({
          title: 'در حال بارگذاری...',
          text: 'لطفا منتظر بمانید',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        await importWorkflow({ file }).unwrap();

        Swal.fire({
          title: 'موفق!',
          text: 'گردش کار با موفقیت بارگذاری شد.',
          icon: 'success',
          confirmButtonText: 'باشه',
          timer: 3000,
          timerProgressBar: true,
        });

        e.target.value = '';
      } catch (err) {
        console.error('Import failed:', err);
        Swal.fire({
          title: 'خطا!',
          text: 'خطا در بارگذاری فایل',
          icon: 'error',
          confirmButtonText: 'باشه',
        });
      }
    },
    [importWorkflow]
  );

  if (isLoading) {
    return <WorkflowIndexLoading />;
  }

  if (isError) {
    return <Error error={error} onRetry={refetch} variant="elevated" />;
  }

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-xl lg:text-3xl">گردش کارها</h3>
        <div className="flex gap-2 items-center">
          <>
            <input
              type="file"
              accept=".json,application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileSelect}
              className="pr-4 pl-3 py-2 md:py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <span className="pl-1 hidden md:block">بارگذاری گردش کار</span>
              <span className="pl-1 md:hidden">بارگذاری</span>
              <LuUpload size={24} className="pr-2 pb-1 border-box" />
            </button>
          </>
          <Link
            to={'/workflow/create'}
            className="pr-4 pl-3 py-2 md:py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span className="hidden md:block">گردش کار جدید</span>
            <span className="md:hidden">جدید</span>
            <GoPlusCircle size={22} className="pr-2 box-content" />
          </Link>
        </div>
      </div>
      <div className="px-3 md:px-0 mt-3">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
              <thead className="bg-neutral-200 dark:bg-gray-700">
                <tr>
                  {['نام', 'وضعیت', 'عملیات'].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {workflows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                    >
                      هیچ گردش کاری یافت نشد
                    </td>
                  </tr>
                ) : (
                  workflows.map((workflow) => (
                    <tr
                      key={workflow.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-4 pt-6 text-sm text-gray-900 dark:text-white line-clamp-1">
                        {workflow.name || '-'}
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          فعال
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <div className="hidden lg:flex justify-center gap-4">
                          <button
                            onClick={() => handleDownload(workflow.id)}
                            className="text-green-600 text-xs border border-green-600 h-8 px-3 rounded-lg hover:bg-green-600 hover:text-white font-bold dark:text-green-400 dark:hover:text-green-200 transition-colors duration-200"
                          >
                            دریافت خروجی
                          </button>
                          <button
                            onClick={() => handleEdit(workflow.id)}
                            className="text-blue-500 hover:text-blue-700 border border-blue-500 hover:bg-blue-500 hover:text-white px-3 rounded-lg"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDelete(workflow.id)}
                            className="text-red-500 hover:text-red-700 border border-red-500 hover:bg-red-500 hover:text-white px-3 rounded-lg"
                          >
                            حذف
                          </button>
                        </div>
                        {/* Mobile: Show Operation Buttons in Dropdown  */}
                        <Dropdown label="عملیات" className="lg:hidden">
                          <Dropdown.Option
                            onClick={() => handleEdit(workflow.id)}
                          >
                            <div className="flex flex-row gap-2 items-center text-green-400">
                              <LuDownload />
                              <span>دریافت خروجی</span>
                            </div>
                          </Dropdown.Option>
                          <Dropdown.Option
                            onClick={() => handleEdit(workflow.id)}
                          >
                            <div className="flex flex-row gap-2 items-center text-blue-400">
                              <Edit size={14} />
                              <span>ویرایش</span>
                            </div>
                          </Dropdown.Option>
                          <Dropdown.Option
                            onClick={() => handleDelete(workflow.id)}
                          >
                            <div className="flex flex-row gap-2 items-center text-red-400">
                              <Trash size={14} />
                              <span>حذف</span>
                            </div>
                          </Dropdown.Option>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* <Pagination
        page={page}
        perpage={perpage}
        totalPages={data.pages}
        totalItems={data.total}
        handlePageChange={setPage}
      /> */}
    </div>

    //   {/* Desktop Table */}

    //   {/* Mobile Cards */}
    //   <div className="sm:hidden space-y-4">
    //     {workflows.length === 0 ? (
    //       <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 text-center text-gray-500 dark:text-gray-400">
    //         هیچ گردش کاری یافت نشد
    //       </div>
    //     ) : (
    //       workflows.map((workflow) => (
    //         <div
    //           key={workflow.id}
    //           className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
    //         >
    //           <div className="flex justify-between items-start mb-3">
    //             <div>
    //               <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
    //                 {workflow.name || '-'}
    //               </h3>
    //               <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
    //                 {workflow.agent_type === 'text_agent'
    //                   ? 'ربات متنی'
    //                   : workflow.agent_type === 'voice_agent'
    //                     ? 'ربات صوتی'
    //                     : workflow.agent_type === 'both'
    //                       ? 'همه'
    //                       : '-'}
    //               </p>
    //             </div>
    //             <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
    //               فعال
    //             </span>
    //           </div>

    //           <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
    //             <div className="flex gap-2">
    //               <button
    //                 onClick={() => handleEdit(workflow.id)}
    //                 className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs px-3 py-1 border border-blue-600 rounded-md"
    //               >
    //                 ویرایش
    //               </button>
    //               <button
    //                 onClick={() => handleDelete(workflow.id)}
    //                 className="text-red-500 hover:text-red-700 text-xs px-3 py-1 border border-red-500 rounded-md"
    //               >
    //                 حذف
    //               </button>
    //             </div>
    //             <button
    //               onClick={() => handleDownload(workflow.id)}
    //               className="text-green-600 text-xs border border-green-600 px-3 py-1 rounded-lg hover:bg-green-600 hover:text-white font-bold dark:text-green-400 dark:hover:text-green-200"
    //             >
    //               دریافت
    //             </button>
    //           </div>
    //         </div>
    //       ))
    //     )}
    //   </div>
    // </div>
  );
};

export default WorkflowIndexPage;
