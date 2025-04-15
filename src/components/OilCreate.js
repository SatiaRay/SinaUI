import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const OilCreate = () => {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            // Convert string values to integers for numeric fields
            const dataToSubmit = {
                ...formData,
                max_mileage: parseInt(formData.max_mileage, 10),
                recommended_change_mileage: parseInt(formData.recommended_change_mileage, 10)
            };

            await axios.post('/api/oils', dataToSubmit);
            navigate('/oils');
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error creating oil:', error);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">افزودن روغن جدید</h1>
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
                            نام روغن
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name[0]}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="manufacturer">
                            کارخانه سازنده
                        </label>
                        <input
                            type="text"
                            id="manufacturer"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.manufacturer ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.manufacturer && <p className="text-red-500 text-xs italic">{errors.manufacturer[0]}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="max_mileage">
                            حداکثر کیلومتر کارکرد
                        </label>
                        <input
                            type="number"
                            id="max_mileage"
                            name="max_mileage"
                            value={formData.max_mileage}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.max_mileage ? 'border-red-500' : ''}`}
                            required
                            min="0"
                        />
                        {errors.max_mileage && <p className="text-red-500 text-xs italic">{errors.max_mileage[0]}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="recommended_change_mileage">
                            کیلومتر پیشنهادی تعویض
                        </label>
                        <input
                            type="number"
                            id="recommended_change_mileage"
                            name="recommended_change_mileage"
                            value={formData.recommended_change_mileage}
                            onChange={handleChange}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.recommended_change_mileage ? 'border-red-500' : ''}`}
                            required
                            min="0"
                        />
                        {errors.recommended_change_mileage && <p className="text-red-500 text-xs italic">{errors.recommended_change_mileage[0]}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                            توضیحات
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="3"
                        />
                        {errors.description && <p className="text-red-500 text-xs italic">{errors.description[0]}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/oils')}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OilCreate; 