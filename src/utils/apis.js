import axios from '../contexts/axios';

// API Base URL
const BASE_URL = process.env.REACT_APP_PYTHON_APP_API_URL;

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

// You can add more endpoint categories here
// For example:
// export const userEndpoints = { ... }
// export const authEndpoints = { ... }
