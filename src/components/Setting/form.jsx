import React, { useState, useEffect, useRef } from 'react';
import CustomDropdown from '../../ui/dropdown';
import Tagify from '@yaireo/tagify';

/**
 * SettingsForm Component - Dynamic form for system settings
 *
 * This component renders a dynamic form based on schema configuration
 * with support for various input types and validation.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.schema - Form schema definition
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element} SettingsForm component
 */
const SettingsForm = ({ schema, initialValues = {}, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({});
  const tagifyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (schema?.properties) {
      const defaults = {};
      Object.entries(schema.properties).forEach(([key, property]) => {
        defaults[key] = initialValues[key] ?? property.default ?? '';
      });
      setFormData(defaults);
    }
  }, [initialValues, schema]);

  useEffect(() => {
    if (inputRef.current) {
      tagifyRef.current = new Tagify(inputRef.current, {
        whitelist: ['foo', 'bar', 'and baz', 0, 1, 2],
        dropdown: {
          enabled: 0,
        },
      });

      return () => {
        if (tagifyRef.current) {
          tagifyRef.current.destroy();
        }
      };
    }
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (key, property) => {
    const value = formData[key] ?? '';
    const label = property.label || property.lable || key;

    if (property.enum) {
      const options = property.enum.map((option) => ({
        value: option,
        label: option,
      }));

      return (
        <CustomDropdown
          options={options}
          value={value}
          onChange={(value) => handleChange(key, value)}
          placeholder="انتخاب کنید..."
          className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          parentStyle="w-full"
        />
      );
    }

    switch (property.type) {
      case 'string':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`${label} را وارد کنید`}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <div className="relative">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleChange(key, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${value ? 'left-7' : 'left-1'}`}
                />
              </div>
            </div>
            <span className="dark:text-gray-300 text-sm font-medium">
              {label}
            </span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`عدد ${label} را وارد کنید`}
          />
        );

      case 'array':
        return (
          <input
            ref={inputRef}
            className="tagify w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            onChange={(e) => {
              try {
                const tags = JSON.parse(e.target.value).map(
                  (item) => item.value
                );
                handleChange(key, tags);
              } catch {
                handleChange(key, []);
              }
            }}
            value={JSON.stringify(
              (value || []).map((item) => ({ value: item }))
            )}
            placeholder={`${label} را وارد کنید`}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder={`${label} را وارد کنید`}
          />
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 py-4">
      {Object.entries(schema.properties).map(([key, property]) => {
        const label = property.label || property.lable || key;
        return (
          <div key={key} className="flex flex-col gap-2">
            {property.type !== 'boolean' && (
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pr-1">
                {label}
                {schema.required?.includes(key) && (
                  <span className="text-red-500 mr-1">*</span>
                )}
              </label>
            )}
            {renderField(key, property)}
          </div>
        );
      })}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl border border-blue-500/20 mt-4"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>در حال ذخیره...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>ذخیره تنظیمات</span>
          </>
        )}
      </button>
    </form>
  );
};

export default SettingsForm;
