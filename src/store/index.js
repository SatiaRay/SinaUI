import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import monitoringApi from './api/monitoringLogsApi';
import documentSlice from './features/documentSlice';
import monitoringSlice from './features/monitoringSlice';

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
    monitoring: monitoringSlice.reducer,

    // API reducers
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    [monitoringApi.reducerPath]: monitoringApi.reducer,
  },

  /**
   * Middleware configuration
   * Extends default middleware with RTK Query APIs
   */
  middleware: (getDefaultMiddleware) => {
    /**
     * Get default middleware including thunk, serializable check, etc.
     * Concatenate RTK Query middleware for API caching and synchronization
     */
    let middlewares = getDefaultMiddleware()
      .concat(knowledgeApi.middleware)
      .concat(monitoringApi.middleware);

    return middlewares;
  },
});

export default store;
