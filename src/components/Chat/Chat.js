import React, { useState, useEffect, useRef } from 'react';
import { getDataSources, askQuestion } from '../../services/api.js';

// کامپوننت چت
const Chat = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedSourceId, setExpandedSourceId] = useState(null);
  const [expandedTexts, setExpandedTexts] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'data-sources') {
      fetchDataSources();
    }
  }, [activeTab]);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const fetchDataSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDataSources();
      console.log("Received data:", data);
      // Check if data is an array or get the appropriate property that contains the array
      if (Array.isArray(data)) {
        setSources(data);
      } else if (data && Array.isArray(data.results)) {
        // If data has a results property that is an array
        setSources(data.results);
      } else if (data && Array.isArray(data.data)) {
        // If data has a data property that is an array
        setSources(data.data);
      } else if (data && Array.isArray(data.sources)) {
        // If data has a sources property that is an array
        setSources(data.sources);
      } else {
        // If we can't find an array in the response
        console.error("Unexpected data format:", data);
        setSources([]);
        setError('ساختار داده‌های دریافتی نامعتبر است');
      }
    } catch (err) {
      console.error('Error in fetchDataSources:', err);
      setError(err.message || 'خطا در دریافت منابع داده');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const currentQuestion = question;
    setQuestion('');
    setChatLoading(true);
    setError(null);
    
    // Add the user question to chat history immediately
    setChatHistory(prev => [...prev, { type: 'question', text: currentQuestion, timestamp: new Date() }]);
    
    try {
      const response = await askQuestion(currentQuestion);
      // Add the answer to chat history
      setChatHistory(prev => [...prev, {
        type: 'answer',
        answer: response.answer,
        sources: response.sources,
        timestamp: new Date()
      }]);
    } catch (err) {
      setError('خطا در دریافت پاسخ');
      console.error('Error asking question:', err);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleChunks = (sourceId) => {
    if (expandedSourceId === sourceId) {
      setExpandedSourceId(null);
    } else {
      setExpandedSourceId(sourceId);
    }
  };

  const toggleTextExpansion = (chunkId) => {
    setExpandedTexts(prev => ({
      ...prev,
      [chunkId]: !prev[chunkId]
    }));
  };

  // تابع تبدیل دوره بروزرسانی به فارسی
  const translateRefreshStatus = (status) => {
    const translations = {
      'Never': 'هرگز',
      'Daily': 'روزانه',
      'Weekly': 'هفتگی',
      'Monthly': 'ماهانه'
    };
    
    return translations[status] || status || 'هرگز';
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'chat'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          چت
        </button>
        <button
          onClick={() => setActiveTab('data-sources')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'data-sources'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          منابع داده
        </button>
        <button
          onClick={() => setActiveTab('add-data')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'add-data'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          داده جدید
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {(() => {
          switch (activeTab) {
            case 'chat':
              return (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                        سوال خود را بپرسید تا گفتگو شروع شود
                      </div>
                    ) : (
                      chatHistory.map((item, index) => (
                        <div key={index} className="mb-4">
                          {item.type === 'question' ? (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-right">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">شما</span>
                              </div>
                              <p className="text-gray-800 dark:text-gray-200">{item.text}</p>
                            </div>
                          ) : (
                            <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTimestamp(item.timestamp)}
                                </span>
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">چت‌بات</span>
                              </div>
                              <div className="mb-4">
                                <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                              </div>

                              {item.sources && item.sources.length > 0 && (
                                <div>
                                  <h3 className="font-bold mb-2 text-sm text-gray-900 dark:text-white">منابع:</h3>
                                  <ul className="list-disc pl-4">
                                    {item.sources.map((source, sourceIndex) => (
                                      <li key={sourceIndex} className="mb-2">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{source.text}</p>
                                        <a
                                          href={source.metadata.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-500 hover:text-blue-600"
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
                      ))
                    )}
                    
                    {chatLoading && (
                      <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-gray-800 rounded-lg mb-4 animate-pulse">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                        <p className="text-gray-600 dark:text-gray-300">در حال دریافت پاسخ...</p>
                      </div>
                    )}
                    
                    {/* Invisible element to scroll to */}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="سوال خود را بپرسید..."
                      className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      disabled={chatLoading}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !question.trim()}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                    >
                      {chatLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          <span>در حال ارسال...</span>
                        </>
                      ) : (
                        'ارسال'
                      )}
                    </button>
                  </form>
                  {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>
              );

            case 'data-sources':
              return (
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center p-4">
                      <div className="text-red-500 mb-2">{error}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        لطفاً موارد زیر را بررسی کنید:
                        <ul className="list-disc list-inside mt-2 text-right">
                          <li>اتصال به اینترنت</li>
                          <li>وضعیت سرور</li>
                          <li>آدرس API در فایل .env</li>
                        </ul>
                      </div>
                      <button
                        onClick={fetchDataSources}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        تلاش مجدد
                      </button>
                    </div>
                  ) : sources && Array.isArray(sources) && sources.length > 0 ? (
                    <div className="grid gap-4">
                      {sources.map((source, index) => (
                        <div
                          key={source.id || index}
                          className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                          onClick={() => toggleChunks(source.id || index)}
                        >
                          <div className="flex flex-col">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {source.url}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                وارد شده توسط: {source.imported_by || 'نامشخص'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                تاریخ وارد کردن: {source.import_date ? new Date(source.import_date).toLocaleString('fa-IR') : 'نامشخص'}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                دوره بروزرسانی: {translateRefreshStatus(source.refresh_status)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              تعداد قطعات متن: {source.chunks ? source.chunks.length : 0}
                            </p>
                            <span className="text-xs text-blue-500">
                              {expandedSourceId === (source.id || index) ? 'بستن' : 'مشاهده جزئیات'}
                            </span>
                          </div>
                          {expandedSourceId === (source.id || index) && source.chunks && source.chunks.length > 0 && (
                            <div className="mt-4 border-t pt-3 dark:border-gray-700">
                              <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">قطعات متن:</h4>
                              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 max-h-60 overflow-y-auto">
                                {source.chunks.map((chunk, chunkIndex) => {
                                  const chunkKey = chunk.id || `chunk-${source.id || index}-${chunkIndex}`;
                                  const isTextExpanded = expandedTexts[chunkKey];
                                  
                                  return (
                                    <div 
                                      key={chunkKey} 
                                      className="p-3 mb-3 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                                    >
                                      <div className="flex justify-between mb-2 border-b pb-2 dark:border-gray-700">
                                        <p className="font-medium text-gray-700 dark:text-gray-300">شناسه: {chunk.id || `بخش ${chunkIndex + 1}`}</p>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs">صفحه: {chunk.metadata?.page || 'نامشخص'}</p>
                                      </div>
                                      
                                      {chunk.title && (
                                        <div className="mb-2">
                                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">عنوان:</p>
                                          <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{chunk.title}</p>
                                        </div>
                                      )}
                                      
                                      {chunk.text && (
                                        <div className="mb-2">
                                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">متن:</p>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {chunk.text.length > 200 && !isTextExpanded
                                              ? `${chunk.text.substring(0, 200)}...` 
                                              : chunk.text}
                                          </p>
                                          {chunk.text.length > 200 && (
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling to parent
                                                toggleTextExpansion(chunkKey);
                                              }}
                                              className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                            >
                                              {isTextExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                                            </button>
                                          )}
                                        </div>
                                      )}
                                      
                                      {chunk.content && !chunk.text && (
                                        <div className="mb-2">
                                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">محتوا:</p>
                                          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {chunk.content.length > 200 && !isTextExpanded
                                              ? `${chunk.content.substring(0, 200)}...` 
                                              : chunk.content}
                                          </p>
                                          {chunk.content.length > 200 && (
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling to parent
                                                toggleTextExpansion(chunkKey);
                                              }}
                                              className="mt-2 text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                            >
                                              {isTextExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      هیچ منبع داده‌ای یافت نشد
                    </div>
                  )}
                </div>
              );

            case 'add-data':
              return (
                <div className="max-w-2xl mx-auto p-4">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">افزودن منبع داده جدید</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        آدرس وب‌سایت
                      </label>
                      <input
                        type="url"
                        id="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <button
                        onClick={async () => {
                          const urlInput = document.getElementById('url');
                          const url = urlInput.value;

                          if (!url) {
                            alert('لطفا آدرس وب‌سایت را وارد کنید');
                            return;
                          }

                          try {
                            new URL(url); // URL validation
                          } catch (e) {
                            alert('لطفا یک آدرس معتبر وارد کنید');
                            return;
                          }

                          try {
                            const response = await fetch('http://127.0.0.1:8000/crawl_url', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({ url }),
                            });

                            if (!response.ok) {
                              throw new Error('خطا در ارسال درخواست');
                            }

                            const data = await response.json();
                            
                            if (data.status === 'success') {
                              const container = document.createElement('div');
                              container.className = 'mt-4 space-y-4';
                              
                              data.chunks.forEach((chunk, index) => {
                                const chunkDiv = document.createElement('div');
                                chunkDiv.className = 'space-y-2 p-4 border border-gray-200 rounded-lg relative';
                                chunkDiv.id = `chunk-${index}`;
                                
                                const titleInput = document.createElement('input');
                                titleInput.type = 'text';
                                titleInput.value = chunk.title;
                                titleInput.className = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white';
                                
                                const textArea = document.createElement('textarea');
                                textArea.value = chunk.text;
                                textArea.rows = 4;
                                textArea.className = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white';
                                
                                const removeButton = document.createElement('button');
                                removeButton.innerHTML = '×';
                                removeButton.className = 'absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl font-bold';
                                removeButton.onclick = () => {
                                  if (window.confirm('آیا از حذف این قطعه متن مطمئن هستید ؟')) {
                                    chunkDiv.remove();
                                  }
                                };
                                
                                chunkDiv.appendChild(removeButton);
                                chunkDiv.appendChild(titleInput);
                                chunkDiv.appendChild(textArea);
                                container.appendChild(chunkDiv);
                              });

                              // Clear previous results if any
                              const existingContainer = document.querySelector('.chunks-container');
                              if (existingContainer) {
                                existingContainer.remove();
                              }

                              // Add submit button
                              const submitButton = document.createElement('button');
                              submitButton.innerHTML = 'ذخیره در پایگاه دانش';
                              submitButton.className = 'w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
                              
                              let isLoading = false;
                              submitButton.onclick = async () => {
                                if (isLoading) return;
                                
                                isLoading = true;
                                submitButton.innerHTML = 'در حال ذخیره سازی...';
                                submitButton.disabled = true;

                                const chunks = Array.from(document.querySelectorAll('.chunks-container > div')).map(div => ({
                                  title: div.querySelector('input').value,
                                  text: div.querySelector('textarea').value,
                                  section: ""
                                }));

                                try {
                                  const response = await fetch('http://127.0.0.1:8000/store_knowledge', {
                                    method: 'POST',
                                    headers: {
                                      'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                      source_url: url,
                                      chunks: chunks
                                    })
                                  });

                                  if (response.ok) {
                                    alert('اطلاعات با موفقیت ذخیره شد');
                                    setActiveTab('data-sources');
                                  } else {
                                    throw new Error('خطا در ذخیره اطلاعات');
                                  }
                                } catch (error) {
                                  alert('خطا در ارسال درخواست: ' + error.message);
                                } finally {
                                  isLoading = false;
                                  submitButton.innerHTML = 'ذخیره در پایگاه دانش';
                                  submitButton.disabled = false;
                                }
                              };

                              container.appendChild(submitButton);
                              container.classList.add('chunks-container');
                              urlInput.parentElement.parentElement.appendChild(container);

                            } else {
                              throw new Error('خطا در دریافت اطلاعات');
                            }

                          } catch (error) {
                            alert('خطا در ارسال درخواست: ' + error.message);
                          }
                        }}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        شروع خزش
                      </button>
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default Chat; 