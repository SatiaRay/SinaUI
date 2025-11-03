import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import wizardApi from '../api/AiApi';

const wizardAdapter = createEntityAdapter({
  selectId: (wizard) => wizard.id,
});

const initialState = wizardAdapter.getInitialState({
  status: 'idle',
  error: null, 
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
        state.error = null;
      }
    );
    builder.addMatcher(wizardApi.endpoints.getWizards.matchPending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addMatcher(wizardApi.endpoints.getWizards.matchRejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'خطا در دریافت ویزاردها';
    });
    builder.addMatcher(
      wizardApi.endpoints.createWizard.matchFulfilled,
      (state, action) => {
        wizardAdapter.addOne(state, action.payload); 
        state.status = 'success';
        state.error = null;
      }
    );
    builder.addMatcher(wizardApi.endpoints.createWizard.matchPending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addMatcher(wizardApi.endpoints.createWizard.matchRejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'خطا در ایجاد ویزارد';
    });

    // Handlers for updateWizard
    builder.addMatcher(
      wizardApi.endpoints.updateWizard.matchFulfilled,
      (state, action) => {
        wizardAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
        state.status = 'success';
        state.error = null;
      }
    );
    builder.addMatcher(wizardApi.endpoints.updateWizard.matchPending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addMatcher(wizardApi.endpoints.updateWizard.matchRejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'خطا در به‌روزرسانی ویزارد';
    });
    builder.addMatcher(
      wizardApi.endpoints.deleteWizard.matchFulfilled,
      (state, action) => {
        wizardAdapter.removeOne(state, action.payload.id); 
        state.status = 'success';
        state.error = null;
      }
    );
    builder.addMatcher(wizardApi.endpoints.deleteWizard.matchPending, (state) => {
      state.status = 'loading';
      state.error = null;
    });
    builder.addMatcher(wizardApi.endpoints.deleteWizard.matchRejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message || 'خطا در حذف ویزارد';
    });
  },
});

export const { wizardAdded, wizardUpdated, wizardDeleted } = wizardSlice.actions;
export const { selectAll: selectAllWizards, selectById: selectWizardById } =
  wizardAdapter.getSelectors((state) => state.wizard);
export default wizardSlice.reducer;