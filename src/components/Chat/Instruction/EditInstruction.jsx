import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instructionEndpoints } from "../../../utils/apis";
import CustomDropdown from "../../../ui/dropdown";

const EditInstruction = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    label: "",
    text: "",
    agent_type: "",
    status: 1,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchInstruction();
  }, [id]);

  const fetchInstruction = async () => {
    try {
      const data = await instructionEndpoints.getInstruction(id);
      setFormData({
        label: data.label,
        text: data.text,
        agent_type: data.agent_type || "",
        status: Number(data.status),
      });
      setLoading(false);
    } catch (err) {
      setError("خطا در دریافت اطلاعات دستورالعمل");
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "status" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await instructionEndpoints.updateInstruction(id, formData);
      navigate("/instructions");
    } catch (err) {
      setError("خطا در بروزرسانی دستورالعمل");
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">در حال بارگذاری...</div>;

  return (
    <div className="p-4 max-md:pt-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">ویرایش دستورالعمل</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              برچسب
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
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
              onChange={(e) => handleChange("text", e.target.value)}
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="w-full flex justify-center gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                نوع ربات
              </label>
              <CustomDropdown
                options={[
                  { value: "both", label: "همه" },
                  { value: "text_agent", label: "ربات متنی" },
                  { value: "voice_agent", label: "ربات صوتی" },
                ]}
                value={formData.agent_type}
                onChange={(val) => handleChange("agent_type", val)}
                placeholder="انتخاب کنید"
                className={'w-full'}
                parentStyle={'w-full'}
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                وضعیت
              </label>
              <CustomDropdown
                options={[
                  { value: 1, label: "فعال" },
                  { value: 0, label: "غیرفعال" },
                ]}
                value={formData.status}
                onChange={(val) => handleChange("status", val)}
                placeholder="انتخاب وضعیت"
                className={'w-full'}
                parentStyle={'w-full'}
              />
            </div>
          </div>


          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/instructions")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInstruction;
