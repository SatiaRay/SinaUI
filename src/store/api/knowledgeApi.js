import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the knowledge backend service using a base URL and expected endpoints
export const knowledgeApi = createApi({
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

  endpoints: (builder) => ({
    getAll: builder.query({
      query: () => `/`,
    }),
  }),
});

export const { useGetAllQuery } = knowledgeApi;
