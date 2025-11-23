import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import monitoringApi from './api/ai-features/monitoringLogsApi';
import documentSlice from './features/documentSlice';
import settingSlice from './features/settingSlice';
import aiApi from './api/aiApi';
import workflowSlice from './features/workflowSlice';
import instructionSlice from './features/instructionSlice';

/**
 * Main Redux store configuration
 * Combines all slices and APIs for state management
 */
const store = configureStore({
  /**
   * Root reducer combining all feature reducers
   */
  reducer: {
    // Feature slices
    document: documentSlice.reducer,
    instruction: instructionSlice.reducer,
    workflow: workflowSlice.reducer,
    setting: settingSlice.reducer,
    monitoring: monitoringApi.reducer,
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
