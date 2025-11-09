import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import systemApi from '../api/SystemApi';

const settingAdapter = createEntityAdapter();

const initialState = settingAdapter.getInitialState({
  status: 'idle',
});

const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      systemApi.endpoints.downloadSystemExport.matchFulfilled,
      (state, action) => {
        state.status = 'success';
      }
    );
  },
});

export default settingSlice;
