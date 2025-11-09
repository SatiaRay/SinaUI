import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import documentSlice from './features/documentSlice';
import instructionSlice from './features/instructionSlice';
import instructionApi from './api/instructionApi';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    instruction: instructionSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [instructionApi.reducerPath]: instructionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(knowledgeApi.middleware, instructionApi.middleware),
});

export default store;
