// DocumentIndex.js
import React, { useEffect, useState, useCallback } from 'react';
import DocumentCard from './DocumentCard';
import { Sppiner } from '../../ui/sppiner';
import SearchDocument from './searchDocument/SearchDocument'; // Import the separate search component
import knowledgeApi from '../../../store/api/knowledgeApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonLoading } from '../../../ui/loading/skeletonLoading';
import { Pagination } from '../../ui/pagination';
import { useBreakpoint, useDisplay } from '../../../hooks/display';

const DocumentIndex = () => {
  const { height, isDesktop, isLargeDisplay } = useDisplay();

  const [page, setPage] = useState(1)
  const perpage = 20

  const { data, isLoading, isSuccess, isError, error } =
    knowledgeApi.useGetAllDocumentsQuery({ page, perpage});

  if (isLoading)
    return (
      <div className="text-center">
        <SkeletonLoading
          rows={height / 150}
          cols={!isDesktop ? 1 : isLargeDisplay ? 3 : 2}
          height={110}
        />
      </div>
    );

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 items-start">
        {data.documents.map((document) => (
          <DocumentCard document={document} key={document.id}/>
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

DocumentIndex.propTypes = {};

export default DocumentIndex;
