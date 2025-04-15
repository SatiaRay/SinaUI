import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const translations = {
    fa: {
        loading: 'در حال بارگذاری...',
        passes: 'پاس های لوح نگهبانی',
        search: 'جستجو...',
        editPass: 'ویرایش پاس',
        createPass: 'ایجاد پاس جدید',
        passName: 'نام پاس',
        passTime: 'ساعت پاس',
        update: 'به‌روزرسانی',
        create: 'ایجاد',
        delete: 'حذف',
        cancel: 'انصراف',
        deleteConfirm: 'آیا از حذف این پاس مطمئن هستید؟',
        index: 'ردیف',
        name: 'نام',
        time: 'ساعت پاس',
        edit: 'ویرایش',
        errorFetch: 'خطا در دریافت لیست پاس‌ها',
        errorSave: 'خطا در ذخیره پاس',
        successUpdate: 'پاس با موفقیت به‌روزرسانی شد',
        successCreate: 'پاس با موفقیت ایجاد شد',
        successDelete: 'پاس با موفقیت حذف شد',
        errorDelete: 'خطا در حذف پاس',
        language: 'عربی'
    },
    ar: {
        loading: 'جاري التحميل...',
        passes: 'تصاريح الحراسة',
        search: 'بحث...',
        editPass: 'تعديل التصريح',
        createPass: 'إنشاء تصريح جديد',
        passName: 'اسم التصريح',
        passTime: 'وقت التصريح',
        update: 'تحديث',
        create: 'إنشاء',
        delete: 'حذف',
        cancel: 'إلغاء',
        deleteConfirm: 'هل أنت متأكد من حذف هذا التصريح؟',
        index: 'الرقم',
        name: 'الاسم',
        time: 'الوقت',
        edit: 'تعديل',
        errorFetch: 'خطأ في جلب قائمة التصاريح',
        errorSave: 'خطأ في حفظ التصريح',
        successUpdate: 'تم تحديث التصريح بنجاح',
        successCreate: 'تم إنشاء التصريح بنجاح',
        successDelete: 'تم حذف التصريح بنجاح',
        errorDelete: 'خطأ في حذف التصريح',
        language: 'فارسی'
    }
};

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute left-4 top-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

const PassList = () => {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPass, setEditingPass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [language, setLanguage] = useState('fa');
    const t = translations[language];

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const response = await axios.get('/api/passes');
            setPasses(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching passes:', error);
            toast.error(t.errorFetch);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPass) {
                await axios.put(`/api/passes/${editingPass.id}`, formData);
                toast.success(t.successUpdate);
            } else {
                await axios.post('/api/passes', formData);
                toast.success(t.successCreate);
            }
            setEditingPass(null);
            setIsModalOpen(false);
            setFormData({ name: '', code: '', description: '' });
            fetchPasses();
        } catch (error) {
            console.error('Error saving pass:', error);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).forEach(errors => {
                    errors.forEach(error => toast.error(error));
                });
            } else {
                toast.error(t.errorSave);
            }
        }
    };

    const handleEdit = (pass) => {
        setEditingPass(pass);
        setFormData({
            name: pass.name,
            code: pass.code,
            description: pass.description || ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t.deleteConfirm)) {
            try {
                await axios.delete(`/api/passes/${id}`);
                toast.success(t.successDelete);
                if (editingPass?.id === id) {
                    setEditingPass(null);
                    setIsModalOpen(false);
                }
                fetchPasses();
            } catch (error) {
                console.error('Error deleting pass:', error);
                toast.error(t.errorDelete);
            }
        }
    };

    const handleCloseModal = () => {
        setEditingPass(null);
        setIsModalOpen(false);
        setFormData({ name: '', code: '', description: '' });
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'fa' ? 'ar' : 'fa');
    };

    const filteredPasses = passes.filter(pass => 
        pass.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pass.description && pass.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return <div className="text-center py-4 text-gray-900 dark:text-gray-100">{t.loading}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {t.passes}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="mr-2 bg-green-500 text-white p-1 rounded-full text-xl leading-none hover:bg-green-600 focus:outline-none"
                        >
                            +
                        </button>
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {t.language}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t.search}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pr-8 pl-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                        />
                        <span className="absolute right-2 top-2.5">🔍</span>
                    </div>
                </div>

                <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                        {editingPass ? t.editPass : t.createPass}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t.passName}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t.passTime}
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    توضیحات
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2 space-x-reverse">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {editingPass ? t.update : t.create}
                            </button>
                            {editingPass && (
                                <button
                                    type="button"
                                    onClick={() => handleDelete(editingPass.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    {t.delete}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                {t.cancel}
                            </button>
                        </div>
                    </form>
                </Modal>

                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t.index}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t.name}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t.time}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    {t.edit}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPasses.map((pass, index) => (
                                <tr key={pass.id} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {pass.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {pass.code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleEdit(pass)}
                                            className="text-yellow-500 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
                                        >
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PassList;