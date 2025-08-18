import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { instructionEndpoints } from "../../../utils/apis";
import CustomDropdown from "../../../ui/dropdown";

const CreateInstruction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    label: "",
    text: "",
    agent_type: "both",
    status: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await instructionEndpoints.createInstruction(formData);
      navigate("/instructions");
    } catch (err) {
      setError("خطا در ایجاد دستورالعمل");
      setLoading(false);
    }
  };

  const agentTypeOptions = [
    { value: "both", label: "همه" },
    { value: "text_agent", label: "ربات متنی" },
    { value: "voice_agent", label: "ربات صوتی" },
  ];

  const statusOptions = [
    { value: 1, label: "فعال" },
    { value: 0, label: "غیرفعال" },
  ];

  return (
    <div className="p-4 max-md:pt-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">ایجاد دستورالعمل جدید</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              برچسب
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              متن
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="flex w-full gap-2">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نوع ربات
              </label>
              <CustomDropdown
                options={agentTypeOptions}
                value={formData.agent_type}
                onChange={(value) => handleChange("agent_type", value)}
                placeholder="نوع ربات را انتخاب کنید"
                className="w-full"
                parentStyle='w-full'
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                وضعیت
              </label>
              <CustomDropdown
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleChange("status", value)}
                placeholder="وضعیت را انتخاب کنید"
                className="w-full"
                parentStyle='w-full'
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => navigate("/instructions")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInstruction;