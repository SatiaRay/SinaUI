import React from 'react';

/**
 * Response Schema Preview Component
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.formData - Current form data
 * @returns {JSX.Element} Rendered response schema preview
 */
const ResponseSchemaPreview = ({ formData }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
        پیش‌نمایش Schema پاسخ
      </h3>
      <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700">
        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-40 sm:max-h-60">
          {formData.response_schema.example}
        </pre>
      </div>
    </div>
  );
};

export default ResponseSchemaPreview;
