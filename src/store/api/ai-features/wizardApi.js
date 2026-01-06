import aiApi from '../aiApi';

const wizardApi = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    getWizards: builder.query({
      query: ({ perpage = 10, page = 1 }) =>
        `/wizards/?perpage=${perpage}&page=${page}`,
      providesTags: (result, error, arg) => {
        const items = Array.isArray(result?.wizards)
          ? result.wizards
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];

        return items.length
          ? [
              ...items.map(({ id }) => ({ type: 'Wizard', id })),
              { type: 'Wizard', page: arg.page, perpage: arg.perpage },
              { type: 'Wizard', id: 'LIST' },
            ]
          : [
              { type: 'Wizard', page: arg.page, perpage: arg.perpage },
              { type: 'Wizard', id: 'LIST' },
            ];
      },
    }),
    getWizard: builder.query({
      query: ({ id, enableOnly = false }) =>
        `/wizards/${id}?enable_only=${enableOnly ? 'true' : 'false'}`,
      providesTags: (result, error, arg) => [{ type: 'Wizard', id: arg.id }],
    }),
    getRootWizards: builder.query({
      query: () => '/wizards/',
      providesTags: ['Wizard'],
    }),
    createWizard: builder.mutation({
      query: (data) => ({
        url: '/wizards/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) =>
        [
          'Wizard',
          { type: 'Wizard', id: 'LIST' },
          arg?.parent_id ? { type: 'Wizard', id: arg.parent_id } : undefined,
        ].filter(Boolean),
    }),
    updateWizard: builder.mutation({
      query: ({ id, data }) => ({
        url: `/wizards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: arg.id },
        'Wizard',
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

export const {
  useGetWizardsQuery,
  useGetWizardQuery,
  useGetRootWizardsQuery,
  useCreateWizardMutation,
  useUpdateWizardMutation,
  useDeleteWizardMutation,
} = wizardApi;

export default wizardApi;
