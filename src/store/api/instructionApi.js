import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const instructionApi = createApi({
  reducerPath: 'khan-instruction',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8090',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Instruction'],
  endpoints: (builder) => ({
    getInstructions: builder.query({
      query: ({ page = 1, agent_type = null }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        if (agent_type) params.set('agent_type', agent_type);
        return `/instructions/?${params.toString()}`;
      },
      providesTags: (result, _error, arg) =>
        result && Array.isArray(result.items) && result.items.length
          ? [
              ...result.items.map(({ id }) => ({ type: 'Instruction', id })),
              { type: 'Instruction', page: arg.page },
            ]
          : [{ type: 'Instruction', page: arg?.page }],
    }),
    getInstruction: builder.query({
      query: ({ id }) => `/instructions/${id}`,
      providesTags: (result) =>
        result?.id ? [{ type: 'Instruction', id: result.id }] : ['Instruction'],
    }),
    createInstruction: builder.mutation({
      query: (data) => ({
        url: `/instructions/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Instruction'],
    }),
    updateInstruction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/instructions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Instruction', id: arg.id },
        'Instruction',
      ],
    }),
    deleteInstruction: builder.mutation({
      query: (id) => ({
        url: `/instructions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Instruction'],
    }),
  }),
});

export default instructionApi;

export const {
  useGetInstructionsQuery,
  useGetInstructionQuery,
  useCreateInstructionMutation,
  useUpdateInstructionMutation,
  useDeleteInstructionMutation,
} = instructionApi;
