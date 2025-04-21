// تنظیمات API منابع داده
const PYTHON_CHAT_DATA_SOURCE = process.env.REACT_APP_PYTHON_CHAT_DATA_SOURCE || 'http://localhost:8001';
const DATA_SOURCES_API_URL = `${PYTHON_CHAT_DATA_SOURCE}/data_sources`;

alert(DATA_SOURCES_API_URL);

// تابع دریافت لیست منابع داده
export const getDataSources = async () => {
  try {
    const response = await fetch(DATA_SOURCES_API_URL, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('خطا در دریافت منابع داده');
    }

    return await response.json();
  } catch (error) {
    console.error('خطا در دریافت منابع داده:', error);
    throw error;
  }
}; 