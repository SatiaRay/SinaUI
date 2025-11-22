import React, { useState, useEffect, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notify } from '../../../ui/toast';
import { Sppiner } from '../../../components/ui/sppiner';
import {
  useGetWorkflowQuery,
  useUpdateWorkflowMutation,
} from 'store/api/ai-features/workflowApi';
import CustomDropdown from 'ui/dropdown';
import { EditWorkflowLoading } from './EditWorkflowLoading';
import WorkflowEditor from '@components/workflow/WorkflowEditor';

const EditWorkflowPage = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Destruct workflow id from url parameters
   */
  const { id } = useParams();

  /**
   * Silence update changes
   *
   * When the below state is true, success notify doesn't display after mutation request succeed
   */
  const silenceMutate = useRef(true);

  /**
   * Fetch target workflow
   */
  const { data, isLoading, isSuccess, isError } = useGetWorkflowQuery(id);

  /**
   * Workflow object state prop
   */
  const [workflow, setWorkflow] = useState(null);

  /**
   * Set workflow state after fetch succeed
   */
  useEffect(() => {
    if (isSuccess && data) setWorkflow(data);
  }, [isSuccess, data]);

  /**
   * Update workflow mutation hook
   */
  const [
    updateWorkflow,
    {
      isLoading: isUpdating,
      isSuccess: updated,
      isError: updatedFailed,
      error: updateError,
    },
  ] = useUpdateWorkflowMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (updated) {
      if (!silenceMutate.current) notify.success('تغییرات ذخیره شد !');
      silenceMutate.current = false;
    }
  }, [updated]);

  /**
   * Store workflow handler
   * @param {Array} flow optional argument. If passed, sets workflow state with passed flow and then send update request with the flow
   */
  const handleSaveWorkflow = async (flow = null) => {
    try {
      if (flow && flow == workflow.flow) return;

      const data = {
        ...workflow,
        flow: flow || workflow.flow,
      };

      await updateWorkflow({ id, data }).unwrap();

      if (flow) setWorkflow(data);
    } catch (err) {
      console.error(err);

      notify.error('خطا در ذخیره تغییرات');
      setWorkflow(data);
    }
  };

  /**
   * Display loading page on loading state
   */
  if (isLoading || !workflow) return <EditWorkflowLoading />;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-auto w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-3 md:pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              ویرایش گردش کار
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={() => handleSaveWorkflow()}
              disabled={false}
              className="px-4 py-2 flex items-center justify-center max-md:w-1/2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? <Sppiner size={8} /> : 'ذخیره'}
            </button>
            <Link
              to={'/workflow'}
              className="px-6 py-3 max-md:w-1/2 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              بازگشت
            </Link>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid lg:grid-cols-2 mb-3 gap-3">
            <div className="my-2 md:my-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نام:
              </label>
              <input
                type="text"
                className="w-full px-3 py-[6px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="نام گردش کار"
                onChange={(e) =>
                  setWorkflow({ ...workflow, name: e.target.value })
                }
                value={workflow.name}
              />
            </div>
            <div className="my-2 md:my-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                وضعیت
              </label>
              <CustomDropdown
                placeholder="وضعیت را انتخاب کنید"
                onChange={(status) => setWorkflow({ ...workflow, status })}
                options={[
                  { value: '1', label: 'فعال' },
                  { value: '0', label: 'غیرفعال' },
                ]}
                value={Number(workflow.status).toString()}
                className="w-full"
                parentStyle="w-full"
              />
            </div>
          </div>
          <WorkflowEditor
            onChange={(flow) => {
              silenceMutate.current = true;

              handleSaveWorkflow(flow);
            }}
            setSchema={(flow) => setWorkflow({ ...workflow, flow })}
            initFlow={workflow.flow}
          />
        </div>
      </div>
    </div>
  );
};

export default EditWorkflowPage;
