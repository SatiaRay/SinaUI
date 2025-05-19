import React, { useState, useEffect, useRef } from 'react';
import { getDataSources, askQuestion } from '../../services/api.js';
import CreateWizard from './CreateWizard';
import WizardIndex from './WizardIndex';
import WizardButtons from './WizardButtons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { flushSync } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import UpdateDataSource from './UpdateDataSource';

// Global styles for chat messages
const globalStyles = `
  .chat-message table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  
  .chat-message table th {
    background-color: white;
    color: black;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    text-align: right;
  }
  
  .chat-message table td {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    text-align: right;
  }
  
  .dark .chat-message table th {
    background-color: white;
    color: black;
    border-color: #374151;
  }
  
  .dark .chat-message table td {
    color: white;
    border-color: #374151;
  }

  /* Quill Editor RTL Styles */
  .ql-editor {
    direction: rtl !important;
    text-align: right !important;
  }

  .ql-toolbar {
    direction: rtl !important;
  }

  .ql-toolbar .ql-formats {
    margin-left: 15px !important;
    margin-right: 0 !important;
  }

  .ql-toolbar .ql-picker {
    margin-left: 15px !important;
    margin-right: 0 !important;
  }

  /* Quill Editor Dark Mode Styles */
  .dark .ql-toolbar {
    background-color: #1f2937 !important;
    border-color: #374151 !important;
  }

  .dark .ql-toolbar button {
    color: #ffffff !important;
  }

  .dark .ql-toolbar button:hover {
    color: #3b82f6 !important;
  }

  .dark .ql-toolbar button.ql-active {
    color: #3b82f6 !important;
  }

  .dark .ql-toolbar .ql-picker {
    color: #ffffff !important;
  }

  .dark .ql-toolbar .ql-picker-options {
    background-color: #1f2937 !important;
    border-color: #374151 !important;
  }

  .dark .ql-toolbar .ql-picker-item {
    color: #ffffff !important;
  }

  .dark .ql-toolbar .ql-picker-item:hover {
    color: #3b82f6 !important;
  }

  .dark .ql-container {
    background-color: #1f2937 !important;
    border-color: #374151 !important;
  }

  .dark .ql-editor {
    color: #ffffff !important;
  }

  .dark .ql-editor.ql-blank::before {
    color: #9ca3af !important;
  }

  /* SVG Icon Styles for Dark Mode */
  .dark .ql-toolbar .ql-stroke {
    stroke: #ffffff !important;
  }

  .dark .ql-toolbar .ql-fill {
    fill: #ffffff !important;
  }

  .dark .ql-toolbar .ql-even {
    fill: #ffffff !important;
  }

  .dark .ql-toolbar .ql-thin {
    stroke: #ffffff !important;
  }

  .dark .ql-toolbar button:hover .ql-stroke,
  .dark .ql-toolbar button:hover .ql-fill,
  .dark .ql-toolbar button:hover .ql-even,
  .dark .ql-toolbar button:hover .ql-thin {
    stroke: #3b82f6 !important;
    fill: #3b82f6 !important;
  }

  .dark .ql-toolbar button.ql-active .ql-stroke,
  .dark .ql-toolbar button.ql-active .ql-fill,
  .dark .ql-toolbar button.ql-active .ql-even,
  .dark .ql-toolbar button.ql-active .ql-thin {
    stroke: #3b82f6 !important;
    fill: #3b82f6 !important;
  }

  .dark .ql-toolbar .ql-picker-label {
    color: #ffffff !important;
  }

  .dark .ql-toolbar .ql-picker-label:hover {
    color: #3b82f6 !important;
  }

  .dark .ql-toolbar .ql-picker-label.ql-active {
    color: #3b82f6 !important;
  }
`;

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
  const [domains, setDomains] = useState([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainFiles, setDomainFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [fileContentLoading, setFileContentLoading] = useState(false);
  const [storingVector, setStoringVector] = useState(false);
  const chatEndRef = useRef(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedWebsiteData, setSelectedWebsiteData] = useState(null);
  const [wizardMessage, setWizardMessage] = useState(null);
  const [quillEditor, setQuillEditor] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [saving, setSaving] = useState(false);
  // Add new state for manual knowledge entry
  const [manualTitle, setManualTitle] = useState('');
  const [manualText, setManualText] = useState('');
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [deletingSource, setDeletingSource] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [crawling, setCrawling] = useState(false);
  const [crawledDocs, setCrawledDocs] = useState([]);
  const [previousTab, setPreviousTab] = useState(null);
  const [crawlRecursive, setCrawlRecursive] = useState(false);
  const [addKnowledgeTab, setAddKnowledgeTab] = useState('manual');

  // Socket 
  const socketRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'align',
    'link', 'image'
  ];

  useEffect(() => {
    if (activeTab === 'data-sources') {
      fetchDataSources();
    } else if (activeTab === 'crawled-websites') {
      fetchDomains();
    }
  }, [activeTab]);

  useEffect(() => {
    // Scroll to bottom when chat history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (fileContent?.html) {
      setEditorContent(fileContent.html);
    }
  }, [fileContent]);

  useEffect(() => {
    // Try to get existing session ID from localStorage
    const storedSessionId = localStorage.getItem('chat_session_id');
    
    if (storedSessionId) {
      setSessionId(parseInt(storedSessionId));
    } else {
      // Generate new integer session ID if none exists
      const newSessionId = Math.floor(Math.random() * 1000000); // Generate a random 6-digit number
      localStorage.setItem('chat_session_id', newSessionId.toString());
      setSessionId(newSessionId);
    }
  }, []);

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

  const fetchDomains = async () => {
    setDomainsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/domains`);
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
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/?domain_id=${domain.id}`);
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
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${file.id}`);
      if (!response.ok) {
        throw new Error('خطا در دریافت محتوای فایل');
      }
      const data = await response.json();
      
      // Log the content for debugging
      console.log('HTML length:', data.html?.length);
      console.log('Markdown length:', data.markdown?.length);
      
      setFileContent(data);
      setSelectedFile(file);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching file content:', err);
    } finally {
      setFileContentLoading(false);
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
    if (previousTab) {
      setActiveTab(previousTab);
      setPreviousTab(null);
    } else {
      setActiveTab('crawled-websites');
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


  /* Receives the response in socket connection */
  const realtimeHandleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    const currentQuestion = question;
    setQuestion('');
    setError(null);
    
    // Add the user question to chat history immediately
    setChatHistory(prev => [...prev, { type: 'question', text: currentQuestion, timestamp: new Date() }]);

    if (socketRef.current) {
      socketRef.current.close();
    }

    let newMessageAppended = false;

    // Add empty bot response message
    const botMessage = {
      type: 'answer',
      answer: '',
      sources: [],
      timestamp: new Date()
    };

    const url = new URL(process.env.REACT_APP_PYTHON_APP_API_URL)
    const hostPort = `${url.hostname}:${url.port}`;

    // Get session ID from localStorage
    const storedSessionId = localStorage.getItem('chat_session_id');
    if (!storedSessionId) {
      setError('خطا در شناسایی نشست');
      return;
    }

    // Use stored sessionId in WebSocket connection
    socketRef.current = new WebSocket(`ws://${hostPort}/ws/ask?session_id=${storedSessionId}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection established');
      // Send a question as JSON
      socketRef.current.send(JSON.stringify({ 
        question: currentQuestion,
        session_id: storedSessionId 
      }));

      setChatLoading(true);
    };

    socketRef.current.onmessage = (event) => {
      flushSync(() => {
        if(!newMessageAppended){
          setChatHistory(prev => [...prev, botMessage]);
  
          setChatLoading(false);
  
          newMessageAppended = true;
        }
  
        const delta = event.data;
  
        console.log(delta);
      
        setChatHistory(prev => {
          const updated = [...prev];
          const lastIndex = updated.map(m => m.type).lastIndexOf('answer');
          if (lastIndex !== -1) {
            updated[lastIndex] = {
              ...updated[lastIndex],
              answer: updated[lastIndex].answer + delta
            };
          }
          return updated;
        });
      })
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

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

  const handleStoreVector = async () => {
    if (!fileContent) return;
    
    setStoringVector(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/store_vector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: fileContent.markdown,
          metadata: {
            source: `https://${selectedDomain.domain}${fileContent.uri}`,
            title: fileContent.title,
            author: "خزش شده",
            date: new Date(fileContent.created_at).toISOString().split('T')[0] // Get only the date part
          }
        })
      });

      if (!response.ok) {
        throw new Error('خطا در ذخیره در پایگاه داده برداری');
      }

      const data = await response.json();
      if (data.status === 'success') {
        // Show success message or handle as needed
        alert('فایل با موفقیت در پایگاه داده برداری ذخیره شد');
      } else {
        throw new Error('خطا در ذخیره در پایگاه داده برداری');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error storing vector:', err);
    } finally {
      setStoringVector(false);
    }
  };

  const handleCreateWizardFromWebsite = async (file) => {
    try {
      setSelectedWebsiteData({
        title: file.title,
        text: file.html
      });
      setActiveTab('wizard');
      setShowCreateWizard(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWizardSelect = (wizardData) => {
    setWizardMessage({
      type: 'wizard',
      title: wizardData.title,
      content: wizardData.context,
      timestamp: new Date()
    });
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleSaveContent = async () => {
    if (!selectedFile || !editorContent) return;
    
    setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${selectedFile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: editorContent
        })
      });

      if (!response.ok) {
        throw new Error('خطا در ذخیره محتوا');
      }

      // Update local state with new content
      setFileContent(prev => ({
        ...prev,
        html: editorContent
      }));

      // Show success message or handle as needed
      alert('محتوا با موفقیت ذخیره شد');
    } catch (err) {
      setError(err.message);
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  // Add new handler for manual knowledge submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualTitle.trim() || !manualText.trim()) {
      setError('لطفا عنوان و متن را وارد کنید');
      return;
    }

    setManualSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/store_vector`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: manualText,
          metadata: {
            source: 'manual',
            title: manualTitle
          }
        })
      });

      if (!response.ok) {
        throw new Error('خطا در ذخیره اطلاعات');
      }

      const data = await response.json();
      if (data.status === 'success') {
        alert('اطلاعات با موفقیت ذخیره شد');
        setManualTitle('');
        setManualText('');
      } else {
        throw new Error('خطا در ذخیره اطلاعات');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error storing manual knowledge:', err);
    } finally {
      setManualSubmitting(false);
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
      });

      if (!response.ok) {
        throw new Error('خطا در حذف منبع داده');
      }

      // Remove the deleted source from the state
      setSources(prev => prev.filter(source => source.source_id !== sourceId));
      alert('منبع داده با موفقیت حذف شد');
    } catch (err) {
      setError(err.message);
      console.error('Error deleting source:', err);
    } finally {
      setDeletingSource(null);
    }
  };

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

  const handleCrawledDocClick = (doc) => {
    setPreviousTab('add-knowledge');
    setSelectedFile({
      id: doc.id,
      title: doc.title,
      uri: doc.url
    });
    // Extract domain from doc.url (e.g., 'satia.co/')
    const domain = doc.url.split('/')[0];
    setSelectedDomain({ domain });
    setActiveTab('crawled-websites');
    fetchFileContent({
      id: doc.id,
      title: doc.title,
      uri: doc.url
    });
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div className="flex flex-col h-full">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('simple-chat')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'simple-chat'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            چت ساده
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            چت با منابع
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
            onClick={() => setActiveTab('add-knowledge')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'add-knowledge'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            افزودن دانش
          </button>
          <button
            onClick={() => setActiveTab('crawled-websites')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'crawled-websites'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            وب‌سایت‌های خزش شده
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'wizard'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            پاسخ‌های ویزارد
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {(() => {
            switch (activeTab) {
              case 'simple-chat':
                return (
                  <div className="flex flex-col h-full">
                    <WizardButtons onWizardSelect={handleWizardSelect} />
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                      {wizardMessage && (
                        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTimestamp(wizardMessage.timestamp)}
                            </span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              {wizardMessage.title}
                            </span>
                          </div>
                          <div className="mb-4">
                            <div 
                              className="text-gray-700 dark:text-white chat-message"
                              dangerouslySetInnerHTML={{ __html: wizardMessage.content }}
                            />
                          </div>
                        </div>
                      )}
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
                                <div 
                                  className="text-gray-800 dark:text-white chat-message"
                                  dangerouslySetInnerHTML={{ __html: item.text }}
                                />
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
                                  <div 
                                    className="text-gray-700 dark:text-white chat-message"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                  />
                                </div>
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
                      
                      <div ref={chatEndRef} />
                    </div>
                    
                    <form onSubmit={realtimeHandleSubmit} className="flex gap-2">
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
                                <div 
                                  className="text-gray-800 dark:text-white chat-message"
                                  dangerouslySetInnerHTML={{ __html: item.text }}
                                />
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
                                  <div 
                                    className="text-gray-700 dark:text-white chat-message"
                                    dangerouslySetInnerHTML={{ __html: item.answer }}
                                  />
                                </div>

                                {item.sources && item.sources.length > 0 && (
                                  <div>
                                    <h3 className="font-bold mb-2 text-sm text-gray-900 dark:text-white">منابع:</h3>
                                    <ul className="list-disc pl-4">
                                      {item.sources.map((source, sourceIndex) => (
                                        <li key={sourceIndex} className="mb-2">
                                          <div 
                                            className="text-sm text-gray-700 dark:text-white"
                                            dangerouslySetInnerHTML={{ __html: source.text }}
                                          />
                                          <a
                                            href={source.metadata.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
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
                        {editingSource ? (
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">ویرایش سند</h3>
                              <button
                                onClick={() => setEditingSource(null)}
                                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                بازگشت
                              </button>
                            </div>
                            <UpdateDataSource document_id={editingSource} />
                          </div>
                        ) : (
                          sources.map((source, index) => (
                            <div
                              key={source.source_id || index}
                              className="p-4 border rounded-lg dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                            >
                              <div className="flex flex-col">
                                <div className="flex justify-between items-start">
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
                                  <div className="flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSource(source.source_id);
                                      }}
                                      className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                                    >
                                      ویرایش
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSource(source.source_id);
                                      }}
                                      disabled={deletingSource === source.source_id}
                                      className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
                                    >
                                      {deletingSource === source.source_id ? (
                                        <div className="flex items-center">
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500 mr-2"></div>
                                          در حال حذف...
                                        </div>
                                      ) : (
                                        'حذف'
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  تعداد قطعات متن: {source.chunks ? source.chunks.length : 0}
                                </p>
                                <span className="text-xs text-blue-500">
                                  {expandedSourceId === (source.source_id || index) ? 'بستن' : 'مشاهده جزئیات'}
                                </span>
                              </div>
                              {expandedSourceId === (source.source_id || index) && source.chunks && source.chunks.length > 0 && (
                                <div className="mt-4 border-t pt-3 dark:border-gray-700">
                                  <h4 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">قطعات متن:</h4>
                                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 max-h-60 overflow-y-auto">
                                    {source.chunks.map((chunk, chunkIndex) => {
                                      const chunkKey = chunk.id || `chunk-${source.source_id || index}-${chunkIndex}`;
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
                                                    e.stopPropagation();
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
                                                    e.stopPropagation();
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
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        هیچ منبع داده‌ای یافت نشد
                      </div>
                    )}
                  </div>
                );

              case 'crawled-websites':
                return (
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        {selectedDomain ? 'فایل‌های دامنه' : 'دامنه‌های خزش شده'}
                      </h2>
                      <div className="flex items-center gap-4">
                        {selectedDomain && (
                          <button
                            onClick={handleBackClick}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                          >
                            بازگشت
                          </button>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          تعداد: {selectedDomain ? domainFiles.length : domains.length}
                        </span>
                      </div>
                    </div>
                    {filesLoading || domainsLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                        <p className="text-red-500 dark:text-red-400">{error}</p>
                        <button
                          onClick={selectedDomain ? () => fetchDomainFiles(selectedDomain) : fetchDomains}
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          تلاش مجدد
                        </button>
                      </div>
                    ) : selectedFile ? (
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            محتوای فایل
                          </h2>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={handleBackToFiles}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                              بازگشت
                            </button>
                          </div>
                        </div>
                        {fileContentLoading ? (
                          <div className="flex justify-center items-center p-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        ) : error ? (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                            <p className="text-red-500 dark:text-red-400">{error}</p>
                            <button
                              onClick={() => fetchFileContent(selectedFile)}
                              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                              تلاش مجدد
                            </button>
                          </div>
                        ) : fileContent ? (
                          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                  محتوای فایل
                                </h2>
                                <button
                                  onClick={handleStoreVector}
                                  disabled={storingVector}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {storingVector ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      در حال ذخیره...
                                    </>
                                  ) : (
                                    'ذخیره در پایگاه داده برداری'
                                  )}
                                </button>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">عنوان:</h3>
                                <p className="text-gray-700 dark:text-gray-300">{fileContent.title}</p>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">آدرس:</h3>
                                {selectedDomain ? (
                                  <a 
                                    href={`https://${selectedDomain.domain}${fileContent.uri}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                                  >
                                    {`https://${selectedDomain.domain}${fileContent.uri}`}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">بدون آدرس دامنه</span>
                                )}
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">HTML:</h3>
                                <div className="flex justify-between items-center mb-2">
                                  <button
                                    onClick={handleSaveContent}
                                    disabled={saving}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                                  >
                                    {saving ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        در حال ذخیره...
                                      </>
                                    ) : (
                                      'ذخیره تغییرات'
                                    )}
                                  </button>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg" dir="rtl">
                                  <ReactQuill
                                    theme="snow"
                                    value={editorContent}
                                    modules={modules}
                                    formats={formats}
                                    style={{ height: '400px', direction: 'rtl', textAlign: 'right' }}
                                    onChange={handleEditorChange}
                                  />
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Markdown:</h3>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    تعداد کاراکترها: {fileContent.markdown?.length || 0}
                                  </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                                  <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {fileContent.markdown || ''}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : selectedDomain && !selectedFile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {domainFiles.map((file) => (
                          <div
                            key={file.id}
                            onClick={() => handleFileClick(file)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                  {file.title}
                                </h3>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreateWizardFromWebsite(file);
                                  }}
                                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                                >
                                  ایجاد ویزارد
                                </button>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                <p>آدرس: <a href={`https://${selectedDomain.domain}${file.uri}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">{`https://${selectedDomain.domain}${file.uri}`}</a></p>
                                <p>تاریخ ایجاد: {new Date(file.created_at).toLocaleString('fa-IR')}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : domains.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {domains.map((domain) => (
                          <div
                            key={domain.id}
                            onClick={() => handleDomainClick(domain)}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
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
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                          هیچ دامنه خزش شده‌ای یافت نشد
                        </p>
                      </div>
                    )}
                  </div>
                );
                
              case 'wizard':
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">پاسخ‌های ویزارد</h2>
                      <button
                        onClick={() => {
                          setSelectedWebsiteData(null);
                          setShowCreateWizard(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        ایجاد ویزارد جدید
                      </button>
                    </div>
                    <WizardIndex />
                    {showCreateWizard && (
                      <CreateWizard 
                        onClose={() => {
                          setShowCreateWizard(false);
                          setSelectedWebsiteData(null);
                        }}
                        websiteData={selectedWebsiteData}
                      />
                    )}
                  </div>
                );

              case 'add-knowledge':
                return (
                  <div className="max-w-4xl mx-auto p-4">
                    {/* Nested Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                      <button
                        onClick={() => setAddKnowledgeTab('manual')}
                        className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                          addKnowledgeTab === 'manual'
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        افزودن دانش دستی
                      </button>
                      <button
                        onClick={() => setAddKnowledgeTab('crawl')}
                        className={`px-4 py-2 text-sm font-medium focus:outline-none ${
                          addKnowledgeTab === 'crawl'
                            ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        خزش وب‌سایت
                      </button>
                    </div>
                    {/* Tab Content */}
                    {addKnowledgeTab === 'manual' && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">افزودن دانش دستی</h2>
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              عنوان
                            </label>
                            <input
                              type="text"
                              id="title"
                              value={manualTitle}
                              onChange={(e) => setManualTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="عنوان دانش را وارد کنید"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              متن
                            </label>
                            <textarea
                              id="text"
                              value={manualText}
                              onChange={(e) => setManualText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="متن دانش را وارد کنید"
                              rows="6"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={manualSubmitting}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
                          >
                            {manualSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                در حال ذخیره...
                              </>
                            ) : (
                              'ذخیره دانش'
                            )}
                          </button>
                          {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                          )}
                        </form>
                      </div>
                    )}
                    {addKnowledgeTab === 'crawl' && (
                      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">خزش وب‌سایت</h2>
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
                                    onClick={() => handleCrawledDocClick(doc)}
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
                    )}
                  </div>
                );

              default:
                return null;
            }
          })()}
        </div>
      </div>
    </>
  );
};

export default Chat; 