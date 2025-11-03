import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import wizardApi from './api/AiApi';
import documentSlice from './features/documentSlice';
import wizardReducer from './features/wizardSlice'; 

const store = configureStore({
  reducer: {
    document: documentSlice,
    wizard: wizardReducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [wizardApi.reducerPath]: wizardApi.reducer,
  },
  middleware: (getDefault) =>
    getDefault().concat(knowledgeApi.middleware, wizardApi.middleware),
});

export default store;