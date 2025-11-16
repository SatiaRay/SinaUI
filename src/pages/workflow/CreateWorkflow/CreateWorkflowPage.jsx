import React, { useState, useEffect } from 'react';
import { TagifyInput } from '../../../components/ui/tagifyInput';
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../../ui/toast';
import { ckEditorConfig } from '../../../configs';
import { Sppiner } from '../../../components/ui/sppiner';
import { useStoreWorkflowMutation } from 'store/api/AiApi';
import { WorkflowEditor } from '..';

const CreateWorkflowPage
 = () => {
  /**
   * Navigator
   */
  const navigate = useNavigate();

  /**
   * Workflow object state prop
   */
  const [workflow, setWorkflow] = useState({
    title: "",
    text: "",
    tag: "",
  });

  /**
   * Store workflow request hook
   */
  const [storeWorkflow, { isLoading, isSuccess, isError, error }] =
    useStoreWorkflowMutation();

  /**
   * Notify successful mutation and navigate user to index page
   */
  useEffect(() => {
    if (isSuccess) {
      notify.success('گردش کار با موفقیت اضافه شد !');
      navigate('/workflow');
    }
  }, [isSuccess]);

  /**
   * Store workflow handler
   */
  const handleStoreWorkflow = () => {
    storeWorkflow(workflow);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-full overflow-hidden w-full">
      <div className="flex-1 flex flex-col p-3 md:p-8 pt-10">
        <div className="flex justify-between md:items-center mb-4 max-md:flex-col max-md:gap-2">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-r-2 border-blue-500 pr-2 max-md:my-2">
              افزودن گردش کار جدید
            </h2>
          </div>
          <div className="flex gap-2 max-md:justify-between">
            <button
              onClick={handleStoreWorkflow}
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
          <WorkflowEditor/>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkflowPage;
