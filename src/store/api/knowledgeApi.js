import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the knowledge backend service using a base URL and expected endpoints
const knowledgeApi = createApi({
  reducerPath: 'khan-knowledge',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_KNOWLEDGE_SERVICE || 'http://127.0.0.1:8050',

    // 👇 Add default headers here
    prepareHeaders: (headers, { getState }) => {
      // Example: get token from Redux state (adjust to your store shape)
      const token = localStorage.getItem('khan-access-token')

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      // Optional: Add other default headers
      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    getAllDocuments: builder.query({
      query: ({perpage, page}) => `/?perpage=${perpage}&page=${page}`,
      providesTags: (result, error, arg) =>
        result
          ? [...result.documents.map(({ id }) => ({ type: 'Document', page: arg.page, perpage: arg.perpage, id })), 'Document']
          : ['Document'],
    }),
    updateDocument: builder.mutation({
      query: ({id, ...data}) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Document', id: arg.id }, 'Document'],
    })
  }),
});

export default knowledgeApi;

export const { useGetAllDocumentsQuery, useGetDocumentQuery, useUpdateDocumentMutation } = knowledgeApi;
