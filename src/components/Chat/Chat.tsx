import React, { useState } from 'react';
import { askQuestion } from '../../emb/chatApi';
import { ChatResponse } from '../../emb/chatApi';

// کامپوننت چت
const Chat: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await askQuestion(question);
      setAnswer(response);
    } catch (err) {
      setError('خطا در دریافت پاسخ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="سوال خود را بپرسید..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'در حال ارسال...' : 'ارسال'}
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {answer && (
        <div className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <h3 className="font-bold mb-2">پاسخ:</h3>
            <p>{answer.answer}</p>
          </div>

          {answer.sources.length > 0 && (
            <div>
              <h3 className="font-bold mb-2">منابع:</h3>
              <ul className="list-disc pl-4">
                {answer.sources.map((source, index) => (
                  <li key={index} className="mb-2">
                    <p>{source.text}</p>
                    <a
                      href={source.metadata.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm"
                    >
                      منبع: {source.metadata.source}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat; 