import axios from '../contexts/axios';

// API Base URL
const BASE_URL = process.env.REACT_APP_CHAT_API_URL;

// Workflow Endpoints
export const workflowEndpoints = {
  // Get workflow by ID
  getWorkflow: async (workflowId) => {
    try {
      const response = await axios.get(`${BASE_URL}/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workflow:', error);
      throw error;
    }
  },

  // Create new workflow
  createWorkflow: async (workflowData) => {
    try {
      const response = await axios.post(`${BASE_URL}/workflows`, workflowData);
      return response.data;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  },

  // Update existing workflow
  updateWorkflow: async (workflowId, workflowData) => {
    try {
      const response = await axios.put(`${BASE_URL}/workflows/${workflowId}`, workflowData);
      return response.data;
    } catch (error) {
      console.error('Error updating workflow:', error);
      throw error;
    }
  },

  // Delete workflow
  deleteWorkflow: async (workflowId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/workflows/${workflowId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting workflow:', error);
      throw error;
    }
  },

  // List all workflows
  listWorkflows: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/workflows`);
      return response.data;
    } catch (error) {
      console.error('Error listing workflows:', error);
      throw error;
    }
  }
};

export const getVersion = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/version`);
    return response.data;
  } catch (error) {
    console.error('Error get version:', error);
    throw error;
  }
}

// Instruction Endpoints
export const instructionEndpoints = {
  // Get instruction by ID
  getInstruction: async (instructionId) => {
    try {
      const response = await axios.get(`${BASE_URL}/instructions/${instructionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instruction:', error);
      throw error;
    }
  },

  // Create new instruction
  createInstruction: async (instructionData) => {
    try {
      const response = await axios.post(`${BASE_URL}/instructions/`, instructionData);
      return response.data;
    } catch (error) {
      console.error('Error creating instruction:', error);
      throw error;
    }
  },

  // Update existing instruction
  updateInstruction: async (instructionId, instructionData) => {
    try {
      const response = await axios.put(`${BASE_URL}/instructions/${instructionId}`, instructionData);
      return response.data;
    } catch (error) {
      console.error('Error updating instruction:', error);
      throw error;
    }
  },

  // Delete instruction
  deleteInstruction: async (instructionId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/instructions/${instructionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting instruction:', error);
      throw error;
    }
  },

  // List all instructions
  listInstructions: async (page = 1) => {
    try {
      const response = await axios.get(`${BASE_URL}/instructions/?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error listing instructions:', error);
      throw error;
    }
  }
};

export const aiFunctionsEndpoints = {
  getFunctionsMap: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ai-functions/map`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AI functions:', error);
      throw error;
    }
  }
};

// Workspace Endpoints
export const workspaceEndpoints = {
  // 1. Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      const response = await axios.post(`${BASE_URL}/workspaces/`, workspaceData);
      return response.data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      throw error;
    }
  },

  // 2. List all workspaces with pagination
  listWorkspaces: async (page = 1, per_page = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/workspaces/`, {
        params: { page, per_page }
      });
      return response.data;
    } catch (error) {
      console.error('Error listing workspaces:', error);
      throw error;
    }
  },

  // 3. Get workspace details by ID
  getWorkspace: async (workspaceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching workspace:', error);
      throw error;
    }
  },

  // 4. Update workspace by ID
  updateWorkspace: async (workspaceId, updateData) => {
    try {
      const response = await axios.put(`${BASE_URL}/workspaces/${workspaceId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating workspace:', error);
      throw error;
    }
  },

  // 5. Delete workspace by ID
  deleteWorkspace: async (workspaceId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/workspaces/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting workspace:', error);
      throw error;
    }
  },

  // 6. Add user to workspace
  addUserToWorkspace: async (workspaceId, userData) => {
    try {
      const response = await axios.post(`${BASE_URL}/workspaces/${workspaceId}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error adding user to workspace:', error);
      throw error;
    }
  },

  // 7. Remove user from workspace
  removeUserFromWorkspace: async (workspaceId, userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/workspaces/${workspaceId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing user from workspace:', error);
      throw error;
    }
  },

  // 8. List users in a workspace
  listWorkspaceUsers: async (workspaceId) => {
    try {
      const response = await axios.get(`${BASE_URL}/workspaces/${workspaceId}/users`);
      return response.data;
    } catch (error) {
      console.error('Error listing workspace users:', error);
      throw error;
    }
  },

  // 9. Select or switch the current workspace for the authenticated user
  selectWorkspace: async (workspaceId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/workspaces/select/${workspaceId}`);
      return response.data;
    } catch (error) {
      console.error('Error selecting workspace:', error);
      throw error;
    }
  }
};

export const documentEndpoints = {
   // add document manuallay
   addDocumentManually: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/add_manually_knowledge`, data);
      return response.data;
    } catch (error) {
      console.error('Error add manually:', error);
      throw error;
    }
  },
}

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
}
