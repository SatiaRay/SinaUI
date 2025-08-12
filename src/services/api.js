import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const PYTHON_APP_URL = process.env.REACT_APP_CHAT_API_URL;

// Axios instance for main API
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Axios instance for Python/Chat API
const chatAxiosInstance = axios.create({
  baseURL: PYTHON_APP_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token to chat API requests
chatAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper for handling errors
const handleAxiosError = (error, defaultMsg) => {
  console.error("API Error:", {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    config: error.config
  });

  if (error.response) {
    throw new Error(error.response.data?.message || `${defaultMsg} (کد خطا: ${error.response.status})`);
  } else if (error.request) {
    throw new Error("سرور پاسخ نمی‌دهد. لطفاً اتصال اینترنت و سرور را بررسی کنید.");
  } else {
    throw new Error(defaultMsg);
  }
};

// =================== API FUNCTIONS ===================

export const exportWorkflow = async (workflow_id) => {
  try {
    const res = await axiosInstance.get(`/workflows/${workflow_id}/export`, {
      responseType: "blob",
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت خروجی");
  }
};


export const importWorkflow = async (file) => {
  if (!file) throw new Error("فایل الزامی است");

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(`${PYTHON_APP_URL}/workflows/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // اگر نیاز دارید
      },
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در بارگذاری گردش کار");
  }
};






// Register new user
export const register = async ({ first_name, last_name, email, password, phone }) => {
  try {
    const res = await axiosInstance.post(`/auth/register`, {
      firstName: first_name,
      lastName: last_name,
      email,
      password,
      phoneNumber: phone
    });
    console.log("Registration successful:", res.data);
    return res.data; // ✅ return directly if success
  } catch (err) {
    handleAxiosError(err, "خطا در ثبت نام");
  }
};

// Login
export const login = async (email, password) => {
  try {
    const res = await axiosInstance.post(`/auth/login`, { email, password });
    console.log("Login successful:", res.data);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در ورود به سیستم");
  }
};

// Get Data Sources
export const getDataSources = async () => {
  try {
    const res = await chatAxiosInstance.get("/data_sources/");
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت منابع داده");
  }
};

// Ask Question
export const askQuestion = async (question) => {
  try {
    const res = await chatAxiosInstance.post("/ask", { question });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت پاسخ");
  }
};

// Check authorization
export const checkAuthorizationFetcher = () =>
  axios.get(`${PYTHON_APP_URL}/auth/me`).then((res) => res.data);

// Get domains
export const getDomains = async () => {
  try {
    const res = await axios.get(`${PYTHON_APP_URL}/domains`);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت دامنه‌ها");
  }
};

// Get documents
export const getDocuments = async (manualType = false, agentType = null, page = 1, size = 10) => {
  const url = manualType
    ? `${PYTHON_APP_URL}/documents/manual?page=${page}&size=${size}&agent_type=${agentType}`
    : `${PYTHON_APP_URL}/documents?page=${page}&size=${size}`;

  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت اسناد");
  }
};

// Get documents by domain
export const getDomainDocuments = async (domain_id, page = 1, size = 10) => {
  try {
    const res = await axios.get(`${PYTHON_APP_URL}/documents/domain/${domain_id}?page=${page}&size=${size}`);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت اسناد دامنه");
  }
};

// Get single document
export const getDocument = async (document_id) => {
  try {
    const res = await axios.get(`${PYTHON_APP_URL}/documents/${document_id}`);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در دریافت سند");
  }
};

// Toggle document vector status
export const toggleDocumentVectorStatus = async (document_id) => {
  try {
    const res = await axios.post(`${PYTHON_APP_URL}/documents/${document_id}/toggle-vector`);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در تغییر وضعیت وکتور سند");
  }
};

// Crawl a URL
export const crawlUrl = async (url, recursive = false, store_in_vector = false) => {
  try {
    const res = await axios.post(`${PYTHON_APP_URL}/crawl`, {
      url,
      recursive,
      store_in_vector,
    });
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در خزیدن آدرس");
  }
};

// Vectorize a document
export const vectorizeDocument = async (document_id, document) => {
  try {
    const res = await axios.post(`${PYTHON_APP_URL}/documents/${document_id}/vectorize`, document);
    return res.data;
  } catch (err) {
    handleAxiosError(err, "خطا در وکتورسازی سند");
  }
};
