import { aiApi } from './aiApi';

const instructionApi = aiApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstructions: builder.query({
      query: ({ perpage = 10, page = 1 }) =>
        `/instructions?perpage=${perpage}&page=${page}`,
      providesTags: (result, error, arg) => {
        const items = Array.isArray(result?.instructions)
          ? result.instructions
          : Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];
        return items.length
          ? [
              ...items.map(({ id }) => ({ type: 'Instruction', id })),
              { type: 'Instruction', page: arg.page, perpage: arg.perpage },
              { type: 'Instruction', id: 'LIST' },
            ]
          : [
              { type: 'Instruction', page: arg.page, perpage: arg.perpage },
              { type: 'Instruction', id: 'LIST' },
            ];
      },
    }),
    getInstruction: builder.query({
      query: ({ id }) => `/instructions/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Instruction', id: arg.id }],
    }),
    createInstruction: builder.mutation({
      query: (data) => ({
        url: '/instructions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        'Instruction',
        { type: 'Instruction', id: 'LIST' },
      ],
    }),
    updateInstruction: builder.mutation({
      query: ({ id, data }) => ({
        url: `/instructions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Instruction', id: arg.id },
        'Instruction',
        { type: 'Instruction', id: 'LIST' },
      ],
    }),
    deleteInstruction: builder.mutation({
      query: (id) => ({
        url: `/instructions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Instruction', { type: 'Instruction', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetInstructionsQuery,
  useGetInstructionQuery,
  useCreateInstructionMutation,
  useUpdateInstructionMutation,
  useDeleteInstructionMutation,
} = instructionApi;

export default instructionApi;