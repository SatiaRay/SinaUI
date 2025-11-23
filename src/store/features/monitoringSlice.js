import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import MonitoringApi from '../api/ai-features/monitoringLogsApi';

/**
 * Entity adapter for managing logs state with normalized structure
 * Provides optimized state management for CRUD operations on logs
 */
const LogsAdapter = createEntityAdapter({
  /**
   * Select unique identifier for each log entity
   * @param {Object} log - Log object
   * @param {string} log.id - Unique log identifier
   * @returns {string} Log ID
   */
  selectId: (log) => log.id,

  /**
   * Sort comparer for logs - newest first by creation date
   * @param {Object} a - First log object
   * @param {Object} b - Second log object
   * @returns {number} Comparison result for sorting
   */
  sortComparer: (a, b) => new Date(b.created_at) - new Date(a.created_at),
});

/**
 * Initial state for monitoring slice
 * Includes entity adapter state plus custom state properties
 */
const initialState = LogsAdapter.getInitialState({
  /**
   * Current API request status
   * @type {'idle' | 'loading' | 'success' | 'error'}
   */
  status: 'idle',

  /**
   * Last error message from API requests
   * @type {string|null}
   */
  error: null,

  /**
   * Statistics data container
   * @type {Object}
   */
  stats: {
    /**
     * Tool usage statistics
     * @type {Object|null}
     */
    tools: null,

    /**
     * User-specific statistics
     * @type {Object|null}
     */
    user: null,
  },

  /**
   * Search results from log search queries
   * @type {Array}
   */
  searchResults: [],
});

/**
 * Monitoring slice for managing function calling logs and statistics
 * Handles state updates for all monitoring-related API endpoints
 */
const monitoringSlice = createSlice({
  /**
   * Slice name used in Redux DevTools and state structure
   */
  name: 'monitoring',

  initialState,

  /**
   * Synchronous actions for monitoring state
   */
  reducers: {
    /**
     * Clear search results from state
     * @param {Object} state - Current state
     */
    clearSearchResults: (state) => {
      state.searchResults = [];
    },

    /**
     * Clear error state
     * @param {Object} state - Current state
     */
    clearError: (state) => {
      state.error = null;
    },
  },

  /**
   * Handle asynchronous actions from MonitoringApi endpoints
   * Updates state based on API request status (pending/fulfilled/rejected)
   */
  extraReducers: (builder) => {
    builder
      // ============================================
      // Get Recent Logs Endpoint Handlers
      // ============================================

      /**
       * Handle pending state for getRecentLogs query
       * Sets status to loading when request is in progress
       */
      .addMatcher(
        MonitoringApi.endpoints.getRecentLogs.matchPending,
        (state) => {
          state.status = 'loading';
        }
      )

      /**
       * Handle successful getRecentLogs response
       * Updates logs entities and sets success status
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with response payload
       */
      .addMatcher(
        MonitoringApi.endpoints.getRecentLogs.matchFulfilled,
        (state, action) => {
          // Update entities with response data (handles both data property and direct array)
          LogsAdapter.setAll(state, action.payload.data || action.payload);
          state.status = 'success';
          state.error = null;
        }
      )

      /**
       * Handle failed getRecentLogs request
       * Sets error status and stores error message
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with error details
       */
      .addMatcher(
        MonitoringApi.endpoints.getRecentLogs.matchRejected,
        (state, action) => {
          state.status = 'error';
          state.error = action.error.message;
        }
      )

      // ============================================
      // Get Tool Statistics Endpoint Handlers
      // ============================================

      /**
       * Handle successful getToolStats response
       * Updates tools statistics in state
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with statistics payload
       */
      .addMatcher(
        MonitoringApi.endpoints.getToolStats.matchFulfilled,
        (state, action) => {
          state.stats.tools = action.payload;
          state.error = null;
        }
      )

      /**
       * Handle failed getToolStats request
       * Clears tools statistics and stores error
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with error details
       */
      .addMatcher(
        MonitoringApi.endpoints.getToolStats.matchRejected,
        (state, action) => {
          state.stats.tools = null;
          state.error = action.error.message;
        }
      )

      // ============================================
      // Get User Statistics Endpoint Handlers
      // ============================================

      /**
       * Handle successful getUserStats response
       * Updates user statistics in state
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with user stats payload
       */
      .addMatcher(
        MonitoringApi.endpoints.getUserStats.matchFulfilled,
        (state, action) => {
          state.stats.user = action.payload;
          state.error = null;
        }
      )

      /**
       * Handle failed getUserStats request
       * Clears user statistics and stores error
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with error details
       */
      .addMatcher(
        MonitoringApi.endpoints.getUserStats.matchRejected,
        (state, action) => {
          state.stats.user = null;
          state.error = action.error.message;
        }
      )

      // ============================================
      // Search Logs Endpoint Handlers
      // ============================================

      /**
       * Handle successful searchLogs response
       * Updates search results in state
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with search results payload
       */
      .addMatcher(
        MonitoringApi.endpoints.searchLogs.matchFulfilled,
        (state, action) => {
          // Store search results (handles both data property and direct array)
          state.searchResults = action.payload.data || action.payload;
          state.error = null;
        }
      )

      /**
       * Handle failed searchLogs request
       * Clears search results and stores error
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with error details
       */
      .addMatcher(
        MonitoringApi.endpoints.searchLogs.matchRejected,
        (state, action) => {
          state.searchResults = [];
          state.error = action.error.message;
        }
      )

      // ============================================
      // Get Log By ID Endpoint Handlers
      // ============================================

      /**
       * Handle successful getLogById response
       * Upserts single log entity into state
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with log details payload
       */
      .addMatcher(
        MonitoringApi.endpoints.getLogById.matchFulfilled,
        (state, action) => {
          // Add or update single log in entities
          LogsAdapter.upsertOne(state, action.payload);
          state.error = null;
        }
      )

      /**
       * Handle failed getLogById request
       * Stores error message without modifying entities
       * @param {Object} state - Current state
       * @param {Object} action - Redux action with error details
       */
      .addMatcher(
        MonitoringApi.endpoints.getLogById.matchRejected,
        (state, action) => {
          state.error = action.error.message;
        }
      );
  },
});

/**
 * Entity adapter selectors for accessing logs state
 * Provides optimized selectors for common entity operations
 */
export const {
  /**
   * Select all logs as array
   */
  selectAll: selectAllLogs,

  /**
   * Select log by ID
   */
  selectById: selectLogById,

  /**
   * Select all log IDs as array
   */
  selectIds: selectLogIds,

  /**
   * Select logs entities dictionary
   */
  selectEntities: selectLogEntities,

  /**
   * Select total count of logs
   */
  selectTotal: selectTotalLogs,
} = LogsAdapter.getSelectors((state) => state.monitoring);

/**
 * Synchronous actions for monitoring slice
 */
export const { clearSearchResults, clearError } = monitoringSlice.actions;

/**
 * Monitoring slice reducer
 */
export default monitoringSlice.reducer;
