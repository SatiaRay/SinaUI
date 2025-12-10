import { useCallback, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  useDeleteWorkflowMutation,
  useGetAllWorkflowsQuery,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
} from 'store/api/ai-features/workflowApi';
import { notify } from '../../../components/ui/toast';
import { WorkflowIndexLoading } from './WorkflowLoading';
import Error from '@components/Error';
import { GoPlusCircle } from 'react-icons/go';
import { LuUpload } from 'react-icons/lu';
import WorkflowCard from '@components/workflow/WorkflowCard';

/**
 * WorkflowIndexPage Component - Main page for displaying and managing workflows
 * @component
 * @returns {JSX.Element} Rendered workflow index page
 */
const WorkflowIndexPage = () => {
  /**
   * Hook: Programmatic navigation to create/edit pages
   */
  const navigate = useNavigate();

  /**
   * State: List of workflows for optimistic updates
   */
  const [workflows, setWorkflows] = useState(null);

  /**
   * Ref: Hidden file input for workflow import
   */
  const fileInputRef = useRef(null);

  /**
   * Query: Fetch all workflows from API
   */
  const {
    data = [],
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetAllWorkflowsQuery();

  /**
   * Store workflows from API response to state for optimistic updates
   */
  if (isSuccess && !workflows) setWorkflows(data);

  /**
   * Mutations: RTK Query auto-generated async thunks
   */
  const [exportWorkflow] = useExportWorkflowMutation();
  const [importWorkflow] = useImportWorkflowMutation();
  const [deleteWorkflow] = useDeleteWorkflowMutation();

  /**
   * Handler: Delete workflow with user confirmation via SweetAlert
   * @async
   * @function handleDelete
   * @param {string} workflowId - ID of the workflow to delete
   * @returns {Promise<void>}
   */
  const handleDelete = async (workflowId) => {
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
        // Optimistic update
        setWorkflows(workflows.filter((workflow) => workflow.id != workflowId));

        await deleteWorkflow({ id: workflowId }).unwrap();

        notify.success('گردش کاری حذف شد');
      }
    } catch (err) {
      console.error('Error in deletion process:', err);
      notify.error('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
      // Rollback on error
      setWorkflows(data);
    }
  };

  /**
   * Handler: Export workflow as downloadable JSON file
   * @async
   * @function handleDownload
   * @param {string} workflowId - ID of the workflow to export
   * @returns {Promise<void>}
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
   * @function handleFileSelect
   */
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handler: Process selected JSON file and import workflow
   * @async
   * @function handleFileChange
   * @param {React.ChangeEvent} e - File input change event
   * @returns {Promise<void>}
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
        refetch(); // Refresh the list after import
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
    [importWorkflow, refetch]
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
   * Prevent rendering workflows when data is null
   */
  if (!workflows) return null;

  /**
   * Render: Main layout with header, actions, and workflow cards grid
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Header: Title + action buttons (import, create) */}
      <div className="mx-3 md:mx-0 md:mb-6 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          گردش کارها
        </h3>
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
              className="px-4 py-3 flex items-center justify-center rounded-xl font-medium transition-all bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
            >
              <span className="ml-2 hidden md:block">بارگذاری گردش کار</span>
              <span className="ml-2 md:hidden">بارگذاری</span>
              <LuUpload size={20} />
            </button>
          </>
          {/* Create new workflow button */}
          <Link
            to={'/workflow/create'}
            className="px-4 py-3 flex items-center justify-center rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
          >
            <span className="ml-2 hidden md:block">گردش کار جدید</span>
            <span className="ml-2 md:hidden">جدید</span>
            <GoPlusCircle size={20} />
          </Link>
        </div>
      </div>

      {/* Cards container with responsive grid */}
      <div className="px-3 md:px-0 mt-6">
        {/* Empty workflows list message */}
        {workflows.length < 1 && (
          <div className="text-center mx-auto py-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                هیچ گردش کار ثبت شده‌ای یافت نشد.
              </p>
              <Link
                to={'/workflow/create'}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
              >
                <GoPlusCircle size={18} className="ml-2" />
                ثبت گردش کار جدید
              </Link>
            </div>
          </div>
        )}

        {/* Workflow cards grid - 2 cards per row on tablet, 3 on desktop */}
        {workflows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                handleDelete={handleDelete}
                handleDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowIndexPage;
