import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const instructionApi = createApi({
  reducerPath: 'khan-instruction',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8090',

    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('khan-access-token')
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
      query: ({ perpage, page, agent_type }) => {
        const params = new URLSearchParams();
        params.set('perpage', perpage);
        params.set('page', page);
        if (agent_type) params.set('agent_type', agent_type);
        return `/?${params.toString()}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.instructions.map(({ id }) => ({ type: 'Instruction', id })),
              { type: 'Instruction', page: arg.page, perpage: arg.perpage },
            ]
          : [{ type: 'Instruction', page: arg.page, perpage: arg.perpage }],
    }),
    getInstruction: builder.query({
      query: ({ id }) => `/${id}`,
      providesTags: (result) =>
        result ? [{ type: 'Instruction', id: result.id }] : ['Instruction'],
    }),
    createInstruction: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Instruction'],
    }),
    updateInstruction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Instruction', id: arg.id },
        'Instruction',
      ],
    }),
    deleteInstruction: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
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