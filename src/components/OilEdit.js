import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const OilEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        manufacturer: '',
        max_mileage: '',
        recommended_change_mileage: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOil();
    }, [id]);

    const fetchOil = async () => {
        try {
            const response = await axios.get(`/api/oils/${id}`);
            setFormData(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching oil:', error);
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await axios.put(`/api/oils/${id}`, formData);
            navigate('/oils');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ submit: 'خطا در ویرایش روغن. لطفا دوباره تلاش کنید.' });
            }
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-200">ویرایش روغن</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            نام روغن
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            سازنده
                        </label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.manufacturer ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                        />
                        {errors.manufacturer && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.manufacturer}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            حداکثر کیلومتر مجاز
                        </label>
                        <input
                            type="number"
                            name="max_mileage"
                            value={formData.max_mileage}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.max_mileage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                        />
                        {errors.max_mileage && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.max_mileage}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            کیلومتر توصیه شده تعویض
                        </label>
                        <input
                            type="number"
                            name="recommended_change_mileage"
                            value={formData.recommended_change_mileage}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.recommended_change_mileage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                        />
                        {errors.recommended_change_mileage && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recommended_change_mileage}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            توضیحات
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200`}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/oils')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OilEdit; 