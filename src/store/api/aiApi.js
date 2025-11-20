import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const aiApi = createApi({
  reducerPath: 'ai-api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8090',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Wizard', 'Instruction'],
  endpoints: () => ({}),
});

export default aiApi;