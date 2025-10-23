// DocumentIndex.js
import React, { useEffect, useState, useCallback } from 'react';
import DocumentCard from './DocumentCard';
import { Sppiner } from '../../ui/sppiner';
import SearchDocument from './searchDocument/SearchDocument'; // Import the separate search component
import { knowledgeApi } from '../../../store/api/knowledgeApi';
import 'react-loading-skeleton/dist/skeleton.css';
import { SkeletonLoading } from '../../../ui/loading/skeletonLoading';
import { useBreakpoint, useDisplay } from '../../../hooks/display';

const DocumentIndex = () => {
  const { data, isLoading, isSuccess, isError, error } =
    knowledgeApi.useGetAllQuery();

  const { height, isDesktop, isLargeDisplay } = useDisplay();

  if(isLoading)
    return (
      <div className="text-center">
        <SkeletonLoading rows={height / 150 - 2} cols={ !isDesktop ? 1 : (isLargeDisplay ? 3: 2)} height={150} />
      </div>
    );
};

DocumentIndex.propTypes = {};

export default DocumentIndex;
