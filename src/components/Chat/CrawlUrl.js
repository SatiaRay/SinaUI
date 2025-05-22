import { useState } from 'react';

const CrawlUrl = ({ onClose, onCrawledDocClick }) => {
    const [crawlUrl, setCrawlUrl] = useState('');
    const [crawlRecursive, setCrawlRecursive] = useState(false);
    const [crawling, setCrawling] = useState(false);
    const [crawledDocs, setCrawledDocs] = useState([]);
    const [error, setError] = useState(null);   

    const handleCrawl = async () => {
        if (!crawlUrl) {
            setError('لطفا آدرس وب‌سایت را وارد کنید');
            return;
        }
    
        try {
            new URL(crawlUrl); // Validate URL
        } catch (e) {
            setError('لطفا یک آدرس معتبر وارد کنید');
            return;
        }
    
        setCrawling(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/crawl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: crawlUrl,
                    recursive: crawlRecursive
                })
            });
    
            if (!response.ok) {
                throw new Error('خطا در خزش وب‌سایت');
            }
    
            const data = await response.json();
            setCrawledDocs(data.docs);
            setCrawlUrl(''); // Clear the input after successful crawl
        } catch (err) {
            setError(err.message);
            console.error('Error crawling website:', err);
        } finally {
            setCrawling(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">خزش وب‌سایت</h2>
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    بازگشت
                </button>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="crawl-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        آدرس وب‌سایت
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            id="crawl-url"
                            value={crawlUrl}
                            onChange={(e) => setCrawlUrl(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="https://example.com"
                        />
                        <button
                            onClick={handleCrawl}
                            disabled={crawling}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                        >
                            {crawling ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    در حال خزش...
                                </>
                            ) : (
                                'شروع خزش'
                            )}
                        </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="crawl-recursive"
                            checked={crawlRecursive}
                            onChange={e => setCrawlRecursive(e.target.checked)}
                            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                        />
                        <label htmlFor="crawl-recursive" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                            خزش تو در تو (Recursive)
                        </label>
                    </div>
                </div>

                {/* Crawled Documents List */}
                {crawledDocs.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">صفحات خزش شده</h3>
                        <div className="space-y-4">
                            {crawledDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => onCrawledDocClick(doc)}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors"
                                >
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{doc.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{doc.url}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CrawlUrl;
