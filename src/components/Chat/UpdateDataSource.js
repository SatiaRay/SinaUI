import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UpdateDataSource = (props) => {
    const { document_id } = props;
    const [documentData, setDocumentData] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

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
        fetchDocument();
    }, [document_id]);

    const fetchDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/vector/${document_id}`);
            if (!response.ok) {
                throw new Error('خطا در دریافت اطلاعات سند');
            }
            const data = await response.json();
            setDocumentData(data);
            setEditedContent(data.html || '');
        } catch (err) {
            setError(err.message);
            console.error('Error fetching document:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editedContent.trim()) {
            setError('لطفا محتوای سند را وارد کنید');
            return;
        }

        setUpdating(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/documents/${documentData.id}?update_vector=true`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: documentData.title,
                    html: editedContent,
                    markdown: documentData.markdown,
                    uri: documentData.uri,
                    domain_id: documentData.domain_id
                })
            });

            if (!response.ok) {
                throw new Error('خطا در بروزرسانی سند');
            }

            alert('سند با موفقیت بروزرسانی شد');
        } catch (err) {
            setError(err.message);
            console.error('Error updating document:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <div className="text-red-500 mb-2">{error}</div>
                <button
                    onClick={fetchDocument}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    تلاش مجدد
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 min-h-0">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        عنوان سند
                    </label>
                    <input
                        type="text"
                        value={documentData?.title || ''}
                        onChange={(e) => setDocumentData({ ...documentData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    محتوای سند
                </label>
                <div className="h-[calc(100%-8rem)]">
                    <ReactQuill
                        theme="snow"
                        value={editedContent}
                        onChange={setEditedContent}
                        modules={modules}
                        formats={formats}
                        className="h-full"
                        style={{ height: 'calc(100% - 42px)' }}
                    />
                </div>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                >
                    {updating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            در حال بروزرسانی...
                        </>
                    ) : (
                        'بروزرسانی سند'
                    )}
                </button>
            </div>
        </div>
    );
};

export default UpdateDataSource;