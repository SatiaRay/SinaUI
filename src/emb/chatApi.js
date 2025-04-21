// تنظیمات API چت
const CHAT_API_URL = process.env.PYTHON_APP_API_URL || 'http://localhost:8001/ask';

// تابع ارسال سوال به سرور چت
export const askQuestion = async (question) => {
  try {
    const response = await fetch(CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error('خطا در ارتباط با سرور چت');
    }

    return await response.json();
  } catch (error) {
    console.error('خطا در ارسال سوال:', error);
    throw error;
  }
}; 