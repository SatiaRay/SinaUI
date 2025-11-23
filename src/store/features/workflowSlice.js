import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import aiApi from '../api/aiApi';
import WorkflowEndpoints from 'store/api/ai-features/workflowApi';

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
      WorkflowEndpoints.endpoints.getAllWorkflows.matchFulfilled,
      (state, action) => {
        WorkflowAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default workflowSlice;
