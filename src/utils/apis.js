import axios from '../contexts/axios';

// API Base URL
const BASE_URL = process.env.REACT_APP_CHAT_API_URL;
const PYTHON_APP_URL = process.env.REACT_APP_AI_SERVICE;
const IPD_SERVICE_URL = process.env.REACT_APP_IPD_SERVICE;
const KNOWLEDGE_SERVICE_URL = process.env.REACT_APP_KNOWLEDGE_SERVICE;

// Errors helpers (moved from services/api.js)
const handleAxiosError = (error, defaultMessage = 'خطا رخ داده است') => {
  console.error('Axios error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    config: {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
    },
  });

  if (error.response) {
    throw new Error(`${defaultMessage} (کد خطا: ${error.response.status})`);
  } else if (error.request) {
    throw new Error(
      'سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.'
    );
  } else {
    throw new Error(defaultMessage);
  }
};

export const formatAxiosError = (error) => {
  if (error?.response?.data) {
    const data = error.response.data;
    const status = error.response.status;
    const userMessage = data.message ?? null;
    const fieldErrors = {};
    if (data.errors && typeof data.errors === 'object') {
      for (const key of Object.keys(data.errors)) {
        const val = data.errors[key];
        if (Array.isArray(val)) {
          fieldErrors[key] = val;
        } else if (typeof val === 'string') {
          fieldErrors[key] = [val];
        } else {
          fieldErrors[key] = [JSON.stringify(val)];
        }
      }
    }
    return {
      userMessage,
      fieldErrors,
      status,
      raw: data,
    };
  }

  if (error?.request) {
    return {
      userMessage: 'No response from server',
      fieldErrors: {},
      status: null,
      raw: null,
    };
  }

  return {
    userMessage: error?.message || 'An error occurred',
    fieldErrors: {},
    status: null,
    raw: null,
  };
};

export const getVersion = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/version`);
    return response.data;
  } catch (error) {
    console.error('Error get version:', error);
    throw error;
  }
};

// =============================
// Instruction Endpoints
// =============================
export const instructionEndpoints = {
  getInstruction: async (instructionId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/instructions/${instructionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching instruction:', error);
      throw error;
    }
  },

  createInstruction: async (instructionData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/instructions/`,
        instructionData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating instruction:', error);
      throw error;
    }
  },

  updateInstruction: async (instructionId, instructionData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/instructions/${instructionId}`,
        instructionData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating instruction:', error);
      throw error;
    }
  },

  deleteInstruction: async (instructionId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/instructions/${instructionId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting instruction:', error);
      throw error;
    }
  },

  listInstructions: async (agentType = null, page = 1) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/instructions/?page=${page}&agent_type=${agentType}`
      );
      return response.data;
    } catch (error) {
      console.error('Error listing instructions:', error);
      throw error;
    }
  },
};

