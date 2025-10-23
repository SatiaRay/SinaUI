import { configureStore } from '@reduxjs/toolkit';
import { knowledgeApi } from './api/knowledgeApi';
import documentSlice from './features/documentSlice';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
  },
  middleware: (getDefault) => {
    let middlewares = getDefault().concat(knowledgeApi.middleware);

    return middlewares;
  },
});

export default store;