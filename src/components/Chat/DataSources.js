
import React, { useState, useEffect } from 'react';
import { getDataSources } from '../../services/api';
import UpdateDataSource from './UpdateDataSource';

const DataSources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSourceId, setExpandedSourceId] = useState(null);
  const [expandedTexts, setExpandedTexts] = useState({});
  const [deletingSource, setDeletingSource] = useState(null);
  const [editingSource, setEditingSource] = useState(null);

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDataSources();
      if (Array.isArray(data)) {
        setSources(data);
      } else if (data && Array.isArray(data.results)) {
        setSources(data.results);
      } else if (data && Array.isArray(data.data)) {
        setSources(data.data);
      } else if (data && Array.isArray(data.sources)) {
        setSources(data.sources);
      } else {
        console.error('Unexpected data format:', data);
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

  const handleDeleteSource = async (sourceId) => {
    if (!window.confirm('آیا از حذف این منبع داده اطمینان دارید؟')) {
      return;
    }

    setDeletingSource(sourceId);
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/data_sources/${sourceId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('خطا در حذف منبع داده');
      }

      setSources((prev) => prev.filter((source) => source.source_id !== sourceId));
      alert('منبع داده با موفقیت حذف شد');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting source:', err);
    } finally {
      setDeletingSource(null);
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
    setExpandedTexts((prev) => ({
      ...prev,
      [chunkId]: !prev[chunkId],
    }));
  };

  const translateRefreshStatus = (status) => {
    const translations = {
      Never: 'هرگز',
      Daily: 'روزانه',
      Weekly: 'هفتگی',
      Monthly: 'ماهانه',
    };
    return translations[status] || status || 'هرگز';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-lg shadow-md text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">{error}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            لطفاً موارد زیر را بررسی کنید:
            <ul className="list-disc list-inside mt-3 text-right space-y-2">
              <li>اتصال به اینترنت</li>
              <li>وضعیت سرور</li>
              <li>آدرس API در فایل .env</li>
            </ul>
          </div>
          <button
            onClick={fetchDataSources}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            تلاش مجدد
          </button>
        </div>
      ) : editingSource ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">

          <UpdateDataSource
            document_id={editingSource}
            onBack={() => setEditingSource(null)}
          />
        </div>
      ) : sources && Array.isArray(sources) && sources.length > 0 ? (
        <div className="grid gap-6">
          {sources.map((source, index) => (
            <div
              key={source.source_id || index}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer"
              onClick={() => setEditingSource(source.source_id)}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {source.chunks[0]?.metadata?.title || 'بدون عنوان'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      وارد شده توسط: {source.imported_by || 'نامشخص'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      تاریخ وارد کردن: {source.import_date ? new Date(source.import_date).toLocaleString('fa-IR') : 'نامشخص'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      دوره بروزرسانی: {translateRefreshStatus(source.refresh_status)}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSource(source.source_id);
                      }}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSource(source.source_id);
                      }}
                      disabled={deletingSource === source.source_id}
                      className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      {deletingSource === source.source_id ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-500"></div>
                          در حال حذف...
                        </div>
                      ) : (
                        'حذف'
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    تعداد قطعات متن: {source.chunks ? source.chunks.length : 0}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChunks(source.source_id || index);
                    }}
                    className="text-sm text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
                  >
                    {expandedSourceId === (source.source_id || index) ? 'بستن قطعات' : 'نمایش قطعات'}
                  </button>
                </div>
                {expandedSourceId === (source.source_id || index) && source.chunks && source.chunks.length > 0 && (
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">قطعات متن:</h4>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-80 overflow-y-auto space-y-4">
                      {source.chunks.map((chunk, chunkIndex) => {
                        const chunkKey = chunk.id || `chunk-${source.source_id || index}-${chunkIndex}`;
                        const isTextExpanded = expandedTexts[chunkKey];

                        return (
                          <div
                            key={chunkKey}
                            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                          >
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                شناسه: {chunk.id || `بخش ${chunkIndex + 1}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                صفحه: {chunk.metadata?.page || 'نامشخص'}
                              </p>
                            </div>

                            {chunk.title && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">عنوان:</p>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{chunk.title}</p>
                              </div>
                            )}

                            {chunk.text && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">متن:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {chunk.text.length > 200 && !isTextExpanded
                                    ? `${chunk.text.substring(0, 200)}...`
                                    : chunk.text}
                                </p>
                                {chunk.text.length > 200 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTextExpansion(chunkKey);
                                    }}
                                    className="mt-2 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
                                  >
                                    {isTextExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                                  </button>
                                )}
                              </div>
                            )}

                            {chunk.content && !chunk.text && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">محتوا:</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {chunk.content.length > 200 && !isTextExpanded
                                    ? `${chunk.content.substring(0, 200)}...`
                                    : chunk.content}
                                </p>
                                {chunk.content.length > 200 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleTextExpansion(chunkKey);
                                    }}
                                    className="mt-2 text-xs text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">
          هیچ منبع داده‌ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default DataSources;