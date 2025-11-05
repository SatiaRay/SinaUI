import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const wizardApi = createApi({
    reducerPath: 'khan-wizard',
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
    tagTypes: ['Wizard'],
    endpoints: (builder) => ({
        getWizards: builder.query({
            query: ({ perpage = 10, page = 1 }) =>
                `/wizards?perpage=${perpage}&page=${page}`,
            providesTags: (result, error, arg) => {
                const items =
                    Array.isArray(result ?.wizards) ? result.wizards :
                    Array.isArray(result ?.data) ? result.data :
                    Array.isArray(result) ? result : [];

                return items.length ? [
                    ...items.map(({ id }) => ({ type: 'Wizard', id })),
                    { type: 'Wizard', page: arg.page, perpage: arg.perpage },
                    { type: 'Wizard', id: 'LIST' },
                ] : [
                    { type: 'Wizard', page: arg.page, perpage: arg.perpage },
                    { type: 'Wizard', id: 'LIST' },
                ];
            },
        }),
        getWizard: builder.query({
            query: ({ id, enableOnly = true }) =>
                `/wizards/${id}?enable_only=${enableOnly ? 'true' : 'false'}`,
            providesTags: (result, error, arg) => [{ type: 'Wizard', id: arg.id }],
        }),
        getRootWizards: builder.query({
            query: () => '/wizards/hierarchy/roots',
            providesTags: ['Wizard'],
        }),
        createWizard: builder.mutation({
            query: (data) => ({
                url: '/wizards',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (result, error, arg) => [
                'Wizard',
                { type: 'Wizard', id: 'LIST' },
                arg ?.parent_id ? { type: 'Wizard', id: arg.parent_id } : undefined,
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
        toggleStatusWizard: builder.mutation({
            query: ({ wizardId, endpoint }) => ({
                url: `/wizards/${wizardId}/${endpoint}`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Wizard', id: arg.wizardId },
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
export default wizardApi;

export const {
    useGetWizardsQuery,
    useGetWizardQuery,
    useGetRootWizardsQuery,
    useCreateWizardMutation,
    useUpdateWizardMutation,
    useToggleStatusWizardMutation,
    useDeleteWizardMutation,
} = wizardApi;