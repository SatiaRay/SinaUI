import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const MonitoringApi = createApi({
  reducerPath: 'monitoringAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AI_SERVICE || 'http://127.0.0.1:8050',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('khan-access-token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Logs', 'Stats'],
  endpoints: (builder) => ({
    /**
     * Get recent function calling logs with filters
     * @param {Object} params - Query parameters
     * @param {number} params.hours - Hours to look back (default: 48)
     * @param {number} params.min_duration - Minimum duration filter
     * @param {number} params.max_duration - Maximum duration filter
     * @param {boolean} params.has_errors - Filter by errors
     * @param {string} params.tool_name - Filter by tool name
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.per_page - Items per page (default: 20)
     */
    getRecentLogs: builder.query({
      query: ({
        hours = 48,
        min_duration,
        max_duration,
        has_errors,
        tool_name,
        page = 1,
        per_page = 20,
      } = {}) => ({
        url: '/function-calling-logs/',
        params: {
          hours,
          min_duration,
          max_duration,
          has_errors,
          tool_name,
          page,
          per_page,
        },
      }),
      providesTags: ['Logs'],
    }),

    /**
     * Get tool usage statistics
     * @param {Object} params - Query parameters
     * @param {number} params.days - Days to look back (default: 7)
     * @param {number} params.top_n - Number of top tools to return (default: 10)
     */
    getToolStats: builder.query({
      query: ({ days = 7, top_n = 10 } = {}) => ({
        url: '/function-calling-logسs/stats/tools',
        params: { days, top_n },
      }),
      providesTags: ['Stats'],
    }),

    /**
     * Get user statistics
     * @param {Object} params - Query parameters
     * @param {string} params.user_id - User ID
     * @param {number} params.days - Days to look back (default: 30)
     */
    getUserStats: builder.query({
      query: ({ user_id, days = 30 }) => ({
        url: `/function-calling-logs/stats/user/${user_id}`,
        params: { days },
      }),
      providesTags: (result, error, arg) => [
        { type: 'Stats', id: arg.user_id },
      ],
    }),

    /**
     * Search logs by query
     * @param {Object} params - Query parameters
     * @param {string} params.query - Search query
     * @param {number} params.limit - Maximum results (default: 10)
     */
    searchLogs: builder.query({
      query: ({ query, limit = 10 }) => ({
        url: '/function-calling-logs/search',
        params: { query, limit },
      }),
      providesTags: ['Logs'],
    }),

    /**
     * Get log details by ID
     * @param {Object} params - Query parameters
     * @param {string} params.id - Log ID
     */
    getLogById: builder.query({
      query: ({ id }) => `/function-calling-logs/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Logs', id: arg.id }],
    }),
  }),
});

export default MonitoringApi;

export const {
  useGetRecentLogsQuery,
  useGetToolStatsQuery,
  useGetUserStatsQuery,
  useSearchLogsQuery,
  useGetLogByIdQuery,
} = MonitoringApi;
