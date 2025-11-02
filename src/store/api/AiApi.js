import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const wizardApi = createApi({
  reducerPath: 'wizard',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_WIZARD_SERVICE || 'http://127.0.0.1:8090',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Wizard'],
  endpoints: (builder) => ({
    getWizards: builder.query({
      query: ({ perpage = 10, page = 1 }) => `/?perpage=${perpage}&page=${page}`, 
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.wizards.map(({ id }) => ({ type: 'Wizard', id })),
              { type: 'Wizard', page: arg.page, perpage: arg.perpage },
            ]
          : [{ type: 'Wizard', page: arg.page, perpage: arg.perpage }],
    }),
    getWizard: builder.query({
      query: ({ id }) => `/${id}`,
      providesTags: (result, error, arg) =>
        result && result.id ? [{ type: 'Wizard', id: result.id }] : [{ type: 'Wizard', id: arg.id }], 
    }),
  }),
});

export default wizardApi;

export const { useGetWizardsQuery, useGetWizardQuery } = wizardApi;