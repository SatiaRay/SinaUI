import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import { aiApi } from './api/aiApi';
import documentSlice from './features/documentSlice';
import instructionSlice from './features/instructionSlice';
import aiApi from './api/aiApi';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    instruction: instructionSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(knowledgeApi.middleware, aiApi.middleware),
});

export default store;
