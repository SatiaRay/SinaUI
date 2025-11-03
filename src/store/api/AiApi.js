import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const wizardApi = createApi({
  reducerPath: 'wizard',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8090',
    prepareHeaders: (headers, { getState }) => {
      const token =
        process.env.REACT_APP_WIDGET_ACCESS_TOKEN ||
        localStorage.getItem('khan-access-token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Wizard'],
  endpoints: (builder) => ({
    getWizards: builder.query({
      query: ({ perpage = 10, page = 1 }) =>
        `/?perpage=${perpage}&page=${page}`,
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
        result && result.id
          ? [{ type: 'Wizard', id: result.id }]
          : [{ type: 'Wizard', id: arg.id }],
    }),
    createWizard: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Wizard', page: 1, perpage: 20 }],
    }),
    updateWizard: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: arg.id },
        { type: 'Wizard', page: 1, perpage: 20 },
      ],
    }),
    deleteWizard: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wizard', page: 1, perpage: 20 }],
    }),
  }),
});

export default wizardApi;
export const {
  useGetWizardsQuery,
  useGetWizardQuery,
  useCreateWizardMutation,
  useUpdateWizardMutation,
  useDeleteWizardMutation,
} = wizardApi;
