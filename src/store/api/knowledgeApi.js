import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the knowledge backend service using a base URL and expected endpoints
const knowledgeApi = createApi({
  reducerPath: 'khan-knowledge',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_KNOWLEDGE_SERVICE || 'http://127.0.0.1:8050',

    prepareHeaders: (headers, { getState }) => {
      // Example: get token from Redux state (adjust to your store shape)
      const token = localStorage.getItem('khan-access-token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Optional: Add other default headers
      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Document', 'VectorSearch'],
  endpoints: (builder) => ({
    vectorSearch: builder.query({
      query: (query) => `/search?query=${query}`,
      providesTags: (result, error, arg) => [{ type: 'VectorSearch', query: arg }]
    }),
    getAllDocuments: builder.query({
      query: ({ perpage, page }) => `/?perpage=${perpage}&page=${page}`,
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.documents.map(({ id }) => ({ type: 'Document', id })),
              { type: 'Document', page: arg.page, perpage: arg.perpage },
            ]
          : [{ type: 'Document', page: arg.page, perpage: arg.perpage }],
    }),
    getDocument: builder.query({
      query: ({ id }) => `/${id}`,
      providesTags: (result, error, arg) => [
        { type: 'Document', id: result.id },
      ],
    }),
    storeDocument: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Document', id: arg.id },
        'Document',
      ],
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export default knowledgeApi;

export const {
  useVectorSearchQuery,
  useGetAllDocumentsQuery,
  useGetDocumentQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useStoreDocumentMutation,
} = knowledgeApi;
