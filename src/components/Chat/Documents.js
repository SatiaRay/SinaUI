    import React, { useState, useEffect } from 'react';
    import CrawlUrl from './CrawlUrl';
    import CreateDocument from './CreateDocument';
    import ModifyDocument from './ModifyDocument';
    import ReactMarkdown from 'react-markdown';

    // استایل‌های سراسری برای جداول در Markdown و CKEditor
    const globalStyles = `
        .prose table, .ck-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        direction: rtl;
    }

    .prose table th, .ck-content table th {
        background-color: #f3f4f6;
        color: #1f2937;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        text-align: right;
        font-weight: 600;
    }

    .prose table td, .ck-content table td {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        text-align: right;
        color: #374151;
    }

    .dark .prose table th, .dark .ck-content table th {
        background-color: #374151;
        color: #f9fafb;
        border-color: #4b5563;
    }

    .dark .prose table td, .dark .ck-content table td {
        color: #d1d5db;
        border-color: #4b5563;
    }
    `;

    const Documents = () => {
    const [domains, setDomains] = useState([]);
    const [domainsLoading, setDomainsLoading] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [domainFiles, setDomainFiles] = useState([]);
    const [filesLoading, setFilesLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const [fileContentLoading, setFileContentLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showCrawlUrl, setShowCrawlUrl] = useState(false);
    const [crawledDocs, setCrawledDocs] = useState([]);
    const [documentsTab, setDocumentsTab] = useState('crawled');
    const [showAddKnowledge, setShowAddKnowledge] = useState(false);
    const [manualDocuments, setManualDocuments] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 20,
        offset: 0,
        total: 0,
    });

    useEffect(() => {
        if (documentsTab === 'crawled') {
        fetchDomains();
        } else if (documentsTab === 'manual') {
        fetchManualDocuments();
        }
    }, [documentsTab, pagination.offset]);

    const fetchDomains = async () => {
        setDomainsLoading(true);
        setError(null);
        try {
        const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/domains`, {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    });
    if (!response.ok) {
        throw new Error('خطا در دریافت لیست دامنه‌ها');
    }
    const data = await response.json();
    setDomains(data);
    } catch (err) {
        setError(err.message);
        console.error('Error fetching domains:', err);
    } finally {
        setDomainsLoading(false);
    }
    };

    const fetchDomainFiles = async (domain) => {
        setFilesLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/?domain_id=${domain.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('خطا در دریافت فایل‌های دامنه');
            }
            const data = await response.json();
            setDomainFiles(data);
            setSelectedDomain(domain);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching domain files:', err);
        } finally {
            setFilesLoading(false);
        }
    };

    const fetchFileContent = async (file) => {
        setFileContentLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${file.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('خطا در دریافت محتوای فایل');
            }
            const data = await response.json();
            setFileContent(data);
            setSelectedFile(file);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching file content:', err);
        } finally {
            setFileContentLoading(false);
        }
    };

    const fetchManualDocuments = async () => {
        setDomainsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/manual?limit=${pagination.limit}&offset=${pagination.offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('خطا در دریافت لیست اسناد');
            }
            const data = await response.json();
            setManualDocuments(data);
            const total = response.headers.get('X-Total-Count');
            if (total) {
                setPagination((prev) => ({ ...prev, total: parseInt(total) }));
            }
        } catch (err) {
            setError(err.message);
            console.error('Error fetching manual documents:', err);
        } finally {
            setDomainsLoading(false);
        }
    };

    const handleDomainClick = (domain) => {
        fetchDomainFiles(domain);
    };

    const handleBackClick = () => {
        setSelectedDomain(null);
        setDomainFiles([]);
    };

    const handleFileClick = (file) => {
        fetchFileContent(file);
    };

    const handleBackToFiles = () => {
        setSelectedFile(null);
        setFileContent(null);
    };

    const handleCrawledDocClick = (doc) => {
        setSelectedFile({
            id: doc.id,
            title: doc.title,
            uri: doc.url,
        });
        const domain = doc.url.split('/')[0];
        setSelectedDomain({ domain });
        fetchFileContent({
            id: doc.id,
            title: doc.title,
            uri: doc.url,
        });
    };

    const handlePageChange = (newOffset) => {
        setPagination((prev) => ({ ...prev, offset: newOffset }));
    };

    return (
        <>
            <style>{globalStyles}</style>
            <div className="flex flex-col h-full p-6 max-w-6xl mx-auto">
                {/* هدر */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        {/* Back Button */}
                        {selectedFile ? (
                            <button
                                onClick={handleBackToFiles}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                بازگشت
                            </button>
                        ) : selectedDomain ? (
                            <button
                                onClick={handleBackClick}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                بازگشت
                            </button>
                        ) : null}
                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {selectedFile ? 'محتوای سند' : selectedDomain ? `فایل‌های دامنه: ${selectedDomain.domain}` : 'مستندات'}
                        </h2>
                    </div>
                    
                    {/* Action Buttons and Count */}
                    {!selectedFile && (
                        <div className="flex items-center gap-4">
                            {/* Crawl URL Button (only on initial crawled tab view)*/}
                            {(documentsTab === 'crawled' && !selectedDomain && !selectedFile) && (
                                <button
                                    onClick={() => { setShowCrawlUrl(true); setShowAddKnowledge(false); }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    خزش URL
                                </button>
                            )}
                            {/* Add Knowledge Button (only on initial manual tab view) */}
                            {(documentsTab === 'manual' && !selectedDomain && !selectedFile) && (
                                <button
                                    onClick={() => { setShowAddKnowledge(true); setShowCrawlUrl(false); }}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2"
                                >
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" 
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    افزودن دانش
                                </button>
                            )}
                            {/* Count (only in list views) */}
                            {(!selectedFile) && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                تعداد: {selectedDomain ? domainFiles.length : documentsTab === 'crawled' ? domains.length : manualDocuments.length}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* تب‌ها */}
                {!selectedDomain && !selectedFile && (
                    <div className="mb-6 flex gap-4">
                        <button
                            onClick={() => setDocumentsTab('crawled')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                documentsTab === 'crawled'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            خزیده‌شده
                        </button>
                        <button
                            onClick={() => setDocumentsTab('manual')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                documentsTab === 'manual'
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                        >
                            دستی
                        </button>
                    </div>
                )}

                {/* نمایش خطا */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center mb-6">
                        <p className="text-red-500 dark:text-red-400">{error}</p>
                        <button
                            onClick={documentsTab === 'crawled' ? fetchDomains : fetchManualDocuments}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            تلاش مجدد
                        </button>
                    </div>
                )}

                {/* نمایش لودینگ */}
                {(domainsLoading || filesLoading || fileContentLoading) && (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                        <p className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</p>
                    </div>
                )}

                {/* محتوای تب‌ها */}
                {!domainsLoading && !error && (
                    <div className="flex-1 overflow-y-auto">
                        {documentsTab === 'crawled' && !selectedDomain && !selectedFile && (
                            <div>
                                {domains.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                            هیچ دامنه‌ای خزش نشده است
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            برای خزش دامنه جدید، روی دکمه "خزش URL" کلیک کنید
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {domains.map((domain) => (
                                            <div
                                                key={domain.id}
                                                onClick={() => handleDomainClick(domain)}
                                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                                        {domain.domain}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                {domain.document_count} فایل
                            </span>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <p>تاریخ ایجاد: {new Date(domain.created_at).toLocaleString('fa-IR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {documentsTab === 'crawled' && selectedDomain && !selectedFile && (
                            <div>
                                {domainFiles.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12 mx-auto text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                            هیچ فایلی در این دامنه وجود ندارد
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            برای خزش لینک جدید، روی دکمه "خزش URL" کلیک کنید
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {domainFiles.map((file) => (
                                            <div
                                                key={file.id}
                                                onClick={() => handleFileClick(file)}
                                                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                                        {file.title || file.uri}
                                                    </h3>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <p>آدرس: {file.uri}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {documentsTab === 'crawled' && selectedFile && (
                            <div>
                                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-4">
                                        {selectedFile.title}
                                    </h3>
                                    <div className="text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                                        {fileContentLoading ? (
                                            <div>در حال بارگذاری...</div>
                                        ) : error ? (
                                            <div className="text-red-500">{error}</div>
                                        ) : fileContent ? (
                                            <>
                                                <ModifyDocument
                                                    file={selectedFile}
                                                    fileContent={fileContent}
                                                    selectedDomain={selectedDomain}
                                                    onBack={handleBackToFiles}
                                                />
                                            </>
                                        ) : (
                                            <div className="text-gray-700 dark:text-gray-300">داده‌ای برای نمایش وجود ندارد</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {documentsTab === 'manual' && !selectedFile && (
                            <div>
                                {manualDocuments.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2-2z"
                                            />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-200">
                                            هیچ سندی وجود ندارد
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            برای ایجاد سند جدید، روی دکمه "افزودن دانش" کلیک کنید
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {manualDocuments.map((doc) => (
                                            <div
                                                key={doc.id}
                                                onClick={() => handleFileClick(doc)}
                                                className="p-6 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl dark:bg-gray-800 transition-shadow duration-200 hover:bg-blue-50 dark:hover:bg-gray-700"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-medium text-gray-800 truncate dark:text-white">
                                                        {doc.title || doc.uri}
                                                    </h3>
                                                </div>
                                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <p>شناسه: {doc.id}</p>
                                                    <p>{new Date(doc.created_at).toLocaleString('fa-IR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {pagination.total > pagination.limit && (
                                    <div className="flex justify-center items-center space-x-2 space-x-reverse mt-4">
                                        <button
                                            onClick={() => handlePageChange(Math.max(0, pagination.offset - pagination.limit))}
                                            disabled={pagination.offset === 0}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 disabled:bg-opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 hover:bg-gray-300"
                                        >
                                            قبلی
                                        </button>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                        صفحه {Math.floor(pagination.offset / pagination.limit) + 1} از{' '}
                                            {Math.ceil(pagination.total / pagination.limit)}
                        </span>
                                        <button
                                            onClick={() => handlePageChange(pagination.offset + pagination.limit)}
                                            disabled={pagination.offset + pagination.limit >= pagination.total}
                                            className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 disabled:bg-opacity-50 disabled:cursor-not-allowed dark:hover:bg-gray-700 hover:bg-gray-300"
                                        >
                                            بعدی
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {documentsTab === 'manual' && selectedFile && (
                            <div>
                                <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
                                        {selectedFile.title}
                                    </h3>
                                    {fileContentLoading ? (
                                        <div className="text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>
                                    ) : error ? (
                                        <div className="text-red-600">{error}</div>
                                    ) : fileContent ? (
                                        <>
                                            <div className="prose max-w-full dark:prose-invert">
                                                <ReactMarkdown>{fileContent.markdown || fileContent.html || 'محتوا در دسترس نیست'}</ReactMarkdown>
                                            </div>
                                            <ModifyDocument
                                                file={selectedFile}
                                                fileContent={fileContent}
                                                selectedDomain={selectedDomain}
                                                onBack={handleBackToFiles}
                                            />
                                        </>
                                    ) : (
                                        <div className="text-gray-600 dark:text-gray-300">داده‌ای برای نمایش وجود ندارد</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {(showCrawlUrl || showAddKnowledge) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex justify-center items-center"
                    onClick={() => { setShowCrawlUrl(false); setShowAddKnowledge(false); }}
                >
                    {/* Backdrop */}
                    {showCrawlUrl && (
                        <div
                            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-3xl w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <CrawlUrl
                                onClose={() => setShowCrawlUrl(false)}
                                onCrawlComplete={setCrawledDocs}
                                onDocClick={handleCrawledDocClick}
                            />
                        </div>
                    )}

                    {showAddKnowledge && (
                        <div
                            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-3xl w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                             <CreateDocument
                                onClose={() => { setShowAddKnowledge(false); fetchManualDocuments(); }}
                                onDocumentCreated={fetchManualDocuments}
                             />
                        </div>
                    )}
                </div>
            )}
        </>
    );
    };

    export default Documents;
