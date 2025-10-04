import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notify } from '../ui/toast';
import NetworkBackground3D from './NetworkBackground2D';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    repeat_password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleRepeatPasswordVisibility = () =>
    setShowRepeatPassword((prev) => !prev);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'نام الزامی است';
    if (!formData.last_name.trim())
      newErrors.last_name = 'نام خانوادگی الزامی است';

    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!formData.phone) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن معتبر نیست (11 رقم و با 09 شروع شود)';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    } else if (
      !/[0-9]/.test(formData.password) ||
      !/[A-Za-z]/.test(formData.password)
    ) {
      newErrors.password = 'رمز عبور باید شامل حروف و عدد باشد';
    }

    if (formData.password !== formData.repeat_password) {
      newErrors.repeat_password = 'تکرار رمز عبور با رمز عبور یکسان نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await register(formData);

      if (res?.status === 200 || res?.success) {
        notify.success('ثبت نام انجام شد');
        navigate('/login');
        return;
      }

      if (res?.fieldErrors && Object.keys(res.fieldErrors).length > 0) {
        const serverErrors = {};
        Object.entries(res.fieldErrors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages)
            ? messages.join(', ')
            : String(messages);
        });
        setErrors(serverErrors);
        const firstFieldMsg = Object.values(serverErrors)[0];
        notify.error(firstFieldMsg || res.error || 'ثبت نام ناموفق بود');
        return;
      }

      if (res?.error || res?.message) {
        notify.error(res.error || res.message);
        return;
      }

      notify.error('ثبت نام ناموفق بود');
    } catch (err) {
      const serverErr = err?.response?.data;
      if (serverErr?.errors) {
        const serverErrors = {};
        Object.entries(serverErr.errors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages)
            ? messages.join(', ')
            : String(messages);
        });
        setErrors(serverErrors);
        notify.error(Object.values(serverErrors)[0]);
      } else {
        notify.error(
          err?.response?.data?.message ||
            err?.message ||
            'خطای غیرمنتظره در ثبت نام'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 flex items-center justify-center relative overflow-hidden w-full register-local">
      <style>{`
        .register-local input[type="password"] {
          -webkit-appearance: none;
          appearance: none;
        }
        .register-local input[type="password"]::-ms-clear,
        .register-local input[type="password"]::-ms-reveal {
          display: none;
          width: 0;
          height: 0;
        }
        .register-local input[type="password"]::-webkit-textfield-decoration-container {
          display: none !important;
        }
        .register-local input[type="password"]::-webkit-password-toggle-button,
        .register-local input[type="password"]::-webkit-credentials-auto-fill-button {
          display: none !important;
        }
      `}</style>

      <NetworkBackground3D />
      <div className="relative z-10 max-w-md w-full space-y-8 backdrop-blur-lg md:p-8 py-8 px-4 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          ایجاد حساب کاربری ادمین
        </h2>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-1/2">
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="نام"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  placeholder="نام خانوادگی"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="ایمیل"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                id="phone"
                name="phone"
                dir="rtl"
                type="text"
                autoComplete="tel"
                className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="شماره تلفن"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="appearance-none block w-full px-4 py-2 pr-10 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
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
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                id="repeat_password"
                name="repeat_password"
                type={showRepeatPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className="appearance-none block w-full px-4 py-2 pr-10 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                placeholder="تکرار رمز عبور"
                value={formData.repeat_password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleRepeatPasswordVisibility}
              >
                {showRepeatPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.repeat_password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.repeat_password}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
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
