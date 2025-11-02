import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import wizardApi from './api/AiApi';
import documentSlice from './features/documentSlice';
import wizardSlice from './features/wizardSlice';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    wizard: wizardSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [wizardApi.reducerPath]: wizardApi.reducer, 
  },
  middleware: (getDefault) =>
    getDefault().concat(knowledgeApi.middleware, wizardApi.middleware),
});

export default store;