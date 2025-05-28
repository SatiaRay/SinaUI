import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const ModifyDocument = ({ fileContent: initialFileContent, selectedFile: initialSelectedFile, selectedDomain: initialSelectedDomain, onBack }) => {
    const [fileContent, setFileContent] = useState(initialFileContent);
    const [selectedFile, setSelectedFile] = useState(initialSelectedFile);
    const [selectedDomain, setSelectedDomain] = useState(initialSelectedDomain);
    const [storingVector, setStoringVector] = useState(false);
    const [error, setError] = useState(null);
    const [vectorizationStatus, setVectorizationStatus] = useState(null);
    const socketRef = useRef(null);
    const [ckEditorContent, setCkEditorContent] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
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
        if (fileContent?.html) {
            console.log('change');

            setCkEditorContent(fileContent.html);
        }
    }, [fileContent]);

    const connectToVectorizationSocket = (jobId) => {
        const url = new URL(process.env.REACT_APP_PYTHON_APP_API_URL);
        const wsUrl = `ws://${url.hostname}:${url.port}/ws/documents/vectorize/${jobId}`;

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log(`Connected to vectorization socket: ${jobId}`);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.event) {
                    case 'change_progress':
                        handleProgressChange(data);
                        break;
                    case 'finished':
                        handleVectorizationFinished(data);
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
            console.log(`Vectorization socket closed: ${jobId}`);
        };

        socketRef.current = socket;
    };

    const handleProgressChange = (data) => {
        const progressMsg = data.progress?.msg || '';
        setVectorizationStatus({
            status: data.status,
            message: progressMsg
        });
    };

    const handleVectorizationFinished = (data) => {
        setVectorizationStatus({
            status: 'finished',
            message: 'تکمیل شده'
        });
        setStoringVector(false);
        alert('سند با موفقیت در پایگاه دانش هوش مصنوعی ذخیره شد');
    };

    const handleStoreVector = async () => {
        if (!fileContent || !selectedFile) return;

        setStoringVector(true);
        setError(null);
        try {
            // First, vectorize the document
            const vectorizeResponse = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${selectedFile.id}/vectorize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    html: ckEditorContent,
                    metadata: {
                        source: `https://${selectedDomain.domain}${fileContent.uri}`,
                        title: fileContent.title,
                        author: "خزش شده",
                        date: new Date(fileContent.created_at).toISOString().split('T')[0]
                    }
                })
            });

            if (!vectorizeResponse.ok) {
                throw new Error('خطا در ذخیره در پایگاه داده برداری');
            }

            const vectorizeData = await vectorizeResponse.json();
            if (!vectorizeData.job_id) {
                throw new Error('خطا در ذخیره در پایگاه داده برداری');
            }

            // Connect to vectorization WebSocket
            connectToVectorizationSocket(vectorizeData.job_id);

        } catch (err) {
            setError(err.message);
            console.error('Error in vectorization process:', err);
            setStoringVector(false);
        }
    };

    const getButtonText = () => {
        if (!storingVector) return 'ذخیره در پایگاه داده برداری';

        if (!vectorizationStatus) return 'در حال ارسال...';

        switch (vectorizationStatus.status) {
            case 'started':
                if (vectorizationStatus.message.includes('Queued')) {
                    return 'در صف پردازش';
                } else if (vectorizationStatus.message.includes('html to markdown')) {
                    return 'درحال آماده سازی';
                } else if (vectorizationStatus.message.includes('Storing data')) {
                    return 'در حال ذخیره در پایگاه داده';
                }
                return 'در حال پردازش';
            case 'finished':
                return 'تکمیل شده';
            default:
                return 'در حال پردازش';
        }
    };

    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, []);


    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 min-h-0 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        محتوای فایل
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleStoreVector}
                            disabled={storingVector}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
                        >
                            {storingVector ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {getButtonText()}
                                </>
                            ) : (
                                'ذخیره در پایگاه داده برداری'
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">عنوان:</h3>
                        <p className="text-gray-700 dark:text-gray-300">{fileContent.title}</p>
                    </div>
                    <div className="mt-4">
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
                  
                    <div className="mt-8 flex-1 min-h-0 flex flex-col">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">CKEditor:</h3>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <CKEditor
                                editor={ClassicEditor}
                                data={ckEditorContent}
                                onChange={(event, editor) => {
                                    console.log('change change');
                                    const data = editor.getData();
                                    setCkEditorContent(data);
                                }}
                                config={{
                                    language: 'fa',
                                    direction: 'rtl',
                                    toolbar: {
                                        items: [
                                            'heading',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            '|',
                                            'outdent',
                                            'indent',
                                            '|',
                                            'insertTable',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                    table: {
                                        contentToolbar: [
                                            'tableColumn',
                                            'tableRow',
                                            'mergeTableCells',
                                            'tableProperties',
                                            'tableCellProperties'
                                        ],
                                        defaultProperties: {
                                            borderWidth: '1px',
                                            borderColor: '#ccc',
                                            borderStyle: 'solid',
                                            alignment: 'right'
                                        }
                                    },
                                    htmlSupport: {
                                        allow: [
                                            {
                                                name: 'table',
                                                attributes: true,
                                                classes: true,
                                                styles: true
                                            },
                                            {
                                                name: 'tr',
                                                attributes: true,
                                                classes: true,
                                                styles: true
                                            },
                                            {
                                                name: 'td',
                                                attributes: true,
                                                classes: true,
                                                styles: true
                                            },
                                            {
                                                name: 'th',
                                                attributes: true,
                                                classes: true,
                                                styles: true
                                            }
                                        ]
                                    }
                                }}
                                style={{ direction: 'rtl', textAlign: 'right' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModifyDocument;