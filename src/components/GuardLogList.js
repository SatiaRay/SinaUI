import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment-jalaali';
import { useNavigate } from 'react-router-dom';

const GuardLogList = () => {
    const [guardLogs, setGuardLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    });
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchGuardLogs(1);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).format('jYYYY/jMM/jDD');
    };

    const fetchGuardLogs = async (page = 1) => {
        try {
            const response = await axios.get(`/api/guard-logs?page=${page}`);
            console.log('Guard logs response:', response.data);
            setGuardLogs(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total,
                perPage: response.data.per_page
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching guard logs:', error);
            toast.error('خطا در دریافت لیست لوح‌های نگهبانی');
            setGuardLogs([]);
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        fetchGuardLogs(page);
    };

    const handleViewDetails = (log) => {
        console.log('Viewing details for log:', log);
        setSelectedLog(log);
        setShowDetailsModal(true);
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedLog(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={() => navigate('/guard-logs/create')}
                >
                    ثبت لوح جدید
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاریخ</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ایستگاه</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">شیفت</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تعداد پرسنل</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ثبت کننده</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {guardLogs.length > 0 ? (
                                guardLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{formatDate(log.log_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.station.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.shift.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.guard_log_passes.length}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{log.personnel.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 ml-4"
                                                onClick={() => handleViewDetails(log)}
                                            >
                                                مشاهده
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                onClick={() => {/* TODO: Delete */}}
                                            >
                                                حذف
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                        هیچ لوح نگهبانی یافت نشد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.lastPage > 1 && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                قبلی
                            </button>
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.lastPage}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                بعدی
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    نمایش <span className="font-medium">{pagination.total > 0 ? (pagination.currentPage - 1) * pagination.perPage + 1 : 0}</span> تا{' '}
                                    <span className="font-medium">{Math.min(pagination.currentPage * pagination.perPage, pagination.total)}</span> از{' '}
                                    <span className="font-medium">{pagination.total}</span> نتیجه
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        <span className="sr-only">قبلی</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {[...Array(pagination.lastPage)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                pagination.currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-200'
                                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.lastPage}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        <span className="sr-only">بعدی</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for viewing details */}
            {showDetailsModal && selectedLog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">جزئیات لوح نگهبانی</h2>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">اطلاعات کلی</h3>
                                <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">تاریخ:</span> {formatDate(selectedLog.log_date)}</p>
                                <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">ایستگاه:</span> {selectedLog.station.name}</p>
                                <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">شیفت:</span> {selectedLog.shift.name}</p>
                                <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">ثبت کننده:</span> {selectedLog.personnel.name}</p>
                            </div>
                            
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">آمار</h3>
                                <p className="text-gray-600 dark:text-gray-400"><span className="font-medium">تعداد کل پرسنل:</span> {selectedLog.guard_log_passes.length}</p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">حاضر:</span> {
                                        selectedLog.guard_log_passes.filter(pass => pass.is_present).length
                                    }
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">غایب:</span> {
                                        selectedLog.guard_log_passes.filter(pass => !pass.is_present).length
                                    }
                                </p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">لیست پرسنل</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100 dark:bg-gray-600">
                                        <tr>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">نام پرسنل</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">پاس</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">وضعیت</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {selectedLog.guard_log_passes.map((pass, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{pass.personnel.name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{pass.pas.name}</td>
                                                <td className="px-4 py-2 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${pass.is_present ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                                                        {pass.is_present ? 'حاضر' : 'غایب'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                بستن
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuardLogList; 