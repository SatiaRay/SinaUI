import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import wizardApi from '../api/AiApi';

const wizardAdapter = createEntityAdapter({
  selectId: (wizard) => wizard.id,
});

const initialState = wizardAdapter.getInitialState({
  status: 'idle',
});

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    wizardAdded: wizardAdapter.addOne,
    wizardUpdated: wizardAdapter.updateOne,
    wizardDeleted: wizardAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      wizardApi.endpoints.getWizards.matchFulfilled,
      (state, action) => {
        wizardAdapter.setAll(state, action.payload.wizards);
        state.status = 'success';
      }
    );
    builder.addMatcher(wizardApi.endpoints.getWizards.matchPending, (state) => {
      state.status = 'loading';
    });
    builder.addMatcher(
      wizardApi.endpoints.getWizards.matchRejected,
      (state) => {
        state.status = 'failed';
      }
    );
  },
});

export const { wizardAdded, wizardUpdated, wizardDeleted } =
  wizardSlice.actions;
export const { selectAll: selectAllWizards, selectById: selectWizardById } =
  wizardAdapter.getSelectors((state) => state.wizard);
export default wizardSlice.reducer;
