import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    plate_number: '',
    model: '',
    color: '',
    station_id: ''
  });
  const [stations, setStations] = useState([]);
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

      const [vehiclesRes, stationsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/vehicles?include=station', { headers }),
        axios.get('http://localhost:8000/api/stations', { headers })
      ]);

      setVehicles(vehiclesRes.data || []);
      setStations(stationsRes.data || []);
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

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedVehicle(null);
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditFormData({
      plate_number: vehicle.plate_number,
      model: vehicle.model,
      color: vehicle.color,
      station_id: vehicle.station_id || ''
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
        `http://localhost:8000/api/vehicles/${selectedVehicle.id}`,
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
      console.error('Error updating vehicle:', error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedVehicle(null);
    setEditFormData({
      plate_number: '',
      model: '',
      color: '',
      station_id: ''
    });
  };

  const handleDeleteVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/vehicles/${selectedVehicle.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
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
        {/* Add Vehicle Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate('/vehicles/create')}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ثبت خودرو
          </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 hidden md:table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">شماره پلاک</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">مدل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">رنگ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ایستگاه</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {vehicle.plate_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {vehicle.color}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {vehicle.station?.name || 'بدون ایستگاه'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-start gap-4">
                      <button
                        onClick={() => handleViewVehicle(vehicle)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditClick(vehicle)}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
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

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">شماره پلاک:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{vehicle.plate_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">مدل:</span>
                    <span className="text-gray-900 dark:text-gray-100">{vehicle.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">رنگ:</span>
                    <span className="text-gray-900 dark:text-gray-100">{vehicle.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">ایستگاه:</span>
                    <span className="text-gray-900 dark:text-gray-100">{vehicle.station?.name || 'بدون ایستگاه'}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => handleViewVehicle(vehicle)}
                    className="flex items-center text-blue-600 dark:text-blue-400"
                  >
                    <EyeIcon className="h-5 w-5 ml-1" />
                    <span>مشاهده</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(vehicle)}
                    className="flex items-center text-yellow-600 dark:text-yellow-400"
                  >
                    <PencilIcon className="h-5 w-5 ml-1" />
                    <span>ویرایش</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setEditDialogOpen(true);
                    }}
                    className="flex items-center text-red-600 dark:text-red-400"
                  >
                    <TrashIcon className="h-5 w-5 ml-1" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Dialog */}
      {viewDialogOpen && selectedVehicle && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseViewDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">جزئیات خودرو</h2>
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
                  <label className="form-label">شماره پلاک</label>
                  <div className="input bg-gray-50">{selectedVehicle.plate_number}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">مدل</label>
                  <div className="input bg-gray-50">{selectedVehicle.model}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">رنگ</label>
                  <div className="input bg-gray-50">{selectedVehicle.color}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">ایستگاه</label>
                  <div className="input bg-gray-50">{selectedVehicle.station?.name || 'بدون ایستگاه'}</div>
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
              <h2 className="text-xl font-semibold">ویرایش خودرو</h2>
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
                <label className="form-label">شماره پلاک</label>
                <input
                  type="text"
                  name="plate_number"
                  value={editFormData.plate_number}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">مدل</label>
                <input
                  type="text"
                  name="model"
                  value={editFormData.model}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">رنگ</label>
                <input
                  type="text"
                  name="color"
                  value={editFormData.color}
                  onChange={handleEditFormChange}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">ایستگاه</label>
                <select
                  name="station_id"
                  value={editFormData.station_id}
                  onChange={handleEditFormChange}
                  className="select"
                >
                  <option value="">بدون ایستگاه</option>
                  {stations.map(station => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={handleDeleteVehicle}
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

export default VehicleList; 