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
  /**
   * Hook: Programmatic navigation to create/edit pages
   */
  const navigate = useNavigate();

  /**
   * Ref: Hidden file input for workflow import
   */
  const fileInputRef = useRef(null);

  /**
   * Query: Fetch all workflows
   */
  const {
    data: workflows = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllWorkflowsQuery();

  /**
   * Mutations: RTK Query auto-generated async thunks
   */
  const [exportWorkflow] = useExportWorkflowMutation();
  const [importWorkflow] = useImportWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();

  /**
   * Handler: Navigate to workflow edit page with ID validation
   */
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

  /**
   * Handler: Delete workflow with user confirmation via SweetAlert
   */
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
          await deleteWorkflow({ id: workflowId }).unwrap();
        }
      } catch (err) {
        console.error('Error in deletion process:', err);
        notify.error('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
      }
    },
    [deleteWorkflow]
  );

  /**
   * Handler: Export workflow as downloadable JSON file
   */
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

  /**
   * Handler: Trigger hidden file input for import
   */
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handler: Process selected JSON file and import workflow
   */
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

  /**
   * Render: Show loading skeleton during initial fetch
   */
  if (isLoading) {
    return <WorkflowIndexLoading />;
  }

  /**
   * Render: Show error with retry option
   */
  if (isError) {
    return <Error error={error} onRetry={refetch} variant="elevated" />;
  }

  /**
   * Render: Main layout with header, actions, and workflow table
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header: Title + action buttons (import, create) */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-xl lg:text-3xl">گردش کارها</h3>
        <div className="flex gap-2 items-center">
          <>
            {/* Hidden file input for workflow import */}
            <input
              type="file"
              accept=".json,application/json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Import button: Triggers file selection */}
            <button
              onClick={handleFileSelect}
              className="pr-4 pl-3 py-2 md:py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <span className="pl-1 hidden md:block">بارگذاری گردش کار</span>
              <span className="pl-1 md:hidden">بارگذاری</span>
              <LuUpload size={24} className="pr-2 pb-1 border-box" />
            </button>
          </>
          {/* Create new workflow button */}
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

      {/* Table container with responsive padding */}
      <div className="px-3 md:px-0 mt-3">
        {/* Empty workflows list message */}
        {workflows.length < 1 && (
          <div className="text-center mx-auto">
            <p>هیچ گردش کار ثبت شده ای یافت نشد.</p>
            <Link to={'/workflow/create'} className="underline text-blue-300">
              ثبت گردش کار جدید
            </Link>
          </div>
        )}

        {/* Main content */}
        {workflows.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
              {/* Table: Desktop view with columns for name, status, actions */}
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
                  {/* Workflow rows: One per workflow */}
                  {workflows.map((workflow) => (
                    <tr
                      key={workflow.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      {/* Workflow name column */}
                      <td className="px-4 pt-6 text-sm text-gray-900 dark:text-white line-clamp-1">
                        {workflow.name || '-'}
                      </td>
                      {/* Status column: Hardcoded as "فعال" for now */}
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          فعال
                        </span>
                      </td>
                      {/* Actions column: Desktop buttons + mobile dropdown */}
                      <td className="px-4 py-4 text-sm">
                        {/* Desktop: Inline action buttons */}
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
                        {/* Mobile: Dropdown menu with same actions */}
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
                  ))}
                </tbody>
              </table>
          </div>
        )}
      </div>
      {/* Pagination: Currently commented out (future enhancement) */}
      {/* <Pagination
        page={page}
        perpage={perpage}
        totalPages={data.pages}
        totalItems={data.total}
        handlePageChange={setPage}
      /> */}
    </div>
  );
};

export default WorkflowIndexPage;
