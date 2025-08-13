import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workflowEndpoints } from "../../utils/apis";
import { exportWorkflow, importWorkflow } from "../../services/api";

const WorkflowIndex = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [workflows, setWorkflows] = useState([]);
  const [agentType, setAgentType] = useState("");
  const [status, setStatus] = useState({ loading: true, error: null });

  const fetchWorkflows = useCallback(async () => {
    setStatus({ loading: true, error: null });
    try {
      const data = await workflowEndpoints.listWorkflows(agentType);
      setWorkflows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching workflows:", err);
      setStatus({ loading: false, error: "خطا در دریافت لیست گردش کارها" });
      return;
    }
    setStatus({ loading: false, error: null });
  }, [agentType]);

 
  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);


  
   
  const handleCreate = () => navigate("/workflow/create");

  const handleEdit = (workflowId) => {
    if (!workflowId) return;
    navigate(`/workflow/${workflowId}`);
  };

  const handleDelete = async (workflowId) => {
    if (!workflowId) return;
    const confirmed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید این گردش کار را حذف کنید؟"
    );
    if (!confirmed) return;

    try {
      await workflowEndpoints.deleteWorkflow(workflowId);
      fetchWorkflows();
    } catch (err) {
      console.error("Error deleting workflow:", err);
      setStatus((prev) => ({ ...prev, error: "خطا در حذف گردش کار" }));
    }
  };

  
  if (status.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{status.error}</p>
      </div>
    );
  }

  const handleDownload = async (workflowId) => {
    if (!workflowId) return;
  
    try {
      const blob = await exportWorkflow(workflowId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `workflow-${workflowId}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading workflow:", err);
      setStatus((prev) => ({ ...prev, error: "خطا در دریافت خروجی" }));
    }
  };





  const handleFileSelect = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (!file.name.endsWith(".json")) {
      alert("لطفاً فقط فایل‌های JSON انتخاب کنید.");
      return;
    }
  
    try {
      const result = await importWorkflow(file);
      console.log("Import success:", result);
      setStatus((prev) => ({ ...prev, success: "بارگذاری با موفقیت انجام شد" }));
      fetchWorkflows();
    } catch (err) {
      console.error("Import failed:", err);
      setStatus((prev) => ({ ...prev, error: "خطا در بارگذاری" }));
    }
  };
  
  
  


  return (
    <div className="container mx-auto px-4 md:py-8 py-12 w-full">
      <div className="flex max-md:flex-col max-md:gap-4 justify-between items-center mb-4">
        <h1 className="md:text-2xl border-r-2 border-blue-500 pr-2  text-xl max-md:w-full font-bold text-gray-800 dark:text-white">
          گردش کارها
        </h1>
        <div className="flex items-center max-md:justify-between max-md:w-full md:gap-2 gap-1">
          <select
            className="border border-blue-500 max-md:w-1/4 dark:bg-gray-700 dark:border-gray-500 dark:text-white text-xs rounded-md px-2 h-9 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
          >
            <option value="">همه</option>
            <option value="text_agent">ربات متنی</option>
            <option value="voice_agent">ربات صوتی</option>
          </select>
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
          <button
            onClick={handleCreate}
            className="bg-blue-500 max-md:w-1/2 hover:bg-blue-600 text-white text-xs font-bold px-4 h-9 rounded-md transition-colors duration-200"
          >
            ایجاد گردش کار 
          </button>
 
        </div>
      </div>

      {/* Table */}
<div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-center">
      <thead className="bg-neutral-200 dark:bg-gray-700">
        <tr>
          {["نام", "نوع ربات", "وضعیت", "عملیات", ""].map(
            (header) => (
              <th
                key={header}
                className="px-6 py-3 text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {workflows.length === 0 ? (
          <tr>
            <td
              colSpan="5"
              className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
            >
              هیچ گردش کاری یافت نشد
            </td>
          </tr>
        ) : (
          workflows.map((workflow) => (
            <tr
              key={workflow.id}
            
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {workflow.name || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {workflow.agent_type === "text_agent"
                  ? "ربات متنی"
                  : workflow.agent_type === "voice_agent"
                  ? "ربات صوتی"
                  : workflow.agent_type === "both"
                  ? "همه"
                  : "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  فعال
                </span>
              </td>
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
