import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import documentSlice from './features/documentSlice';
import workflowApi from './api/workflowsApi';
import workflowSlice from './features/workflowSlice';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    workflow: workflowSlice.reducer,
    [workflowApi.reducerPath]: workflowApi.reducer,
  },
  middleware: (getDefault) => {
    let middlewares = getDefault().concat(
      knowledgeApi.middleware,
      workflowApi.middleware
    );

    return middlewares;
  },
});

export default store;
