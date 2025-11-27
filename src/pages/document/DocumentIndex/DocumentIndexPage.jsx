// DocumentIndex.js
import React, { useEffect, useState } from 'react';
import DocumentCard from '../../../components/document/DocumentCard';
import knowledgeApi, {
  useDeleteDocumentMutation,
} from '../../../store/api/knowledgeApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { Pagination } from '../../../components/ui/pagination';
import { notify } from '../../../components/ui/toast';
import { confirm } from '../../../components/ui/alert/confirmation';
import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { DocumentIndexLoading } from './DocumentIndexLoading';
import { useDisplay } from 'hooks/display';

const DocumentIndexPage = () => {
  /**
   * Display util hook
   */
  const { isDesktop, height } = useDisplay();

  /**
   * Pagination props
   */
  const [page, setPage] = useState(1);

  /**
   * Pagination per page length
   * 
   * Define perpage length according device type for fill client device 
   * height freee spaces for beauty and better user experince
   */
  const perpage = isDesktop ? ((Math.floor(((height - 200) / 115)) * 3)) : 20;

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
  useEffect(() => {
    if (isSuccess && data) setDocuments(data.documents);
  }, [isLoading, page, data]);

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
  if (isLoading) return <DocumentIndexLoading />;

  /**
   * Display error message when fetching fails
   */
  if (isError) <p className="text-center">مشکلی پیش آمده است 🛑</p>;

  /**
   * Prevent map documents when it is null
   */
  if (!documents) return null;

  /**
   * Display document cards list
   */
  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* Page header  */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-3xl">مستندات</h3>
        <Link
          to={'/document/create'}
          className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <span>سند جدید</span>
          <GoPlusCircle size={22} className="pr-2 box-content" />
        </Link>
      </div>

      {/* Documents card list */}
      <div className="flex flex-col p-3 md:p-0 md:grid grid-cols-1 lg:grid-cols-3 gap-3">
        {documents.map((document) => (
          <DocumentCard
            document={document}
            handleDelete={handleDeleteDocument}
            key={document.id}
          />
        ))}
      </div>

      {/* Empty documents message  */}
      {documents.length < 1 && (
        <div className="text-center mx-auto">
          <p>هیچ سند ثبت شده ای یافت نشد.</p>
          <Link to={'/document/create'} className="underline text-blue-300">
            ثبت سند جدید
          </Link>
        </div>
      )}

      {/* Pagination  */}
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

export default DocumentIndexPage;
