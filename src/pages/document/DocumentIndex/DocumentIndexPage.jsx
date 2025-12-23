// DocumentIndex.js
import React, { useEffect, useState } from 'react';
import DocumentCard from '../../../components/document/DocumentCard';
import knowledgeApi, {
  useDeleteDocumentMutation,
} from '../../../store/api/knowledgeApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { Pagination } from '@components/ui/pagination';
import { notify } from '@components/ui/toast';
import { confirm } from '@components/ui/alert/confirmation';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '@components/ui/Icon';
import { DocumentIndexLoading } from './DocumentIndexLoading';
import { useDisplay } from 'hooks/display';

const DocumentIndexPage = () => {
  /**
   * Display util hook
   */
  const { isDesktop, height } = useDisplay();

  /**
   * URL Search Parameters for maintaining state
   */
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Get page from URL or default to 1
   */
  const initialPage = parseInt(searchParams.get('page')) || 1;

  /**
   * Pagination props
   */
  const [page, setPage] = useState(initialPage);

  /**
   * Update URL when page changes
   */
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  }, [page]);

  /**
   * Pagination per page length
   *
   * Define per page length according device type for fill client device
   * height free spaces for beauty and better user experience
   */
  const perpage = isDesktop ? Math.floor((height - 200) / 115) * 3 : 20;

  /**
   * List of documents
   */
  const [documents, setDocuments] = useState(null);

  /**
   * Fetch documents list api hook
   */
  const { data, isFetching, isSuccess, isError, error } =
    knowledgeApi.useGetAllDocumentsQuery({ page, perpage });

  /**
   * Store documents from request response data to state prop for optimistic mutation
   */
  useEffect(() => {
    if (isSuccess && data) setDocuments(data.documents);
  }, [isFetching, page, data]);

  /**
   * Auto scroll top on page state change
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

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
  if (isFetching) return <DocumentIndexLoading />;

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
    <div className="h-full flex flex-col justify-start md:pb-0">
      {/* Page header  */}
      <div className="mx-3 md:mx-0 md:mb-6 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          مستندات
        </h3>
        <div className="flex gap-2 items-center">
          <Link
            to={'/document/vector-search'}
            className="pr-4 pl-3 py-3 flex items-center justify-center rounded-lg font-medium transition-all bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span>جستجوری برداری</span>
            <Icon name="BezierCurve" className="w-[22px] h-[22px] pr-2 box-content" />
          </Link>
          <Link
            to={'/document/create'}
            className="px-4 py-3 flex items-center justify-center rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
          >
            <span className="ml-2 hidden md:block">سند جدید</span>
            <span className="ml-2 md:hidden">جدید</span>
            <Icon name="PlusCircle" className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Documents card list */}
      <div className="flex flex-col p-3 md:p-0 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
      <div className="pb-5 md:pb-0">
        <Pagination
          page={page}
          perpage={perpage}
          totalPages={data.pages}
          totalItems={data.total}
          handlePageChange={setPage}
        />
      </div>
    </div>
  );
};

export default DocumentIndexPage;
