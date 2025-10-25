import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import knowledgeApi from '../api/knowledgeApi';

const documentAdapter = createEntityAdapter();

const initialState = documentAdapter.getInitialState({
  status: "idle"
})

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      knowledgeApi.endpoints.getAllDocuments.matchFulfilled,
      (state, action) => {
        documentAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default documentSlice;

