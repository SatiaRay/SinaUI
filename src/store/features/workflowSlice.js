import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import WorkflowsApi from '../api/workflowsApi';

const WorkflowAdapter = createEntityAdapter();

const initialState = WorkflowAdapter.getInitialState({
  status: 'idle',
});

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      WorkflowsApi.endpoints.getAllWorkflows.matchFulfilled,
      (state, action) => {
        WorkflowAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default workflowSlice;