// =============================
// AI Functions Endpoints
// =============================
export const aiFunctionsEndpoints = {
  getFunctionsMap: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ai-functions/map`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI functions:', error);
      throw error;
    }
  },

  callFunction: async (function_name, args) => {
    try {
      const response = await axios.post(`${BASE_URL}/ai-functions/call`, {
        function_name,
        args,
      });
      return response.data;
    } catch (error) {
      console.error('Error calling AI function:', error);
      throw error;
    }
  },
};

// =============================
// Workspace Endpoints
// =============================
export const workspaceEndpoints = {
  createWorkspace: async (workspaceData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/workspaces/`,
        workspaceData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },

  listWorkspaces: async (page = 1, per_page = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/workspaces/`, {
        params: { page, per_page },
      });
      return response.data;
    } catch (error) {
      console.error('Error listing workspaces:', error);
      throw error;
    }
  },

  getWorkspace: async (workspaceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workspace:', error);
      throw error;
    }
  },

  updateWorkspace: async (workspaceId, updateData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/workspaces/${workspaceId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },

  deleteWorkspace: async (workspaceId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/workspaces/${workspaceId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  },

  addUserToWorkspace: async (workspaceId, userData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/workspaces/${workspaceId}/users`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error('Error adding user to workspace:', error);
      throw error;
    }
  },

  removeUserFromWorkspace: async (workspaceId, userId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/workspaces/${workspaceId}/users/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error removing user from workspace:', error);
      throw error;
    }
  },

  listWorkspaceUsers: async (workspaceId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/workspaces/${workspaceId}/users`
      );
      return response.data;
    } catch (error) {
      console.error('Error listing workspace users:', error);
      throw error;
    }
  },

  selectWorkspace: async (workspaceId) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/workspaces/select/${workspaceId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error selecting workspace:', error);
      throw error;
    }
  },
};

export const domainEndpoints = {
  getDomains: async () => {
    try {
      const res = await axios.get(`${PYTHON_APP_URL}/domains`);
      return res;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  },
};

export const documentEndpoints = {
  store: async (data) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/add_manually_knowledge`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error add manually:', error);
      throw error;
    }
  },
  delete: async (documentId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/documents/${documentId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },
  find: async (document_id) => {
    try {
      return await axios.get(`${PYTHON_APP_URL}/documents/${document_id}`);
    } catch (err) {
      console.error('Error fetching document:', err.message);
      throw err;
    }
  },
  all: async (page = 1, size = 10) => {
    let url = `${KNOWLEDGE_SERVICE_URL}/?page=${page}&size=${size}`;

    try {
      return await axios.get(url);
    } catch (err) {
      console.error(err.message);
      return null;
    }
  },
};

// =============================
// Voice Agent Endpoints
// =============================
export const voiceAgentEndpoints = {
  getVoiceAgentInstruction: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/voice_agent/instruction`);
      return response.data;
    } catch (error) {
      console.error('Error getting voice agent instuction:', error);
      throw error;
    }
  },
  getClientSecretKey: async (model) => {
    try {
      const URL = `${BASE_URL}/voice_agent/client_key?model=${model}`;
      const response = await axios.get(URL);
      return response.data;
    } catch (error) {
      alert('Error fetching client secret key. Please try again later.');
      console.error('Error fetching client secret key:', error);
      throw error;
    }
  },
};

// =============================
// File Endpoints
// =============================
export const fileEndpoints = {
  uploadFiles: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const URL = `${BASE_URL}/files/upload`;
      const response = await axios.post(URL, formData);
      return response.data;
    } catch (error) {
      alert('Upload failed');
      console.error('Error upload files:', error);
      throw error;
    }
  },
};

// =============================
// Monitoring Endpoints
// =============================
export const monitoringEndpoints = {
  getRecentLogs: async ({
    hours = 48,
    min_duration,
    max_duration,
    has_errors,
    tool_name,
    page = 1,
    per_page = 20,
  }) => {
    try {
      const response = await axios.get(`${BASE_URL}/function-calling-logs/`, {
        params: {
          hours,
          min_duration,
          max_duration,
          has_errors,
          tool_name,
          page,
          per_page,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      throw error;
    }
  },

  getToolStats: async (days = 7, top_n = 10) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/function-calling-logs/stats/tools`,
        { params: { days, top_n } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching tool stats:', error);
      throw error;
    }
  },

  getUserStats: async (user_id, days = 30) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/function-calling-logs/stats/user/${user_id}`,
        { params: { days } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  searchLogs: async (query, limit = 10) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/function-calling-logs/search`,
        { params: { query, limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching logs:', error);
      throw error;
    }
  },

  getLogById: async (id) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/function-calling-logs/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching log details:', error);
      throw error;
    }
  },
};

