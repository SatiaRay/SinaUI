"use client";
import React from 'react';
import { useGetWizardQuery } from '../../../store/api/AiApi';
import ShowWizardLoading from './ShowWizardLoading';

/**
 * ShowWizardPage component for displaying wizard details.
 */
const ShowWizardPage = ({ wizard, onWizardSelect }) => {
  /**
   * Fetch wizard data by ID 
   */
  const { data, isLoading, isError, error } = useGetWizardQuery(
    { id: wizard?.id, enableOnly: true },
    { skip: !wizard?.id }
  );

  /**
   * Handle navigation back to parent wizard
   */
  const handleBackClick = () => {
    if (data?.parent_id) {
      onWizardSelect({ id: data.parent_id });
    } else {
      onWizardSelect(null);
    }
  };

  /**
   * Handle navigation to a selected child wizard
   */
  const handleChildClick = (childWizard) => {
    onWizardSelect(childWizard);
  };

  /**
   * Display loading page on loading state
   */
  if (isLoading || !data) return <ShowWizardLoading />;

  /**
   * Show error state if the query fails
   */
  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-500 dark:text-red-400">
          {error?.data?.message || 'Error fetching wizard'}
        </p>
        <button
          onClick={() => onWizardSelect(wizard)}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  /**
   * Handle empty wizard data
   */
  if (!data) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
        No wizard found
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h2 className="text-xl dark:text-white font-semibold text-gray-800">
          {data.title}
        </h2>
        <div className="flex gap-x-2">
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div
          className="prose dark:prose-invert max-w-none text-gray-800 dark:text-white [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-700 dark:[&_a]:text-blue-400 dark:[&_a]:hover:text-blue-300 [&_span.katex]:text-current"
          dangerouslySetInnerHTML={{ __html: data.context || '' }}
        />
      </div>

      {Array.isArray(data.children) && data.children.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Child Wizards
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.children.map((child) => (
                  <tr
                    key={child.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleChildClick(child)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {child.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {child.created_at
                        ? new Date(child.created_at).toLocaleString('fa-IR')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          child.enabled
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {child.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowWizardPage;
