import { useState, useEffect, useRef } from 'react';
import { getWebSocketUrl } from '../../utils/websocket';
import { Link } from 'react-router-dom';
import { crawlUrl, getDocument } from '../../services/api';

const CrawlUrl = ({ onClose, onDocClick }) => {
    const [url, setUrl] = useState('');
    const [crawlRecursive, setCrawlRecursive] = useState(false);
    const [storeInVector, setStoreInVector] = useState(false);
    const [crawling, setCrawling] = useState(false);
    const [crawledDocs, setCrawledDocs] = useState([]);
    const [error, setError] = useState(null);
    const [activeJobs, setActiveJobs] = useState({});
    const socketRef = useRef(null);

    const handleCrawl = async () => {
        if (!url) {
            setError('لطفا آدرس وب‌سایت را وارد کنید');
            return;
        }

        try {
            new URL(url); // Validate URL
        } catch (e) {
            setError('لطفا یک آدرس معتبر وارد کنید');
            return;
        }

        setCrawling(true);
        setError(null);
        try {
            const response = await crawlUrl(url, crawlRecursive, storeInVector);
            const data = response.data;

            // Add new job to active jobs
            setActiveJobs(prev => ({
                ...prev,
                [data.job_id]: {
                    url: data.url,
                    status: 'queued',
                    docs: []
                }
            }));

            // Connect to job WebSocket
            connectToJobSocket(data.job_id);

            setUrl(''); // Clear the input after successful crawl
        } catch (err) {
            setError(err.message);
            console.error('Error crawling website:', err);
        } finally {
            setCrawling(false);
        }
    };

    const connectToJobSocket = (jobId) => {
        const wsUrl = getWebSocketUrl(`/ws/jobs/${jobId}`);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log(`Connected to job socket: ${jobId}`);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.event) {
                    case 'change_progress':
                        handleProgressChange(jobId, data);
                        break;
                    case 'docs_created':
                        handleDocsCreated(jobId, data);
                        break;
                    default:
                        console.log('Unknown event:', data);
                }
            } catch (err) {
                console.error('Error parsing socket message:', err);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setError('خطا در ارتباط با سرور');
        };

        socket.onclose = () => {
            console.log(`Job socket closed: ${jobId}`);
        };

        socketRef.current = socket;
    };

    const handleProgressChange = (jobId, data) => {
        setActiveJobs(prev => {
            const updatedJobs = { ...prev };
            if (updatedJobs[jobId]) {
                updatedJobs[jobId] = {
                    ...updatedJobs[jobId],
                    status: data.status,
                    progress: data.progress
                };
            }
            return updatedJobs;
        });
    };

    const handleDocsCreated = async (jobId, data) => {
        // Fetch document details for each doc_id
        const docPromises = data.doc_ids.map(async (docId) => {
            try {
                const response = await getDocument(docId)

                const doc = response.data;

                // Map the document data to ensure we have the correct properties
                return {
                    id: doc.id,
                    title: doc.title,
                    url: doc.uri, // Map uri to url for compatibility
                    uri: doc.uri,
                    html: doc.html,
                    markdown: doc.markdown,
                    domain: doc.domain
                };
            } catch (err) {
                console.error('Error fetching document:', err);
                return null;
            }
        });

        const docs = (await Promise.all(docPromises)).filter(doc => doc !== null);

        setActiveJobs(prev => {
            const updatedJobs = { ...prev };
            if (updatedJobs[jobId]) {
                updatedJobs[jobId] = {
                    ...updatedJobs[jobId],
                    docs: [...updatedJobs[jobId].docs, ...docs]
                };
            }
            return updatedJobs;
        });
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 m-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">خزش وب‌سایت</h2>
                <Link
                    to="/document"
                    className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-300"
                >
                    بازگشت
                </Link>
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
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
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
                    <div className="mt-5 grid grid-cols-1 gap-4">
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="store-in-vector"
                                checked={storeInVector}
                                onChange={e => setStoreInVector(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor="store-in-vector" className="text-sm text-gray-700 dark:text-gray-300 select-none cursor-pointer">
                                اسناد ساخته شده پس از خزش فعال شوند و در دسترس هوش مصنوعی قرار گیرند.
                            </label>
                        </div>
                    </div>
                </div>

                {/* Active Jobs List */}
                {Object.entries(activeJobs).length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">وظایف فعال</h3>
                        <div className="space-y-4">
                            {Object.entries(activeJobs).map(([jobId, job]) => (
                                <div key={jobId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 dark:text-white">{job.url}</h4>
                                        <span className={`text-sm px-2 py-1 rounded ${job.status === 'finished' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                job.status === 'started' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                                            }`}>
                                            {job.status === 'finished' ? 'تکمیل شده' :
                                                job.status === 'started' ? 'در حال اجرا' :
                                                    'در صف'}
                                        </span>
                                    </div>
                                    {job.docs.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {job.docs.map((doc) => (
                                                <Link
                                                    key={doc.id}
                                                    to={`/document/edit/${doc.id}`}
                                                    className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                                                >
                                                    <h5 className="font-medium text-gray-900 dark:text-white">{doc.title}</h5>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{doc.uri}</p>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrawlUrl;
