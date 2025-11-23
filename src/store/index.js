import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import documentSlice from './features/documentSlice';
import settingSlice from './features/settingSlice';
import aiApi from './api/aiApi';
import workflowSlice from './features/workflowSlice';
import instructionSlice from './features/instructionSlice';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    instruction: instructionSlice.reducer,
    workflow: workflowSlice.reducer,
    setting: settingSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
  },
  middleware: (getDefault) => {
    let middlewares = getDefault().concat(
      knowledgeApi.middleware,
      aiApi.middleware
    );

    return middlewares;
  },
});

export default store;
