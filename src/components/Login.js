import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import NetworkBackground3D from './NetworkBackground2D';

const Login = () => {
  const { login: authLogin, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat', { replace: true });
    }
  }, [user, navigate]);

  // پاک‌سازی ورودی ایمیل: حذف فاصله‌ها، ویرگول فارسی و کاراکترهای علامت‌گذاری راست‌به‌چپ
  const sanitizeEmail = (value) => {
    if (!value) return value;
    // حذف ویرگول فارسی (،) و فاصله و کاراکترهای جهت‌دهی ونال‌سپیس
    return String(value).replace(/[\u200E\u200F\s،\u060C]/g, '');
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'email') {
      value = sanitizeEmail(value);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateEmail = (email) => {
    // regex استاندارد پایه‌ای برای ایمیل (ساده و قابل اعتماد برای client-side)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side validation (ما از native validation مرورگر استفاده نمی‌کنیم)
    const newErrors = {};
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    else if (!validateEmail(formData.email))
      newErrors.email = 'ایمیل معتبر نیست';

    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await authLogin(formData.email, formData.password);

      if (res && typeof res === 'object') {
        if (res.success === false) {
          if (res.fieldErrors && Object.keys(res.fieldErrors).length > 0) {
            const serverErrors = {};
            Object.entries(res.fieldErrors).forEach(([field, messages]) => {
              serverErrors[field] = Array.isArray(messages)
                ? messages.join(', ')
                : String(messages);
            });
            setErrors(serverErrors);
            return;
          }

          if (res.error) {
            setErrors({ general: res.error });
            return;
          }

          setErrors({
            general: 'ورود ناموفق بود. لطفاً اطلاعات را بررسی کنید.',
          });
          return;
        }

        // موفق: AuthContext ست می‌کند و useEffect ریدایرکت می‌کند
        return;
      }

      // اگر authLogin رفتار قدیمی داشت، اجازه بده useEffect مدیریت کند
    } catch (err) {
      const serverData = err?.response?.data;
      if (serverData) {
        if (serverData.errors && typeof serverData.errors === 'object') {
          const serverErrors = {};
          Object.entries(serverData.errors).forEach(([field, messages]) => {
            serverErrors[field] = Array.isArray(messages)
              ? messages.join(', ')
              : String(messages);
          });
          setErrors(serverErrors);
        } else if (serverData.message) {
          setErrors({ general: serverData.message });
        } else {
          setErrors({
            general: err?.message || 'خطایی در ورود به سیستم رخ داد',
          });
        }
      } else {
        setErrors({ general: err?.message || 'خطایی در ورود به سیستم رخ داد' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => navigate('/register');

  return (
    <div className="w-full px-4 flex items-center justify-center relative overflow-hidden">
      <NetworkBackground3D />
      <div className="relative max-w-md z-10 w-full space-y-8 backdrop-blur-lg px-4 py-7 md:p-8 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          ورود به سیستم
        </h2>

        {errors.general && (
          <div className="text-red-400 text-sm text-center animate-pulse">
            {errors.general}
          </div>
        )}

        {/* جلوگیری از validation بومی مرورگر */}
        <form
          className="mt-6 space-y-6 w-full"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="ایمیل"
                required
                autoComplete="email"
                inputMode="email"
                className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="رمز عبور"
                required
                autoComplete="current-password"
                className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between w-full gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? '...' : 'ورود'}
              </button>
              <button
                type="button"
                onClick={handleRegister}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-600 rounded-md text-sm font-semibold text-white bg-transparent hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
              >
                ثبت نام
              </button>
            </div>
          </div>
        </form>

        <div className="text-center text-sm text-gray-400">
          حساب کاربری ندارید؟{' '}
          <button
            onClick={handleRegister}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            همین حالا ثبت نام کنید
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
