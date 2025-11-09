import { configureStore } from '@reduxjs/toolkit';
import knowledgeApi from './api/knowledgeApi';
import documentSlice from './features/documentSlice';
import settingSlice from './features/settingSlice';
import systemApi from './api/SystemApi';

const store = configureStore({
  reducer: {
    document: documentSlice.reducer,
    [knowledgeApi.reducerPath]: knowledgeApi.reducer,
    setting: settingSlice.reducer,
    [systemApi.reducerPath]: systemApi.reducer,
  },
  middleware: (getDefault) => {
    let middlewares = getDefault()
      .concat(knowledgeApi.middleware)
      .concat(systemApi.middleware);

    return middlewares;
  },
});

export default store;
