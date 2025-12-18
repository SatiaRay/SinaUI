// api/workspaceApi.js
import idpApi from '../idpApi';

const workspaceApi = idpApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all workspaces
    getWorkspaces: builder.query({
      query: ({ perpage = 10, page = 1, search = '' } = {}) => ({
        url: '/api/workspaces',
        params: {
          perpage,
          page,
          search,
        },
      }),
      providesTags: (result) => {
        const items = Array.isArray(result?.data) 
          ? result.data 
          : Array.isArray(result) 
            ? result 
            : [];
        
        return items.length
          ? [
              ...items.map(({ id }) => ({ type: 'Workspace', id })),
              { type: 'Workspace', id: 'LIST' },
            ]
          : [{ type: 'Workspace', id: 'LIST' }];
      },
    }),

    // Get single workspace
    getWorkspace: builder.query({
      query: ({ id }) => `/api/workspaces/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Workspace', id: arg.id }],
    }),

    // Create workspace
    createWorkspace: builder.mutation({
      query: (data) => ({
        url: '/api/workspaces',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    // Update workspace
    updateWorkspace: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/workspaces/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Workspace', id: arg.id },
        { type: 'Workspace', id: 'LIST' },
      ],
    }),

    // Delete workspace
    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/api/workspaces/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    // Invite member to workspace
    inviteToWorkspace: builder.mutation({
      query: ({ workspaceId, email, role = 'member' }) => ({
        url: `/api/workspaces/${workspaceId}/invite`,
        method: 'POST',
        body: { email, role },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Workspace', id: arg.workspaceId },
        { type: 'WorkspaceMember', id: arg.workspaceId },
      ],
    }),

    // Leave workspace
    leaveWorkspace: builder.mutation({
      query: (workspaceId) => ({
        url: `/api/workspaces/${workspaceId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Workspace', id: 'LIST' }],
    }),

    // Remove member from workspace
    removeWorkspaceMember: builder.mutation({
      query: ({ workspaceId, userId }) => ({
        url: `/api/workspaces/${workspaceId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Workspace', id: arg.workspaceId },
        { type: 'WorkspaceMember', id: arg.workspaceId },
      ],
    }),

    // Get workspace members (optional - if your API supports it)
    getWorkspaceMembers: builder.query({
      query: (workspaceId) => `/api/workspaces/${workspaceId}/members`,
      providesTags: (result, error, arg) => [
        { type: 'WorkspaceMember', id: arg },
      ],
    }),

    // Switch workspace
    switchWorkspace: builder.mutation({
      query: (workspaceId) => ({
        url: '/api/switch-workspace',
        method: 'POST',
        body: { workspace_id: workspaceId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Workspace', id: arg },
      ],
      // Transform the response to update token in localStorage
      onQueryStarted: async (workspaceId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          
          // Update token in localStorage
          if (data.token) {
            localStorage.setItem('khan-access-token', data.token);
          }
          
          // You could dispatch additional actions here if needed
          // dispatch(someAction(data.workspace_id));
          
        } catch (error) {
          console.error('Failed to switch workspace:', error);
        }
      },
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useGetWorkspaceQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useInviteToWorkspaceMutation,
  useLeaveWorkspaceMutation,
  useRemoveWorkspaceMemberMutation,
  useGetWorkspaceMembersQuery,
  useSwitchWorkspaceMutation,
} = workspaceApi;

export default workspaceApi;