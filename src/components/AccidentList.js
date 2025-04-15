import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { EyeIcon, PencilIcon, TrashIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import moment from 'moment-jalaali';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import axios from 'axios';
import AccidentDetail from './AccidentDetail';
import { useNavigate } from 'react-router-dom';

const AccidentList = () => {
  const [accidents, setAccidents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [filters, setFilters] = useState({
    vehicle_id: '',
    driver_id: '',
    accident_type_id: '',
    search: '',
    date_from: '',
    date_to: '',
    location: ''
  });
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    accident_type_id: '',
    accident_datetime: '',
    location: '',
    description: '',
    images: [],
    newImages: []
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // تبدیل تاریخ‌ها به فرمت مناسب برای سرور
      const params = {
        page: pagination.current_page,
        vehicle_id: filters.vehicle_id,
        driver_id: filters.driver_id,
        accident_type_id: filters.accident_type_id,
        location: filters.location,
        search: filters.search,
        _t: new Date().getTime() // Add timestamp to prevent caching
      };

      // اضافه کردن تاریخ‌ها براساس شرایط مختلف
      if (filters.date_from && !filters.date_to) {
        // اگر فقط از تاریخ انتخاب شده باشد
        const date = new Date(filters.date_from);
        params.date_from = date.toISOString();
      } else if (!filters.date_from && filters.date_to) {
        // اگر فقط تا تاریخ انتخاب شده باشد
        const date = new Date(filters.date_to);
        params.date_to = date.toISOString();
      } else if (filters.date_from && filters.date_to) {
        // اگر هر دو تاریخ انتخاب شده باشند
        const fromDate = new Date(filters.date_from);
        const toDate = new Date(filters.date_to);
        params.date_from = fromDate.toISOString();
        params.date_to = toDate.toISOString();
      }

      const headers = {
        'Authorization': `Bearer ${token}`
      };

      console.log('Request params:', params);

      const [accidentsRes, vehiclesRes, driversRes, typesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/accidents', { params, headers }),
        axios.get('http://localhost:8000/api/vehicles?include=station', { headers }),
        axios.get('http://localhost:8000/api/drivers', { headers }),
        axios.get('http://localhost:8000/api/accident-types', { headers })
      ]);

      console.log('Accidents Response:', accidentsRes.data);
      console.log('Vehicles Response:', vehiclesRes.data);
      console.log('Drivers Response:', driversRes.data);
      console.log('Types Response:', typesRes.data);

      if (accidentsRes.data && accidentsRes.data.data) {
        accidentsRes.data.data.forEach(accident => {
          console.log('Accident:', accident);
          console.log('Driver:', accident.driver);
        });
        
        setAccidents(accidentsRes.data.data);
        setPagination({
          current_page: accidentsRes.data.current_page,
          last_page: accidentsRes.data.last_page,
          total: accidentsRes.data.total,
          per_page: accidentsRes.data.per_page
        });
      } else {
        console.error('Unexpected accidents data structure:', accidentsRes.data);
        setAccidents([]);
      }

      console.log('Setting drivers data:', driversRes.data);
      setVehicles(vehiclesRes.data || []);
      setDrivers(driversRes.data || []);
      setAccidentTypes(typesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }, [filters, pagination.current_page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({
      ...prev,
      current_page: 1
    }));
  };

  const handleDateFilterChange = (date, name) => {
    if (date) {
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = date.toDate();
      setFilters(prev => ({
        ...prev,
        [name]: gregorianDate.toISOString()
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setPagination(prev => ({
      ...prev,
      current_page: 1
    }));
  };

  const handlePageChange = (event, value) => {
    setPagination(prev => ({
      ...prev,
      current_page: value
    }));
  };

  const handleViewAccident = (accident) => {
    setSelectedAccident(accident);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedAccident(null);
  };

  const handleImageClick = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
    setCurrentImageIndex(0);
  };

  const handlePreviousImage = () => {
    if (selectedAccident && selectedAccident.images) {
      const newIndex = (currentImageIndex - 1 + selectedAccident.images.length) % selectedAccident.images.length;
      setCurrentImageIndex(newIndex);
      setSelectedImage(selectedAccident.images[newIndex]);
    }
  };

  const handleNextImage = () => {
    if (selectedAccident && selectedAccident.images) {
      const newIndex = (currentImageIndex + 1) % selectedAccident.images.length;
      setCurrentImageIndex(newIndex);
      setSelectedImage(selectedAccident.images[newIndex]);
    }
  };

  const handleEditClick = (accident) => {
    setSelectedAccident(accident);
    setEditFormData({
      vehicle_id: accident.vehicle_id,
      driver_id: accident.driver_id,
      accident_type_id: accident.accident_type_id,
      accident_datetime: new Date(accident.accident_datetime),
      location: accident.location,
      description: accident.description || '',
      images: accident.images || [],
      newImages: []
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

  const handleDateTimeChange = (e) => {
    const date = new Date(e.target.value);
    setEditFormData(prev => ({
      ...prev,
      accident_datetime: date
    }));
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const momentDate = moment(date);
    return momentDate.format('jYYYY/jMM/jDD HH:mm');
  };

  const handleNewImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const base64Images = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Images).then(images => {
      setEditFormData(prev => ({
        ...prev,
        newImages: [...(prev.newImages || []), ...images]
      }));
    }).catch(error => {
      console.error('Error converting images to base64:', error);
    });
  };

  const handleRemoveNewImage = (index) => {
    setEditFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveExistingImage = (imageId) => {
    setEditFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const formData = {
        vehicle_id: editFormData.vehicle_id,
        driver_id: editFormData.driver_id,
        accident_type_id: editFormData.accident_type_id,
        location: editFormData.location,
        description: editFormData.description || '',
        accident_datetime: editFormData.accident_datetime.toISOString()
      };

      if (editFormData.images && editFormData.images.length > 0) {
        formData.existing_images = editFormData.images.map(image => image.id);
      }

      if (editFormData.newImages && editFormData.newImages.length > 0) {
        formData.images = editFormData.newImages;
      }

      console.log('Form Data:', formData);

      const response = await axios.put(
        `http://localhost:8000/api/accidents/${selectedAccident.id}`,
        formData,
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
      console.error('Error updating accident:', error);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
      }
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedAccident(null);
    setEditFormData({
      vehicle_id: '',
      driver_id: '',
      accident_type_id: '',
      accident_datetime: '',
      location: '',
      description: '',
      images: [],
      newImages: []
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return moment(date).format('jYYYY/jMM/jDD HH:mm');
  };

  const handleDeleteAccident = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/accidents/${selectedAccident.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEditDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting accident:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        {/* Add Accident Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate('/accidents/create')}
            className="btn bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            ثبت تصادف
          </button>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            name="vehicle_id"
            value={filters.vehicle_id}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <option value="">انتخاب خودرو</option>
            {vehicles.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate_number} - {vehicle.model}
              </option>
            ))}
          </select>

          <select
            name="driver_id"
            value={filters.driver_id}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <option value="">انتخاب راننده</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>

          <select
            name="accident_type_id"
            value={filters.accident_type_id}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <option value="">نوع تصادف</option>
            {accidentTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="جستجو بر اساس مکان"
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />

          <DatePicker
            value={filters.date_from}
            onChange={(date) => handleDateFilterChange(date, 'date_from')}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="از تاریخ"
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />

          <DatePicker
            value={filters.date_to}
            onChange={(date) => handleDateFilterChange(date, 'date_to')}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            placeholder="تا تاریخ"
            className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">خودرو</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">راننده</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">نوع تصادف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">تاریخ و زمان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">مکان</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {accidents.map((accident) => (
                <tr 
                  key={accident.id} 
                  className="md:table-row flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => handleViewAccident(accident)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 md:table-cell block">
                    <span className="md:hidden font-bold ml-2">خودرو:</span>
                    {accident.vehicle?.plate_number} - {accident.vehicle?.model} ({accident.vehicle?.color}) - {accident.vehicle?.station?.name || 'بدون ایستگاه'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 md:table-cell block">
                    <span className="md:hidden font-bold ml-2">راننده:</span>
                    {accident.driver?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 md:table-cell block">
                    <span className="md:hidden font-bold ml-2">نوع تصادف:</span>
                    {accident.accident_type?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 md:table-cell block">
                    <span className="md:hidden font-bold ml-2">تاریخ و زمان:</span>
                    {formatDate(accident.accident_datetime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 md:table-cell block">
                    <span className="md:hidden font-bold ml-2">مکان:</span>
                    {accident.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium md:table-cell block">
                    <div className="flex justify-center md:justify-start gap-4" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewAccident(accident);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span className="md:hidden mr-1">نمایش</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(accident);
                        }}
                        className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 flex items-center"
                      >
                        <PencilIcon className="h-5 w-5" />
                        <span className="md:hidden mr-1">ویرایش</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span className="md:hidden mr-1">حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="mt-4 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(null, Math.max(1, pagination.current_page - 1))}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              قبلی
            </button>
            <span className="text-gray-900 dark:text-gray-100">
              صفحه {pagination.current_page} از {pagination.last_page}
            </span>
            <button
              onClick={() => handlePageChange(null, Math.min(pagination.last_page, pagination.current_page + 1))}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              بعدی
            </button>
          </nav>
        </div>
      </div>

      {/* Detail Dialog */}
      {viewDialogOpen && (
        <AccidentDetail
          accident={selectedAccident}
          onClose={handleCloseDialog}
        />
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={handleCloseEditDialog} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">ویرایش حادثه</h2>
              <button
                onClick={handleCloseEditDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="form-group">
                <label className="form-label">وسیله نقلیه</label>
                <select
                  value={editFormData.vehicle_id}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, vehicle_id: e.target.value }))}
                  className="select"
                >
                  <option value="">انتخاب کنید</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate_number} - {vehicle.model} ({vehicle.color}) - {vehicle.station?.name || 'بدون ایستگاه'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">راننده</label>
                <select
                  value={editFormData.driver_id}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, driver_id: e.target.value }))}
                  className="select"
                >
                  <option value="">انتخاب کنید</option>
                  {drivers.map(driver => {
                    console.log('Driver option:', driver);
                    return (
                      <option key={driver.id} value={driver.id}>
                        {driver.name || `${driver.first_name || ''} ${driver.last_name || ''}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">نوع حادثه</label>
                <select
                  value={editFormData.accident_type_id}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, accident_type_id: e.target.value }))}
                  className="select"
                >
                  <option value="">انتخاب کنید</option>
                  {accidentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">تاریخ و زمان</label>
                <DatePicker
                  value={editFormData.accident_datetime}
                  onChange={(date) => {
                    if (date) {
                      const gregorianDate = date.toDate();
                      setEditFormData(prev => ({
                        ...prev,
                        accident_datetime: gregorianDate
                      }));
                    }
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  calendarPosition="bottom-right"
                  format="YYYY/MM/DD HH:mm"
                  plugins={[
                    {
                      type: 'time',
                      position: 'bottom'
                    }
                  ]}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div className="form-group">
                <label className="form-label">مکان</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">توضیحات</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="input"
                  rows="3"
                />
              </div>

              <div className="mt-4">
                <label className="form-label">تصاویر</label>
                <div className="grid grid-cols-4 gap-4">
                  {editFormData.images?.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`http://localhost:8000/storage/${image.image_path}`}
                        alt={`تصویر ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(image.id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {editFormData.newImages?.map((image, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`تصویر جدید ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-center">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg p-2 flex items-center justify-center w-24 h-24">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleNewImageUpload}
                        className="hidden"
                      />
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                حذف
              </button>
              <div className="flex space-x-2 space-x-reverse">
                <button
                  onClick={handleCloseEditDialog}
                  className="btn btn-secondary"
                >
                  انصراف
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="btn btn-primary"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="dialog">
          <div className="dialog-overlay" onClick={() => setShowDeleteConfirm(false)} />
          <div className="dialog-content">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">تایید حذف</h2>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="mb-6">آیا مطمئن هستید که می‌خواهید گزارش این تصادف را حذف کنید؟</p>
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  handleDeleteAccident();
                  setShowDeleteConfirm(false);
                }}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccidentList; 