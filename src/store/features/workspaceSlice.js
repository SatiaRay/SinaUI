// features/workspaceSlice.js
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import workspaceApi from '../api/idp-features/workspaceApi';

// Create entity adapter for workspaces
const workspaceAdapter = createEntityAdapter({
  // Assuming workspace has an 'id' field
  selectId: (workspace) => workspace.id,
  // Optional: sort by creation date or name
  sortComparer: (a, b) => new Date(b.created_at) - new Date(a.created_at) || a.name.localeCompare(b.name),
});

const initialState = workspaceAdapter.getInitialState({
  status: "idle",
  currentWorkspaceId: null,
  activeWorkspace: null,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  }
});

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Add any synchronous actions if needed
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspaceId = action.payload;
      state.activeWorkspace = state.entities[action.payload] || null;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspaceId = null;
      state.activeWorkspace = null;
    },
    clearWorkspaces: (state) => {
      workspaceAdapter.removeAll(state);
      state.currentWorkspaceId = null;
      state.activeWorkspace = null;
      state.status = "idle";
      state.error = null;
    },
    updateWorkspaceInStore: (state, action) => {
      const { id, changes } = action.payload;
      workspaceAdapter.updateOne(state, { id, changes });
      if (state.currentWorkspaceId === id) {
        state.activeWorkspace = { ...state.activeWorkspace, ...changes };
      }
    },
  },
  extraReducers: (builder) => {
    // Handle getWorkspaces query
    builder.addMatcher(
      workspaceApi.endpoints.getWorkspaces.matchPending,
      (state) => {
        state.status = "loading";
        state.error = null;
      }
    );
    
    builder.addMatcher(
      workspaceApi.endpoints.getWorkspaces.matchFulfilled,
      (state, action) => {
        const { data, meta } = action.payload;
        
        if (Array.isArray(data)) {
          workspaceAdapter.setAll(state, data);
        } else if (data && typeof data === 'object') {
          // Handle different response structures
          const items = data.data || data.items || data.workspaces || [];
          workspaceAdapter.setAll(state, items);
        }
        
        // Update pagination info if available
        if (meta) {
          state.pagination = {
            currentPage: meta.current_page || meta.page || 1,
            totalPages: meta.last_page || meta.total_pages || 1,
            totalItems: meta.total || meta.total_items || 0,
            perPage: meta.per_page || meta.perpage || state.pagination.perPage,
          };
        }
        
        state.status = "success";
        state.error = null;
      }
    );
    
    builder.addMatcher(
      workspaceApi.endpoints.getWorkspaces.matchRejected,
      (state, action) => {
        state.status = "error";
        state.error = action.error?.message || "Failed to fetch workspaces";
      }
    );

    // Handle getWorkspace query (single workspace)
    builder.addMatcher(
      workspaceApi.endpoints.getWorkspace.matchFulfilled,
      (state, action) => {
        const workspace = action.payload.data || action.payload;
        workspaceAdapter.upsertOne(state, workspace);
        
        // If this is the current workspace, update activeWorkspace
        if (state.currentWorkspaceId === workspace.id) {
          state.activeWorkspace = workspace;
        }
        state.status = "success";
      }
    );

    // Handle createWorkspace mutation
    builder.addMatcher(
      workspaceApi.endpoints.createWorkspace.matchFulfilled,
      (state, action) => {
        const workspace = action.payload.data || action.payload;
        workspaceAdapter.addOne(state, workspace);
        state.currentWorkspaceId = workspace.id;
        state.activeWorkspace = workspace;
        state.status = "success";
      }
    );

    // Handle updateWorkspace mutation
    builder.addMatcher(
      workspaceApi.endpoints.updateWorkspace.matchFulfilled,
      (state, action) => {
        const workspace = action.payload.data || action.payload;
        workspaceAdapter.updateOne(state, {
          id: workspace.id,
          changes: workspace,
        });
        
        if (state.currentWorkspaceId === workspace.id) {
          state.activeWorkspace = workspace;
        }
        state.status = "success";
      }
    );

    // Handle deleteWorkspace mutation
    builder.addMatcher(
      workspaceApi.endpoints.deleteWorkspace.matchFulfilled,
      (state, action) => {
        const workspaceId = action.meta.arg.originalArgs;
        workspaceAdapter.removeOne(state, workspaceId);
        
        if (state.currentWorkspaceId === workspaceId) {
          state.currentWorkspaceId = null;
          state.activeWorkspace = null;
        }
        state.status = "success";
      }
    );

    // Handle leaveWorkspace mutation
    builder.addMatcher(
      workspaceApi.endpoints.leaveWorkspace.matchFulfilled,
      (state, action) => {
        const workspaceId = action.meta.arg.originalArgs;
        workspaceAdapter.removeOne(state, workspaceId);
        
        if (state.currentWorkspaceId === workspaceId) {
          state.currentWorkspaceId = null;
          state.activeWorkspace = null;
        }
        state.status = "success";
      }
    );

    // Handle errors for mutations
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected') && (
        action.type.includes('createWorkspace') ||
        action.type.includes('updateWorkspace') ||
        action.type.includes('deleteWorkspace') ||
        action.type.includes('inviteToWorkspace') ||
        action.type.includes('removeWorkspaceMember')
      ),
      (state, action) => {
        state.status = "error";
        state.error = action.error?.message || "Operation failed";
      }
    );
  },
});

// Export actions
export const {
  setCurrentWorkspace,
  clearCurrentWorkspace,
  clearWorkspaces,
  updateWorkspaceInStore,
} = workspaceSlice.actions;

// Export selectors
export const {
  selectAll: selectAllWorkspaces,
  selectById: selectWorkspaceById,
  selectIds: selectWorkspaceIds,
  selectEntities: selectWorkspaceEntities,
  selectTotal: selectTotalWorkspaces,
} = workspaceAdapter.getSelectors((state) => state.workspace);

// Custom selectors
export const selectWorkspaceStatus = (state) => state.workspace.status;
export const selectCurrentWorkspaceId = (state) => state.workspace.currentWorkspaceId;
export const selectActiveWorkspace = (state) => state.workspace.activeWorkspace;
export const selectWorkspaceError = (state) => state.workspace.error;
export const selectWorkspacePagination = (state) => state.workspace.pagination;

// Selector to get current workspace members (if you want to store them in slice)
export const selectCurrentWorkspaceMembers = (state) => {
  const activeWorkspace = state.workspace.activeWorkspace;
  return activeWorkspace?.members || activeWorkspace?.users || [];
};

export default workspaceSlice;