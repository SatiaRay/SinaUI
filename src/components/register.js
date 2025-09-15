import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notify } from '../ui/toast';
import NetworkBackground3D from './NetworkBackground3D';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone
    ) {
      setError('لطفا تمام فیلدهای ضروری را پر کنید');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData);
      notify.success('ثبت نام انجام شد');
      navigate('/login');
    } catch (err) {
      setError(err.message);
      notify.error(err.message || 'خطا در ثبت نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center relative overflow-hidden w-full">
      <NetworkBackground3D />
      <div className="relative z-10 max-w-md w-full space-y-8 backdrop-blur-lg md:p-8 py-8 px-4 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          ایجاد حساب کاربری ادمین
        </h2>

        {error && (
          <div className="text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="نام"
                value={formData.first_name}
                onChange={handleChange}
              />
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="نام خانوادگی"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              dir="rtl"
              id="phone"
              name="phone"
              pattern="[0-9]{10,15}"
              type="text"
              className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
              placeholder="شماره تلفن"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 pr-10"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-50"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.272A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'ثبت نام'
              )}
            </button>

            <div className="text-center text-sm text-gray-400">
              قبلاً ثبت نام کرده‌اید؟{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                وارد شوید
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
