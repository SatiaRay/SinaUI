import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const PYTHON_CHAT_DATA_SOURCE = process.env.REACT_APP_PYTHON_CHAT_DATA_SOURCE || 'http://localhost:8001';

// دریافت لیست منابع داده
export const getDataSources = async () => {
  try {
    console.log('Fetching data sources from:', `${PYTHON_CHAT_DATA_SOURCE}/data_sources/`);
    const response = await axios.get(`${PYTHON_CHAT_DATA_SOURCE}/data_sources/`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('Data sources response structure:', {
      isArray: Array.isArray(response.data),
      hasResultsArray: response.data && Array.isArray(response.data.results),
      hasDataArray: response.data && Array.isArray(response.data.data),
      hasSourcesArray: response.data && Array.isArray(response.data.sources),
      responseKeys: response.data ? Object.keys(response.data) : [],
      fullResponse: response.data
    });
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(`خطا در دریافت منابع داده (کد خطا: ${error.response.status})`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
};

// ارسال سوال به چت‌بات
export const askQuestion = async (question) => {
  try {
    const CHAT_API_URL = process.env.REACT_APP_CHAT_API_URL || `${PYTHON_CHAT_DATA_SOURCE}/ask`;
    console.log('Sending question to:', CHAT_API_URL);
    const response = await axios.post(CHAT_API_URL, { question });
    console.log('Chat response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.response) {
      throw new Error(`خطا در دریافت پاسخ (کد خطا: ${error.response.status})`);
    } else if (error.request) {
      throw new Error('سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.');
    } else {
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
}; 