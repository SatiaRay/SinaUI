import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api'; // فرض می‌کنیم api.js در پوشه utils است

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'admin@example.com',
    password: '123456789',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData.email, formData.password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/chat');
      } else {
        setError('خطا در دریافت توکن');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              ورود به سیستم
            </h2>
          </div>
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  ایمیل
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="ایمیل"
                    value={formData.email}
                    onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  رمز عبور
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                    placeholder="رمز عبور"
                    value={formData.password}
                    onChange={handleChange}
                />
              </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {loading ? 'در حال ورود...' : 'ورود'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Login;