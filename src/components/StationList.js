import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const StationList = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.get('http://localhost:8000/api/stations', { headers });
      setStations(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }
  };

  const handleViewStation = (station) => {
    setSelectedStation(station);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedStation(null);
  };

  const handleEditClick = (station) => {
    setSelectedStation(station);
    setEditFormData({
      name: station.name,
      address: station.address || '',
      phone: station.phone || ''
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:8000/api/stations/${selectedStation.id}`,
        editFormData,
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error updating station:', error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedStation(null);
    setEditFormData({
      name: '',
      address: '',
      phone: ''
    });
  };

  const handleDeleteStation = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/stations/${selectedStation.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting station:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {/* Add Station Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate('/stations/create')}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ثبت ایستگاه
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نام</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">آدرس</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تلفن</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stations.map((station) => (
                <tr key={station.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {station.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {station.address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {station.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-start gap-4">
                      <button
                        onClick={() => handleViewStation(station)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(station)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStation(station);
                          setEditDialogOpen(true);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      {viewDialogOpen && selectedStation && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseViewDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جزئیات ایستگاه</h2>
              <button
                onClick={handleCloseViewDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">نام</label>
                  <div className="input bg-gray-50">{selectedStation.name}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">آدرس</label>
                  <div className="input bg-gray-50">{selectedStation.address || '-'}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">تلفن</label>
                  <div className="input bg-gray-50">{selectedStation.phone || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseEditDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ویرایش ایستگاه</h2>
              <button
                onClick={handleCloseEditDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">نام</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">آدرس</label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">تلفن</label>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleDeleteStation}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  حذف
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white"
                >
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationList; 