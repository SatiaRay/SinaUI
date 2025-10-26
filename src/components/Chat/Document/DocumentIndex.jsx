// DocumentIndex.js
import React, { useEffect, useState, useCallback } from 'react';
import DocumentCard from './DocumentCard';
import SearchDocument from './searchDocument/SearchDocument'; // Import the separate search component
import knowledgeApi, {
  useDeleteDocumentMutation,
} from '../../../store/api/knowledgeApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonLoading } from '../../../ui/loading/skeletonLoading';
import { Pagination } from '../../ui/pagination';
import { useDisplay } from '../../../hooks/display';
import { notify } from '../../../ui/toast';
import { confirm } from '../../ui/alert/confirmation';

const DocumentIndex = () => {
  /**
   * Response props
   */
  const { height, isDesktop, isLargeDisplay } = useDisplay();

  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);
  const perpage = 20;

  /**
   * List of documents
   */
  const [documents, setDocuments] = useState(null);

  /**
   * Fetch documents list api hook
   */
  const { data, isLoading, isSuccess, isError, error } =
    knowledgeApi.useGetAllDocumentsQuery({ page, perpage });

  /**
   * Store documents from request response data to state prop for optimistic mutation
   */
  if (isSuccess && !documents) setDocuments(data.documents);

  /**
   * Delete document api hook
   */
  const [deleteDocument, result] = useDeleteDocumentMutation();

  /**
   * Delete document handler
   * @param {number} id
   */
  const handleDeleteDocument = async (id) => {
    confirm({
      title: 'حذف سند',
      text: 'آیا از حذف این سند مطمئن هستید ؟',
      onConfirm: async () => {
        setDocuments(documents.filter((doc) => doc.id != id));

        try {
          await deleteDocument(id).unwrap();
        } catch (err) {
          notify.error('خطا در حذف سند!');
          setDocuments(data.documents);
        }
      },
    });
  };


  /**
   * Show skeleton loading
   */
  if (isLoading)
    return (
      <div className="text-center container mx-auto">
        <SkeletonLoading
          rows={height / 150}
          cols={!isLargeDisplay ? 1 : 3}
          height={110}
        />
      </div>
    );

  /**
   * Display error message when fetching fails
   */
  if (isError) return <p>مشکلی پیش آمده است 🛑</p>;

  /**
   * Prevent map documents when it is null
   */
  if (!documents) return null;

  /**
   * Display document cards list
   */
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 items-start">
        {documents.map((document) => (
          <DocumentCard
            document={document}
            handleDelete={handleDeleteDocument}
            key={document.id}
          />
        ))}
      </div>
      <Pagination
        page={page}
        perpage={perpage}
        totalPages={data.pages}
        totalItems={data.total}
        handlePageChange={setPage}
      />
    </div>
  );
};

export default DocumentIndex;
