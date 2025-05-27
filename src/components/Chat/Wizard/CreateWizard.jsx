import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateWizard = ({ onClose, onWizardCreated, parent_id = null }) => {
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !context.trim()) {
            setError('لطفا تمام فیلدها را پر کنید');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.REACT_APP_PYTHON_APP_API_URL}/wizards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    context,
                    parent_id
                })
            });

            if (!response.ok) {
                throw new Error('خطا در ایجاد ویزارد');
            }

            const newWizard = await response.json();
            if (onWizardCreated) {
                onWizardCreated(newWizard);
            }
            onClose();
        } catch (err) {
            setError(err.message);
            console.error('Error creating wizard:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="flex min-h-full items-center justify-center p-4 text-center">
                <div className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-right shadow-xl transition-all">
                    <div className="absolute left-0 top-0 pl-4 pt-4">
                        <button
                            onClick={onClose}
                            className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <span className="sr-only">بستن</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="h-full overflow-y-auto">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">ایجاد ویزارد جدید</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    عنوان ویزارد
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="context" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    متن ویزارد
                                </label>
                                <div className="h-[calc(100%-8rem)]">
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={context}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            setContext(data);
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

                            {error && (
                                <div className="text-red-500 text-sm">{error}</div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            در حال ایجاد...
                                        </>
                                    ) : (
                                        'ایجاد ویزارد'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateWizard; 