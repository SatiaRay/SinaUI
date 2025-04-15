// تنظیمات API چت
const CHAT_API_URL = `${process.env.APP_URL}/ask`;

// تایپ‌های مربوط به پاسخ API چت
export interface ChatSource {
  text: string;
  metadata: {
    source: string;
    url: string;
  };
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

// تایپ درخواست چت
export interface ChatRequest {
  question: string;
}

// تابع ارسال سوال به سرور چت
export const askQuestion = async (question: string): Promise<ChatResponse> => {
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