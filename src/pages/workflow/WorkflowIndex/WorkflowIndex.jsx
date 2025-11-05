// WorkflowIndex.jsx

/**
 * Workflow Index Component
 * Main component for displaying, managing, and interacting with workflows
 * Provides functionality to view, create, edit, delete, export, and import workflows
 */
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  useDeleteWorkflowMutation,
  useGetAllWorkflowsQuery,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
} from '../../../store/api/workflowApi';
import CustomDropdown from '../../../ui/dropdown';
import { notify } from '../../../ui/toast';
import { WorkflowIndexLoading } from '@pages/workflow/WorkflowIndex/WorkflowLoading';
import WorkflowError from '@pages/workflow/WorkflowError/WorkflowError';

const WorkflowIndex = () => {
  /**
   * Component State and Refs
   */
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [agentType, setAgentType] = useState('');

  /**
   * RTK Query Hooks for API Operations
   */
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

  /**
   * Handles workflow creation navigation
   * Navigates to the workflow creation page
   */
  const handleCreate = useCallback(() => {
    navigate('/workflow/create');
  }, [navigate]);

  /**
   * Handles workflow editing navigation
   * @param {number} workflowId - The ID of the workflow to edit
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
   * Handles workflow deletion with confirmation and error handling
   * Uses optimistic updates - workflow is immediately removed from UI
   * If server returns error, UI automatically rolls back and shows error notification
   * @param {number} workflowId - The ID of the workflow to delete
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
          await deleteWorkflow({ id: workflowId, agentType }).unwrap();
        }
      } catch (err) {
        console.error('Error in deletion process:', err);
        notify.error('خطا در حذف گردش کار! لطفاً دوباره تلاش کنید');
      }
    },
    [deleteWorkflow]
  );
  /**
   * Handles workflow export/download
   * @param {number} workflowId - The ID of the workflow to export
   */
  const handleDownload = useCallback(
    async (workflowId) => {
      if (!workflowId) {
        console.warn('No workflow ID provided for download');
        return;
      }

      try {
        // Show loading indicator
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

        // Create and trigger download
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

        // Close loading indicator and show success notification
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
   * Triggers file input click for import
   */
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handles workflow import from JSON file
   * @param {Event} e - File input change event
   */
  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
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
        // Show loading indicator
        Swal.fire({
          title: 'در حال بارگذاری...',
          text: 'لطفا منتظر بمانید',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Execute import operation
        await importWorkflow({ file }).unwrap();

        // Success notification
        Swal.fire({
          title: 'موفق!',
          text: 'گردش کار با موفقیت بارگذاری شد.',
          icon: 'success',
          confirmButtonText: 'باشه',
          timer: 3000,
          timerProgressBar: true,
        });

        // Reset file input
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
   * Renders loading state
   */
  if (isLoading) {
    return <WorkflowIndexLoading />;
  }

  /**
   * Renders error state
   */
  if (isError) {
    return <WorkflowError error={error} onRetry={refetch} />;
  }

  /**
   * Main component render
   */
  return (
    <div className="container mx-auto px-4 py-12 w-full">
      {/* Header Section with Filters and Actions */}
      <div className="flex max-md:flex-col max-md:gap-4 justify-between items-center mb-4">
        <h1 className="md:text-2xl border-r-2 border-blue-500 pr-2 text-xl max-md:w-full font-bold text-gray-800 dark:text-white">
          گردش کارها
        </h1>

        {/* Action Buttons and Filters */}
        <div className="flex items-center max-md:justify-between max-md:w-full md:gap-2 gap-1">
          {/* Agent Type Filter Dropdown */}
          <CustomDropdown
            options={[
              { value: '', label: 'همه' },
              { value: 'text_agent', label: 'ربات متنی' },
              { value: 'voice_agent', label: 'ربات صوتی' },
            ]}
            value={agentType}
            onChange={(val) => setAgentType(val)}
            placeholder="انتخاب نوع ربات"
            className="max-md:w-1/4"
          />

          {/* File Import Section */}
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
              className="border max-md:w-1/2 text-blue-500 border-blue-500 text-xs font-bold hover:bg-blue-500 hover:text-white h-9 px-4 rounded-md transition-colors duration-200"
            >
              بارگذاری گردش کار
            </button>
          </>

          {/* Create Workflow Button */}
          <button
            onClick={handleCreate}
            className="bg-blue-500 max-md:w-1/2 hover:bg-blue-600 text-white text-xs font-bold px-4 h-9 rounded-md transition-colors duration-200"
          >
            ایجاد گردش کار
          </button>
        </div>
      </div>

      {/* Workflows Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
            {/* Table Header */}
            <thead className="bg-neutral-200 dark:bg-gray-700">
              <tr>
                {['نام', 'نوع ربات', 'وضعیت', 'عملیات', ''].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {workflows.length === 0 ? (
                // Empty state
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    هیچ گردش کاری یافت نشد
                  </td>
                </tr>
              ) : (
                // Workflows list
                workflows.map((workflow) => (
                  <tr key={workflow.id}>
                    {/* Workflow Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {workflow.name || '-'}
                    </td>

                    {/* Agent Type */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {workflow.agent_type === 'text_agent'
                        ? 'ربات متنی'
                        : workflow.agent_type === 'voice_agent'
                          ? 'ربات صوتی'
                          : workflow.agent_type === 'both'
                            ? 'همه'
                            : '-'}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        فعال
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(workflow.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mx-2"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDelete(workflow.id)}
                        className="text-red-500 hover:text-red-700 mx-2"
                      >
                        حذف
                      </button>
                    </td>

                    {/* Export Button */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDownload(workflow.id)}
                        className="text-green-600 text-xs border border-green-600 h-8 px-2 rounded-lg hover:bg-green-600 hover:text-white font-bold dark:text-green-400 dark:hover:text-green-200"
                      >
                        دریافت خروجی
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkflowIndex;
