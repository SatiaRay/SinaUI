import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import moment from 'moment-jalaali';
import axios from '../utils/axios';

const AddGuardLog = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stations, setStations] = useState([]);
    const [passes, setPasses] = useState([]);
    const [personnel, setPersonnel] = useState([]);
    const [selectedStation, setSelectedStation] = useState('');
    const [selectedPass, setSelectedPass] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment().format('jYYYY/jMM/jDD'));
    const [selectedPasses, setSelectedPasses] = useState({});

    // دریافت لیست ایستگاه‌ها و پاس‌ها
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [stationsResponse, passesResponse] = await Promise.all([
                    axios.get('/api/stations'),
                    axios.get('/api/passes')
                ]);

                console.log('Stations response:', stationsResponse.data);
                console.log('Passes response:', passesResponse.data);

                setStations(Array.isArray(stationsResponse.data) ? stationsResponse.data : []);
                setPasses(Array.isArray(passesResponse.data.data) ? passesResponse.data.data : []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('خطا در دریافت اطلاعات');
                setStations([]);
                setPasses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // دریافت لیست پرسنل بر اساس ایستگاه و پاس
    useEffect(() => {
        const fetchPersonnel = async () => {
            if (!selectedStation || !selectedPass) return;

            try {
                const response = await axios.get('/api/guard-logs/personnel', {
                    params: {
                        station_id: selectedStation,
                        pas_id: selectedPass
                    }
                });
                console.log('Personnel response:', response.data);
                setPersonnel(response.data);
            } catch (error) {
                console.error('Error fetching personnel:', error);
                toast.error('خطا در دریافت لیست پرسنل');
            }
        };

        fetchPersonnel();
    }, [selectedStation, selectedPass]);

    const handlePassToggle = (personnelId, pasId) => {
        setSelectedPasses(prev => {
            const current = prev[personnelId] || [];
            if (current.includes(pasId)) {
                return {
                    ...prev,
                    [personnelId]: current.filter(id => id !== pasId)
                };
            } else {
                return {
                    ...prev,
                    [personnelId]: [...current, pasId]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const personnelPasses = Object.entries(selectedPasses).flatMap(([personnelId, passes]) =>
            passes.map(pasId => ({
                personnel_id: parseInt(personnelId),
                pas_id: pasId,
                is_present: true
            }))
        );

        if (personnelPasses.length === 0) {
            toast.error('لطفاً حداقل یک پاس را انتخاب کنید');
            return;
        }

        try {
            await axios.post('/api/v1/guard-logs', {
                station_id: selectedStation,
                pas_id: selectedPass,
                log_date: moment(selectedDate, 'jYYYY/jMM/jDD').format('YYYY-MM-DD'),
                personnel_passes: personnelPasses
            });

            toast.success('لوح نگهبانی با موفقیت ثبت شد');
            navigate('/guard-logs');
        } catch (error) {
            console.error('Error creating guard log:', error);
            toast.error(error.response?.data?.message || 'خطا در ثبت لوح نگهبانی');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">ثبت لوح نگهبانی جدید</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                انتخاب ایستگاه
                            </label>
                            <select
                                value={selectedStation}
                                onChange={(e) => setSelectedStation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">انتخاب کنید</option>
                                {stations.map(station => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                انتخاب پاس
                            </label>
                            <select
                                value={selectedPass}
                                onChange={(e) => setSelectedPass(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                required
                            >
                                <option value="">انتخاب کنید</option>
                                {passes.map(pass => (
                                    <option key={pass.id} value={pass.id}>
                                        {pass.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاریخ
                            </label>
                            <input
                                type="text"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                placeholder="مثال: 1403/01/01"
                                required
                            />
                        </div>
                    </div>

                    {personnel.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">لیست پرسنل</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">نام و نام خانوادگی</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">12-7/30</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">17-12</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">22-17</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">01-22</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">04-01</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300">7/30-04</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {personnel.map((person) => (
                                            <tr key={person.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                    {person.name}
                                                </td>
                                                {person.pas.map((pas) => (
                                                    <td key={pas.id} className="px-6 py-4 whitespace-nowrap text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={(selectedPasses[person.id] || []).includes(pas.id)}
                                                            onChange={() => handlePassToggle(person.id, pas.id)}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/guard-logs')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            ذخیره
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGuardLog; 