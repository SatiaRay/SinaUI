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
      providesTags: ['Wizard'],
    }),

    getWizards: builder.query({
      query: ({ perpage = 10, page = 1 }) => ({
        url: '/wizards',
        params: { perpage, page },
      }),
      providesTags: (result, error, arg) => {
        const items =
          Array.isArray(result?.wizards) ? result.wizards
          : Array.isArray(result?.data) ? result.data
          : Array.isArray(result) ? result
          : [];

        return items.length
          ? [
              ...items.map(({ id }) => ({ type: 'Wizard', id: Number(id) })),
              { type: 'Wizard', page: arg.page, perpage: arg.perpage },
            ]
          : [{ type: 'Wizard', page: arg.page, perpage: arg.perpage }];
      },
    }),

    listWizards: builder.query({
      query: () => '/wizards',
      providesTags: (result) => {
        const items =
          Array.isArray(result?.wizards) ? result.wizards
          : Array.isArray(result?.data) ? result.data
          : Array.isArray(result) ? result
          : [];
        return items.length
          ? [
              ...items.map(({ id }) => ({ type: 'Wizard', id: Number(id) })),
              { type: 'Wizard', id: 'LIST' }
            ]
          : [{ type: 'Wizard', id: 'LIST' }];
      },
    }),

    getWizard: builder.query({
      query: ({ id, enableOnly = true }) => ({
        url: `/wizards/${id}`,
        params: { enable_only: enableOnly ? 'true' : 'false' }
      }),
      providesTags: (result, error, arg) => [
        { type: 'Wizard', id: Number(result?.id ?? arg.id) }
      ],
    }),

    createWizard: builder.mutation({
      query: (wizardData) => ({
        url: '/wizards',
        method: 'POST',
        body: wizardData,
      }),
      // نمایش فوری: هم برای والد، هم برای ریشه‌ها
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: created } = await queryFulfilled;
          const newItem = created?.wizard ?? created;
          if (!newItem) return;

          const parentId = arg?.parent_id;

          if (parentId == null) {
            // ریشه: لیست‌های بدون آرگومان را فوراً آپدیت کن
            dispatch(
              wizardApi.util.updateQueryData(
                'listWizards',
                undefined,
                (draft) => {
                  // draft می‌تواند آرایه یا آبجکت باشه (با فیلد data/wizards)
                  const list = Array.isArray(draft?.wizards) ? draft.wizards
                    : Array.isArray(draft?.data) ? draft.data
                    : Array.isArray(draft) ? draft
                    : null;
                  if (list) list.push(newItem);
                }
              )
            );
            dispatch(
              wizardApi.util.updateQueryData(
                'getRootWizards',
                undefined,
                (draft) => {
                  if (Array.isArray(draft)) {
                    draft.push(newItem);
                  } else if (draft && Array.isArray(draft.wizards)) {
                    draft.wizards.push(newItem);
                  }
                }
              )
            );
          } else {
            // فرزند: کش والد را آپدیت کن (کلید باید دقیقاً مثل UI باشد)
            dispatch(
              wizardApi.util.updateQueryData(
                'getWizard',
                { id: parentId, enableOnly: true },
                (draft) => {
                  if (!Array.isArray(draft.children)) draft.children = [];
                  draft.children.push(newItem);
                }
              )
            );
          }
        } catch {
          // ignore
        }
      },
      // ری‌فچ: اگر ریشه است → LIST ؛ اگر فرزند است → والد
      invalidatesTags: (result, error, arg) => {
        if (arg?.parent_id == null) {
          return [{ type: 'Wizard', id: 'LIST' }];
        }
        const parentId = Number(arg.parent_id);
        return [{ type: 'Wizard', id: parentId }];
      },
    }),

    updateWizard: builder.mutation({
      query: ({ id, data }) => ({
        url: `/wizards/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: Number(arg.id) },
      ],
    }),

    toggleStatusWizard: builder.mutation({
      query: ({ wizardId, endpoint }) => ({
        url: `/wizards/${wizardId}/${endpoint}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Wizard', id: Number(arg.wizardId) },
      ],
    }),

    deleteWizard: builder.mutation({
      query: (id) => ({
        url: `/wizards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Wizard', id: Number(id) },
        { type: 'Wizard', id: 'LIST' }, // حذف ریشه از لیست
      ],
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
