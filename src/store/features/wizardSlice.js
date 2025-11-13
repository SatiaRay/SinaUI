import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import wizardApi from 'store/api/ai-features/wizardApi';

const wizardAdapter = createEntityAdapter();

const initialState = wizardAdapter.getInitialState({
  status: 'idle',
});

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      wizardApi.endpoints.getWizards.matchFulfilled,
      (state, action) => {
        wizardAdapter.setAll(state, action.payload);
        state.status = 'success';
      }
    );
  },
});

export default wizardSlice;
