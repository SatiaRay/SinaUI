import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import { aiApi } from './api/aiApi';
import documentSlice from './features/documentSlice';
import wizardSlice from './features/wizardSlice';

const store = configureStore({
  reducer: {
    document: documentSlice,
    wizard: wizardSlice,
    [aiApi.reducerPath]: aiApi.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(knowledgeApi.middleware, aiApi.middleware),
});

export default store;
