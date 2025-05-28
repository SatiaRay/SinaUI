import axios from 'axios';

// تنظیم baseURL برای APIهای مختلف
const API_URL = process.env.REACT_APP_API_URL || 'http://144.76.160.218:81/api';
const PYTHON_CHAT_DATA_SOURCE = process.env.REACT_APP_PYTHON_CHAT_DATA_SOURCE || process.env.REACT_APP_PYTHON_APP_API_URL || 'http://144.76.160.218:81/api';

// ایجاد نمونه axios با تنظیمات پیش‌فرض
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// ایجاد نمونه axios برای چت
const chatAxiosInstance = axios.create({
  baseURL: PYTHON_CHAT_DATA_SOURCE,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// افزودن interceptor برای افزودن توکن به هدرها
chatAxiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);

// دریافت لیست منابع داده
export const getDataSources = async () => {
  try {
    console.log('Fetching data sources from:', `${PYTHON_CHAT_DATA_SOURCE}/data_sources/`);
    const response = await chatAxiosInstance.get('/data_sources/');
    console.log('Data sources response structure:', {
      isArray: Array.isArray(response.data),
      hasResultsArray: response.data && Array.isArray(response.data.results),
      hasDataArray: response.data && Array.isArray(response.data.data),
      hasSourcesArray: response.data && Array.isArray(response.data.sources),
      responseKeys: response.data ? Object.keys(response.data) : [],
      fullResponse: response.data,
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
        headers: error.config?.headers,
      },
    });

    if (error.response) {
      throw new Error(`خطا در دریافت منابع داده (کد خطا: ${error.response.status})`);
    } else if (error.request) {
      throw new Error('سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.');
    } else {
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
};

// ارسال سوال به چت‌بات
export const askQuestion = async (question) => {
  try {
    console.log('Sending question to:', `${PYTHON_CHAT_DATA_SOURCE}/ask`);
    const response = await chatAxiosInstance.post('/ask', { question });
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
        headers: error.config?.headers,
      },
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

// ارسال درخواست لاگین
export const login = async (email, password) => {
  try {
    console.log('Sending login request to:', `${API_URL}/login`);
    const response = await axiosInstance.post('/login', {
      email,
      password,
    });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error details:', {
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
      throw new Error(`خطا در ورود به سیستم (کد خطا: ${error.response.status})`);
    } else if (error.request) {
      throw new Error('سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.');
    } else {
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
};