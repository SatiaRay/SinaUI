import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const wizardApi = createApi({
  reducerPath: 'wizardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8090',
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Wizard'],
  endpoints: (builder) => ({
    getRootWizards: builder.query({
      query: () => '/wizards/hierarchy/roots',
      providesTags: ['wizard'],
    }),
    getWizards: builder.query({
      query: ({ perpage = 10, page = 1 }) => ({
        url: '/wizards',
        params: { perpage, page }
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.wizards.map(({ id }) => ({ type: 'Wizard', id })),
              { type: 'Wizard', page: arg.page, perpage: arg.perpage },
            ]
          : [{ type: 'Wizard', page: arg.page, perpage: arg.perpage }],
    }),
    listWizards: builder.query({
      query: () => '/wizards',
      providesTags: ['Wizard'],
    }),
    getWizard: builder.query({
      query: ({ id, enableOnly = true }) => ({
        url: `/wizards/${id}`,
        params: { enable_only: enableOnly ? 'true' : 'false' }
      }),
      providesTags: (result, error, arg) =>
        result && result.id
          ? [{ type: 'Wizard', id: result.id }]
          : [{ type: 'Wizard', id: arg.id }],
    }),
    createWizard: builder.mutation({
      query: (wizardData) => ({
        url: '/wizards',
        method: 'POST',
        body: wizardData,
      }),
      invalidatesTags: ['Wizard'],
    }),
    updateWizard: builder.mutation({
      query: ({ id, data }) => ({
        url: `/wizards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: arg.id },
        'Wizard'
      ],
    }),
    toggleStatusWizard: builder.mutation({
      query: ({ wizardId, endpoint }) => ({
        url: `/wizards/${wizardId}/${endpoint}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: arg.wizardId },
        'Wizard'
      ],
    }),
    deleteWizard: builder.mutation({
      query: (id) => ({
        url: `/wizards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wizard'],
    }),
  }),
});

export default wizardApi;

export const {
  useGetRootWizardsQuery,
  useGetWizardsQuery,
  useListWizardsQuery,
  useGetWizardQuery,
  useCreateWizardMutation,
  useUpdateWizardMutation,
  useToggleStatusWizardMutation,
  useDeleteWizardMutation,
} = wizardApi;