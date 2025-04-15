import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RoleCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/roles',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      navigate('/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      alert('خطا در ثبت نقش');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">ثبت نقش جدید</h1>
          <button
            onClick={() => navigate('/roles')}
            className="btn bg-gray-500 hover:bg-gray-600 text-white"
          >
            بازگشت
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">نام</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input text-gray-900 dark:text-gray-200"
              required
            />
            <p className="text-sm text-gray-500 mt-1">نام فنی نقش (به انگلیسی)</p>
          </div>

          <div className="form-group">
            <label className="form-label">نام نمایشی</label>
            <input
              type="text"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              className="input text-gray-900 dark:text-gray-200"
              required
            />
            <p className="text-sm text-gray-500 mt-1">نام فارسی نقش</p>
          </div>

          <div className="form-group">
            <label className="form-label">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'در حال ثبت...' : 'ثبت نقش'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleCreate; 