// =============================
// Wizard Endpoints
// =============================
export const wizardEndpoints = {
  getRootWizards: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wizards/hierarchy/roots`);
      return response.data;
    } catch (error) {
      console.error('Error listing root wizards:', error);
      throw error;
    }
  },
  listWizards: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/wizards`);
      return response.data;
    } catch (error) {
      console.error('Error listing wizards:', error);
      throw error;
    }
  },

  createWizard: async (wizardData) => {
    try {
      const response = await axios.post(`${BASE_URL}/wizards`, wizardData);
      return response.data;
    } catch (error) {
      console.error('Error creating wizard:', error);
      throw error;
    }
  },

  // Get wizard by ID
  getWizard: async (wizardId, enableOnly = true) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/wizards/${wizardId}?enable_only=${enableOnly ? 'true' : 'false'}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching wizard:', error);
      throw error;
    }
  },

  updateWizard: async (wizardId, wizardData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/wizards/${wizardId}`,
        wizardData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating wizard:', error);
      throw error;
    }
  },

  toggleStatusWizard: async (wizardId, endpoint) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/wizards/${wizardId}/${endpoint}`
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling wizard status:', error);
      throw error;
    }
  },

  deleteWizard: async (wizardId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/wizards/${wizardId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting wizard:', error);
      throw error;
    }
  },
};

// ============ Grouped endpoints (moved from services/api.js) ============

export const dataSourceEndpoints = {
  getDataSources: async () => {
    try {
      const response = await axios.get(`${PYTHON_APP_URL}/data_sources/`);
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'خطا در دریافت منابع داده');
    }
  },
};

export const chatEndpoints = {
  askQuestion: async (question) => {
    try {
      const response = await axios.post(`${PYTHON_APP_URL}/ask`, { question });
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'خطا در دریافت پاسخ');
    }
  },
  getChatHistory: async (sessionId, offset, limit) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CHAT_API_URL}/chat/history/${sessionId}?offset=${offset}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error, 'خطا در دریافت پاسخ');
    }
  },
};

export const authEndpoints = {
  checkAuthorizationFetcher: async () => {
    try {
      const res = await axios.get(`${PYTHON_APP_URL}/whoami`);
      return res.data;
    } catch (err) {
      console.error('Request failed:', err.response?.data || err.message);
      throw err;
    }
  },
  register: async ({ name, email, password, phone, password_confirmation }) => {
    try {
      const res = await axios.post(`${IPD_SERVICE_URL}/api/register`, {
        name,
        email,
        password,
        password_confirmation,
        phone,
      });
      return { success: true, data: res.data };
    } catch (err) {
      if (err?.response?.data) {
        const data = err.response.data;
        return {
          success: false,
          error: data.message ?? null,
          fieldErrors:
            data.errors && typeof data.errors === 'object' ? data.errors : {},
          status: err.response.status,
          raw: data,
        };
      }
      const formatted = formatAxiosError(err);
      return {
        success: false,
        error: formatted.userMessage,
        fieldErrors: formatted.fieldErrors,
        status: formatted.status,
        raw: formatted.raw,
      };
    }
  },
  login: async (email, password) => {
    try {
      const res = await axios.post(`${IPD_SERVICE_URL}/api/login`, {
        email,
        password,
      });
      return { success: true, data: res.data };
    } catch (err) {
      if (err?.response?.data) {
        const data = err.response.data;
        return {
          success: false,
          error: data.message ?? null,
          fieldErrors:
            data.errors && typeof data.errors === 'object' ? data.errors : {},
          status: err.response.status,
          raw: data,
        };
      }
      const formatted = formatAxiosError(err);
      return {
        success: false,
        error: formatted.userMessage,
        fieldErrors: formatted.fieldErrors,
        status: formatted.status,
        raw: formatted.raw,
      };
    }
  },
};

export const systemEndpoints = {
  downloadSystemExport: async () => {
    try {
      const res = await axios.get(`${PYTHON_APP_URL}/system/export`, {
        responseType: 'blob',
      });
      return res.data;
    } catch (err) {
      handleAxiosError(err, 'خطا در دریافت فایل پشتیبان');
    }
  },
  uploadSystemImport: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `${PYTHON_APP_URL}/system/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
