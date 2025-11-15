import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import instructionApi from 'store/api/ai-features/instructionApi';

const instructionAdapter = createEntityAdapter();

const initialState = instructionAdapter.getInitialState({
  status: "idle"
})

const instructionSlice = createSlice({
  name: 'insctruction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      instructionApi.endpoints.getInstructions.matchFulfilled,
      (state, action) => {
        instructionAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default instructionSlice;

