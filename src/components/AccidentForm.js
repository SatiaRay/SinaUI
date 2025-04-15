import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import axios from 'axios';

const AccidentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicle_id: '',
    driver_id: '',
    accident_type_id: '',
    accident_datetime: new Date(),
    location: '',
    description: '',
    images: []
  });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [accidentTypes, setAccidentTypes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      const [vehiclesRes, driversRes, typesRes] = await Promise.all([
        axios.get('http://localhost:8000/api/vehicles', { headers }),
        axios.get('http://localhost:8000/api/drivers', { headers }),
        axios.get('http://localhost:8000/api/accident-types', { headers })
      ]);

      setVehicles(vehiclesRes.data || []);
      setDrivers(driversRes.data || []);
      setAccidentTypes(typesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        accident_datetime: date.toDate()
      }));
    }
  };

  const handleImageUpload = (event) => {
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
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images]
      }));
    }).catch(error => {
      console.error('Error converting images to base64:', error);
    });
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('vehicle_id', formData.vehicle_id);
      formDataToSend.append('driver_id', formData.driver_id);
      formDataToSend.append('accident_type_id', formData.accident_type_id);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('accident_datetime', formData.accident_datetime.toISOString());

      // Add images
      formData.images.forEach((image, index) => {
        // Convert base64 to blob
        const base64Data = image.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        
        const blob = new Blob(byteArrays, { type: 'image/jpeg' });
        formDataToSend.append(`images[${index}]`, blob, `image${index}.jpg`);
      });

      const response = await axios.post(
        'http://localhost:8000/api/accidents',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Create response:', response.data);
      navigate('/accidents');
    } catch (error) {
      console.error('Error creating accident:', error);
      if (error.response?.data?.errors) {
        console.error('Validation errors:', error.response.data.errors);
        setError('لطفاً تمام فیلدهای الزامی را پر کنید');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">ثبت حادثه جدید</h2>
            <button
              onClick={() => navigate('/accidents')}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label className="form-label">وسیله نقلیه</label>
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="">انتخاب کنید</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.plate_number} - {vehicle.model} ({vehicle.color}) - {vehicle.station?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">راننده</label>
              <select
                name="driver_id"
                value={formData.driver_id}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="">انتخاب کنید</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name || `${driver.first_name || ''} ${driver.last_name || ''}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">نوع حادثه</label>
              <select
                name="accident_type_id"
                value={formData.accident_type_id}
                onChange={handleChange}
                className="select"
                required
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
                calendar={persian}
                locale={persian_fa}
                value={formData.accident_datetime}
                onChange={handleDateChange}
                format="YYYY/MM/DD HH:mm"
                plugins={[
                  {
                    type: 'TimePicker',
                    position: 'bottom',
                    format: 'HH:mm'
                  }
                ]}
                className="input w-full"
                calendarPosition="bottom-right"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">مکان</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">توضیحات</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input"
                rows="3"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">تصاویر</label>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`تصویر ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
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
                      onChange={handleImageUpload}
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

          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={() => navigate('/accidents')}
              className="btn btn-secondary"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              ثبت حادثه
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccidentForm; 