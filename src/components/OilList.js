import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const OilList = () => {
    const [oils, setOils] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOils();
    }, []);

    const fetchOils = async () => {
        try {
            const response = await axios.get('/api/oils');
            setOils(response.data);
        } catch (error) {
            console.error('Error fetching oils:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این روغن اطمینان دارید؟')) {
            try {
                await axios.delete(`/api/oils/${id}`);
                fetchOils();
            } catch (error) {
                console.error('Error deleting oil:', error);
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">لیست روغن‌ها</h1>
                <button
                    onClick={() => navigate('/oils/create')}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    افزودن روغن جدید
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام روغن</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">کارخانه سازنده</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">حداکثر کیلومتر</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">کیلومتر پیشنهادی</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {oils.map((oil) => (
                            <tr key={oil.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{oil.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{oil.manufacturer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{oil.max_mileage}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{oil.recommended_change_mileage}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => navigate(`/oils/edit/${oil.id}`)}
                                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ml-4"
                                    >
                                        ویرایش
                                    </button>
                                    <button
                                        onClick={() => handleDelete(oil.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OilList; 