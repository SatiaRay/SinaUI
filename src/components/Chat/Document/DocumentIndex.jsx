// DocumentIndex.js
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useParams } from 'react-router-dom';
import { documentEndpoints } from '../../../utils/apis';
import DocumentCard from './DocumentCard';
import CreateDocument from './CreateDocument';
import CustomDropdown from '../../../ui/dropdown';
import { notify } from '../../../ui/toast';
import SearchDocument from './searchDocument/SearchDocument'; // Import the separate search component
import { knowledgeApi } from '../../../store/api/knowledgeApi';

const DocumentIndex = () => {
  const { data, isLoading, isSuccess, isError, error } =
    knowledgeApi.useGetAllQuery();

  const [state, setState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
    showAddKnowledge: false,
  });

  const location = useLocation();

  const PAGE_SIZE_OPTIONS = [20, 50, 100];

  const handlePageChange = (newPage) => {
    setState((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setState((prev) => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
  };

  const handleDelete = async (documentId) => {
    //
  };

  const handleStatusChange = async (documentId, newVectorId) => {
    //
  };

  const handleAddKnowledge = () => {
    setState((prev) => ({ ...prev, showAddKnowledge: true }));
  };

  const handleCloseAddKnowledge = (newAgentType) => {
    setState((prev) => {
      const updated = {
        ...prev,
        showAddKnowledge: false,
        agentType: newAgentType || prev.agentType,
        currentPage: 1,
      };
      return updated;
    });
  };

  const renderContent = () => {
    // if (state.isLoading && !state.documents.length) {
    //   return <div className="text-center">در حال بارگذاری اسناد...</div>;
    // }

    // if (state.error) {
    //   return <div className="text-red-500 text-center">خطا: {state.error}</div>;
    // }

    // if (!state.filteredDocuments.length && state.searchQuery) {
    //   return (
    //     <div className="text-center">
    //       هیچ سندی با عنوان "{state.searchQuery}" یافت نشد.
    //     </div>
    //   );
    // }

    // if (!state.filteredDocuments.length) {
    //   return <div className="text-center">هیچ سندی یافت نشد.</div>;
    // }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {data.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onStatusChange={handleStatusChange}
            onClick={() => {}}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    );

    return <h1>Listing Documents</h1>;
  };

  const renderPagination = () => {
    if (state.totalItems <= Math.min(...PAGE_SIZE_OPTIONS)) return null;

    return (
      <div className="flex flex-col sm:flex-row justify-center items-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-600">
            تعداد آیتم در هر صفحه:
          </label>
          <select
            id="pageSize"
            value={state.pageSize}
            onChange={handlePageSizeChange}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(state.currentPage - 1)}
            disabled={state.currentPage === 1}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:border-gray-600 ${
              state.currentPage === 1
                ? 'dark:text-gray-600 text-gray-400'
                : 'dark:text-white text-black'
            }`}
          >
            قبلی
          </button>
          <span className="mx-4">
            صفحه {state.currentPage} از {state.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(state.currentPage + 1)}
            disabled={state.currentPage === state.totalPages}
            className={`px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:border-gray-600 ${
              state.currentPage === state.totalPages
                ? 'dark:text-gray-600 text-gray-400'
                : 'dark:text-white text-black'
            }`}
          >
            بعدی
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="document-index pb-20">
      <div className="flex flex-col md:flex-row justify-between mb-3 gap-4">
        {location.pathname.includes('/domain/') && (
          <Link
            to="/document/domains"
            className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-300 text-center md:text-right"
          >
            بازگشت
          </Link>
        )}
        <SearchDocument
          documents={state.documents}
          onSearchResults={() => {}}
          searchQuery={state.searchQuery}
          onSearchChange={() => {}}
          placeholder="جستجو در عنوان اسناد..."
        />
        <>
          <button
            onClick={handleAddKnowledge}
            className="px-6 py-3 rounded-lg font-medium transition-all bg-green-500 text-white hover:bg-green-600"
          >
            افزودن دانش
          </button>

          <CustomDropdown
            options={[
              { value: '', label: 'همه' },
              { value: 'both', label: 'هردو' },
              { value: 'text_agent', label: 'ربات متنی' },
              { value: 'voice_agent', label: 'ربات صوتی' },
            ]}
            value={state.agentType}
            onChange={(val) =>
              setState((prev) => ({ ...prev, agentType: val }))
            }
            placeholder="انتخاب نوع ربات"
          />
        </>
      </div>

      {isLoading ? (
        <h1 className='text-center my-3'>Loading ....</h1>
      ) : (
        <>
          {renderContent()}
          {renderPagination()}
        </>
      )}

      {state.showAddKnowledge && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex justify-center items-center"
          onClick={handleCloseAddKnowledge}
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-3xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <CreateDocument onClose={handleCloseAddKnowledge} />
          </div>
        </div>
      )}

      {state.documentContentLoading && (
        <div className="text-center">در حال بارگذاری محتوای سند...</div>
      )}

      {state.selectedDocument && state.documentContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  selectedDocument: null,
                  documentContent: null,
                }))
              }
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {state.selectedDocument.name}
            </h3>
            <div className="prose max-w-none">
              {typeof state.documentContent === 'object' ? (
                <pre>{JSON.stringify(state.documentContent, null, 2)}</pre>
              ) : (
                <p>{state.documentContent}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

DocumentIndex.propTypes = {};

export default DocumentIndex;
