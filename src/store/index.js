import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import wizardApi from './api/AiApi';
import wizardReducer from './features/wizardSlice';

export const store = configureStore({
  reducer: {
    wizard: wizardReducer,
    [wizardApi.reducerPath]: wizardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wizardApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export default store;
