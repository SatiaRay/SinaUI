import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const systemApi = createApi({
  reducerPath: 'khan-system',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.PYTHON_APP_URL || 'http://127.0.0.1:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['System', 'Settings'],
  endpoints: (builder) => ({
    /**
     * Get settings schema
     */
    getSettingsSchema: builder.query({
      query: () => '/system/settings-schema',
      providesTags: ['Settings'],
    }),

    /**
     * Get current settings
     */
    getSettings: builder.query({
      query: () => '/system/settings',
      providesTags: ['Settings'],
    }),

    /**
     * Update settings
     * @param {Object} settings - Settings data to update
     */
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: '/system/settings',
        method: 'POST',
        body: settings,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Settings'],
    }),

    /**
     * Download system export file
     */
    downloadSystemExport: builder.query({
      query: () => ({
        url: '/system/export',
        responseHandler: async (response) => {
          if (!response.ok) throw new Error('Download failed');
          return await response.blob();
        },
        cache: 'no-cache',
      }),
      providesTags: ['System'],
    }),

    /**
     * Upload system import file
     * @param {Object} params - Mutation parameters
     * @param {File} params.file - System backup file to import
     */
    uploadSystemImport: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/system/import',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['System', 'Settings'],
    }),
  }),
});

export default systemApi;

export const {
  useGetSettingsSchemaQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useDownloadSystemExportQuery,
  useLazyDownloadSystemExportQuery,
  useUploadSystemImportMutation,
} = systemApi;
