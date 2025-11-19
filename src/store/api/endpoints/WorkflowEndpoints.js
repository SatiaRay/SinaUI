/**
 * 🔹 Workflow Endpoints Configuration
 * Injects all workflow-related endpoints into AiApi
 */
export const WorkflowEndpoints = (api) => {
  return api.injectEndpoints({
    endpoints: (builder) => ({
      /**
       * Get all workflows with optional agent type filter
       * @param {Object} params - Query parameters
       * @param {string} params.agentType - Optional agent type filter
       */
      getAllWorkflows: builder.query({
        query: ({ agentType } = {}) =>
          agentType ? `/workflows?agent_type=${agentType}` : `/workflows`,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ id }) => ({ type: 'Workflow', id })),
                { type: 'Workflow', id: 'LIST' },
              ]
            : [{ type: 'Workflow', id: 'LIST' }],
      }),

      /**
       * Get single workflow by ID
       * @param {Object} params - Query parameters
       * @param {number} params.id - Workflow ID
       */
      getWorkflow: builder.query({
        query: (id) => `/workflows/${id}`,
        providesTags: (result) =>
          result ? [{ type: 'Workflow', id: result.id }] : [],
      }),

      /**
       * Create new workflow
       * @param {Object} params - Mutation parameters
       * @param {Object} params.data - Workflow data
       */
      storeWorkflow: builder.mutation({
        query: ({ data }) => ({
          url: `/workflows`,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: [{ type: 'Workflow', id: 'LIST' }],
      }),

      /**
       * Update existing workflow
       * @param {Object} params - Mutation parameters
       * @param {number} params.id - Workflow ID
       * @param {Object} params.data - Updated workflow data
       */
      updateWorkflow: builder.mutation({
        query: ({ id, data }) => ({
          url: `/workflows/${id}`,
          method: 'PUT',
          body: data,
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Workflow', id: arg.id },
          { type: 'Workflow', id: 'LIST' },
        ],
      }),

      /**
       * Delete workflow by ID
       * @param {Object} params - Mutation parameters
       * @param {number} params.id - Workflow ID
       */
      deleteWorkflow: builder.mutation({
        query: ({ id }) => ({
          url: `/workflows/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (result, error, arg) => [
          { type: 'Workflow', id: arg.id },
          { type: 'Workflow', id: 'LIST' },
        ],
      }),

      /**
       * Export workflow as JSON file
       * @param {Object} params - Mutation parameters
       * @param {number} params.id - Workflow ID
       */
      exportWorkflow: builder.mutation({
        query: ({ id }) => ({
          url: `/workflows/${id}/export`,
          method: 'GET',
        }),
      }),

      /**
       * Import workflow from JSON file
       * @param {Object} params - Mutation parameters
       * @param {File} params.file - JSON file to import
       */
      importWorkflow: builder.mutation({
        query: ({ file }) => {
          const formData = new FormData();
          formData.append('file', file);
          return {
            url: `/workflows/import`,
            method: 'POST',
            body: formData,
          };
        },
        invalidatesTags: [{ type: 'Workflow', id: 'LIST' }],
      }),
    }),

    overrideExisting: false, // Preserve existing endpoints if any
  });
};

export default WorkflowEndpoints;
