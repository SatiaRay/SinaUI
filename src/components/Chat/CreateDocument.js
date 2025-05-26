import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

const CreateDocument = ({ onClose }) => {
    const [manualSubmitting, setManualSubmitting] = useState(false);
    const [manualTitle, setManualTitle] = useState('');
    const [manualText, setManualText] = useState('');
    const [error, setError] = useState(null);

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
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/add_manually_knowledge`, {
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
                if (onClose) onClose(); // Close the component after successful submission
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

    return <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 pb-12">
        <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-4'>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">ایجاد سند جدید</h2>
            </div>
            <button
                type="button"
                onClick={handleManualSubmit}
                disabled={manualSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
                {manualSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        در حال ذخیره...
                    </>
                ) : (
                    'ذخیره سند'
                )}
            </button>
        </div>
        <form className="space-y-4">
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
                    placeholder="عنوان سند را وارد کنید"
                    required
                />
            </div>
            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    متن
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-lg" dir="rtl">
                    <ReactQuill
                        theme="snow"
                        value={manualText}
                        modules={modules}
                        formats={formats}
                        style={{ height: '200px', direction: 'rtl', textAlign: 'right' }}
                        onChange={setManualText}
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
            )}
        </form>
    </div>;
};

export default CreateDocument; 