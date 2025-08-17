// DocumentIndex.js
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getDocuments, getDomainDocuments } from '../../../services/api';
import { documentEndpoints } from '../../../utils/apis';
import DocumentCard from './DocumentCard';
import CreateDocument from './CreateDocument';
import CustomDropdown from '../../../ui/dropdown';


const DocumentIndex = () => {
  const [state, setState] = useState({
    isLoading: false,
    documentContentLoading: false,
    error: null,
    documentContent: null,
    selectedDocument: null,
    documents: [],
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
    showAddKnowledge: false,
    agentType: 'both' || 'voice_agent' || 'text_agent'  ,
  });

  const location = useLocation();
  const { domain_id } = useParams();

  const PAGE_SIZE_OPTIONS = [20, 50, 100];
  const isManualRoute = location.pathname.endsWith('/manuals');

  const fetchDocuments = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = isManualRoute
        ? await getDocuments(
            true,
            state.agentType === 'text_agent' ? 'text_agent' : state.agentType || 'both',
            state.currentPage,
            state.pageSize
          )
        : await getDomainDocuments(domain_id, state.currentPage, state.pageSize);

      if (response?.data) {
        setState(prev => ({
          ...prev,
          documents: response.data.items,
          totalPages: response.data.pages,
          totalItems: response.data.total,
          isLoading: false,
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.message || 'دریافت اسناد با خطا مواجه شد',
        isLoading: false,
      }));
      console.error('Document fetch error:', err);
    }
  }, [isManualRoute, state.agentType, state.currentPage, state.pageSize, domain_id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const fetchDocumentContent = async (document) => {
    try {
      setState(prev => ({ 
        ...prev, 
        documentContentLoading: true, 
        error: null, 
        selectedDocument: document 
      }));

      const response = await fetch(
        `${process.env.REACT_APP_CHAT_API_URL}/documents/${document.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('دریافت محتوای سند ناموفق بود');

      const data = await response.json();
      setState(prev => ({ 
        ...prev, 
        documentContent: data,
        documentContentLoading: false 
      }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err.message,
        documentContentLoading: false 
      }));
      console.error('Document content fetch error:', err);
    }
  };

  const handlePageChange = (newPage) => {
    setState(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setState(prev => ({
      ...prev,
      pageSize: newSize,
      currentPage: 1,
    }));
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('آیا مطمئن هستید که می‌خواهید این سند را حذف کنید؟')) return;

    try {
      await documentEndpoints.deleteDocument(documentId);
      setState(prev => ({
        ...prev,
        documents: prev.documents.filter(doc => doc.id !== documentId),
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: `حذف ناموفق بود: ${err.message || 'خطای ناشناخته'}`,
      }));
      console.error('Document deletion error:', err);
    }
  };

  const handleStatusChange = async (documentId, newVectorId) => {
    try {
      setState(prev => ({
        ...prev,
        documents: prev.documents.map(doc =>
          doc.id === documentId ? { ...doc, vector_id: newVectorId } : doc
        ),
      }));
      await fetchDocuments();
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: err.message || 'به‌روزرسانی وضعیت ناموفق بود' 
      }));
    }
  };

  const handleAddKnowledge = () => {
    setState(prev => ({ ...prev, showAddKnowledge: true }));
  };

  const handleCloseAddKnowledge = () => {
    setState(prev => ({ ...prev, showAddKnowledge: false }));
    fetchDocuments();
  };

  const renderContent = () => {
    if (state.isLoading && !state.documents.length) {
      return <div className="text-center">در حال بارگذاری اسناد...</div>;
    }

    if (state.error) {
      return <div className="text-red-500 text-center">خطا: {state.error}</div>;
    }

    if (!state.documents.length) {
      return <div className="text-center">هیچ سندی یافت نشد.</div>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {state.documents.map(document => (
          <DocumentCard
            key={document.id}
            document={document}
            onStatusChange={handleStatusChange}
            onClick={() => fetchDocumentContent(document)}
            onDelete={handleDelete}
          />
        ))}
      </div>
    );
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
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
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
            className={`px-4 py-2 rounded-lg ${
              state.currentPage === 1
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
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
            className={`px-4 py-2 rounded-lg ${
              state.currentPage === state.totalPages
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            بعدی
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="document-index">
      <div className="flex justify-between mb-3">
        {location.pathname.includes('/domain/') && (
          <Link
            to="/document/domains"
            className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-300"
          >
            بازگشت
          </Link>
        )}

        {isManualRoute && (
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
    { value: 'text_agent', label: 'ربات متنی' },
    { value: 'voice_agent', label: 'ربات صوتی' },
  ]}
  value={state.agentType}
  onChange={(val) => setState(prev => ({ ...prev, agentType: val }))}
  placeholder="انتخاب نوع ربات"
/>

          </>
        )}
      </div>

      {renderContent()}
      {renderPagination()}

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
              onClick={() => setState(prev => ({ ...prev, selectedDocument: null, documentContent: null }))}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">{state.selectedDocument.name}</h3>
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
