// api/idpApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const idpApi = createApi({
  reducerPath: 'idp-api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_IDP_SERVICE || 'http://127.0.0.1:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Workspace', 'WorkspaceMember'],
  endpoints: () => ({}),
});

export default idpApi;