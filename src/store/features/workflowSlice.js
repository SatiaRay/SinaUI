import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import AiApi from '../api/AiApi';

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
      AiApi.endpoints.getAllWorkflows.matchFulfilled,
      (state, action) => {
        WorkflowAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default workflowSlice;
