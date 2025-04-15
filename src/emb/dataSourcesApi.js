// تنظیمات API منابع داده
const DATA_SOURCES_API_URL = 'http://localhost:8001/data_sources';

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