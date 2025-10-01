import axios from 'axios';

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
    // Server responded but with an error code
    throw new Error(`${defaultMessage} (کد خطا: ${error.response.status})`);
  } else if (error.request) {
    // Request was sent but no response received
    throw new Error(
      'سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.'
    );
  } else {
    // Something went wrong before sending the request
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

// تنظیم baseURL برای APIهای مختلف
const API_URL = process.env.REACT_APP_IPD_SERVICE;
const PYTHON_APP_URL = process.env.REACT_APP_AI_SERVICE;

// ایجاد نمونه axios با تنظیمات پیش‌فرض
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ایجاد نمونه axios برای چت
const chatAxiosInstance = axios.create({
  baseURL: PYTHON_APP_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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
    console.log(
      'Fetching data sources from:',
      `${PYTHON_APP_URL}/data_sources/`
    );
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
      throw new Error(
        `خطا در دریافت منابع داده (کد خطا: ${error.response.status})`
      );
    } else if (error.request) {
      throw new Error(
        'سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.'
      );
    } else {
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
};

// ارسال سوال به چت‌بات
export const askQuestion = async (question) => {
  try {
    console.log('Sending question to:', `${PYTHON_APP_URL}/ask`);
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
      throw new Error(
        'سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.'
      );
    } else {
      throw new Error('خطا در ارسال درخواست به سرور');
    }
  }
};

export const checkAuthorizationFetcher = async () => {
  try {
    const res = await axios.get(`${PYTHON_APP_URL}/whoami`);
    return res.data;
  } catch (err) {
    console.error('Request failed:', err.response?.data || err.message);
  }
};

export const getDomains = async () => {
  try {
    return await axios.get(`${PYTHON_APP_URL}/domains`);
  } catch (err) {
    console.error(err.message);
    return null;
  }
};
export const getDocuments = async (
  manualType = false,
  agentType = null,
  page = 1,
  size = 10
) => {
  let url;
  if (manualType) {
    url = `${PYTHON_APP_URL}/documents/manual?page=${page}&size=${size}`;

    if (agentType && typeof agentType === 'string') {
      url += `&agent_type=${agentType}`;
    }
  } else {
    url = `${PYTHON_APP_URL}/documents?page=${page}&size=${size}`;
  }

  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

export const getDomainDocuments = async (domain_id, page = 1, size = 10) => {
  const url = `${PYTHON_APP_URL}/documents/domain/${domain_id}?page=${page}&size=${size}`;
  try {
    return await axios.get(url);
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

export const getDocument = async (document_id) => {
  try {
    return await axios.get(`${PYTHON_APP_URL}/documents/${document_id}`);
  } catch (err) {
    console.error('Error fetching document:', err.message);
    throw err;
  }
};

export const toggleDocumentVectorStatus = async (document_id) => {
  try {
    return await axios.post(
      `${PYTHON_APP_URL}/documents/${document_id}/toggle-vector`
    );
  } catch (err) {
    console.error('Error fetching document:', err.message);
    throw err;
  }
};

export const crawlUrl = async (
  url,
  recursive = false,
  store_in_vector = false
) => {
  try {
    return await axios.post(`${PYTHON_APP_URL}/crawl`, {
      url: url,
      recursive: recursive,
      store_in_vector: store_in_vector,
    });
  } catch (err) {
    console.error('Error fetching document:', err.message);
    throw err;
  }
};

export const vectorizeDocument = async (document_id, document) => {
  try {
    return await axios.post(
      `${PYTHON_APP_URL}/documents/${document_id}/vectorize`,
      document
    );
  } catch (err) {
    console.error('Error vectorizing document:', err.message);
    throw err;
  }
};

export const downloadSystemExport = async () => {
  try {
    const res = await chatAxiosInstance.get('/system/export', {
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, 'خطا در دریافت فایل پشتیبان');
  }
};

export const uploadSystemImport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_URL}/system/import`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const exportWorkflow = async (workflow_id) => {
  try {
    const res = await axiosInstance.get(`/workflows/${workflow_id}/export`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, 'خطا در دریافت خروجی');
  }
};

export const importWorkflow = async (file) => {
  if (!file) throw new Error('فایل الزامی است');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await axios.post(
      `${PYTHON_APP_URL}/workflows/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // اگر نیاز دارید
        },
      }
    );
    return res.data;
  } catch (err) {
    handleAxiosError(err, 'خطا در بارگذاری گردش کار');
  }
};

// Register new user
export const register = async ({
  name,
  email,
  password,
  phone,
  password_confirmation,
}) => {
  try {
    const res = await axiosInstance.post('/api/register', {
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
};

// Login
export const login = async (email, password) => {
  try {
    const res = await axiosInstance.post('/api/login', { email, password });
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
};
