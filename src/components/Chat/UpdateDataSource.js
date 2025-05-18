import React, { useState, useEffect } from 'react';

const UpdateDataSource = (props) => {
    const { document_id } = props;
    const [documentData, setDocumentData] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchDocument();
    }, [document_id]);

    const fetchDocument = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/data_sources/${document_id}`);
            if (!response.ok) {
                throw new Error('خطا در دریافت اطلاعات سند');
            }
            const data = await response.json();
            setDocumentData(data);
            setEditedText(data.text || '');
        } catch (err) {
            setError(err.message);
            console.error('Error fetching document:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editedText.trim()) {
            setError('لطفا متن سند را وارد کنید');
            return;
        }

        setUpdating(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/data_sources/${document_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    document_id: document_id,
                    text: editedText
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
                <label htmlFor="document-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    متن سند
                </label>
                <textarea
                    id="document-text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                    placeholder="متن سند را وارد کنید"
                />
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