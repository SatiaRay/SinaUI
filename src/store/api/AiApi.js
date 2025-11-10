import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import WorkflowEndpoints from './endpoints/WorkflowEndpoints';

/**
 * 🔹 Base API Configuration
 * Core API instance that serves as foundation for all endpoints
 * Endpoints are injected after base API creation
 */
export const AiApi = createApi({
  reducerPath: 'khan-WorkflowAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8050',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Workflow', 'Agent'],
  endpoints: () => ({}),
});

// Inject workflow endpoints into the base API
WorkflowEndpoints(AiApi);

/**
 * 🔹 Workflow Hooks Export
 * All workflow-related hooks are exported from AiApi
 */
export const {
  useGetAllWorkflowsQuery,
  useGetWorkflowQuery,
  useStoreWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useExportWorkflowMutation,
  useImportWorkflowMutation,
} = AiApi;

export default AiApi;
