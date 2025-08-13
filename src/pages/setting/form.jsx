import React, { useState, useEffect } from "react";

const SettingsForm = ({ schema, initialValues = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({});

  // نگاشت کلیدها به فارسی
  const labels = {
    site_name: "نام سایت",
    text_agent_model: "مدل هوش مصنوعی"
    // در صورت نیاز، بقیه کلیدها را اینجا اضافه کنید
  };

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (key, property) => {
    const value = formData[key] ?? "";

    if (property.enum) {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(key, e.target.value)}
          className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">انتخاب کنید...</option>
          {property.enum.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    switch (property.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={`${labels[key] || key} را وارد کنید`}
          />
        );

      case "boolean":
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => handleChange(key, e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="dark:text-gray-300">{labels[key] || key}</span>
          </label>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={`عدد ${labels[key] || key} را وارد کنید`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder={`${labels[key] || key} را وارد کنید`}
          />
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      {Object.entries(schema.properties).map(([key, property]) => (
        <div key={key} className="flex flex-col">
          {property.type !== "boolean" && (
            <label className="mb-1 pr-1 dark:text-gray-300">
              {labels[key] || key}{" "}
              {schema.required?.includes(key) && <span className="text-red-500">*</span>}
            </label>
          )}
          {renderField(key, property)}
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 p-2 rounded-lg bg-gray-800 text-white hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-gray-600 transition-colors"
      >
        {isLoading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
      </button>
    </form>
  );
};

export default SettingsForm;
