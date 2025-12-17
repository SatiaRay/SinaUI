import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { notify } from './ui/toast';
import NetworkBackground3D from './NetworkBackground';

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
  const toggleRepeatPasswordVisibility = () => setShowRepeatPassword((prev) => !prev);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'نام الزامی است';
    if (!formData.last_name.trim()) newErrors.last_name = 'نام خانوادگی الزامی است';

    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (!formData.phone) {
      newErrors.phone = 'شماره تلفن الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'شماره تلفن باید ۱۱ رقمی و با ۰۹ شروع شود';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 8) {
      newErrors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
    } else if (!/(?=.*[0-9])(?=.*[A-Za-z])/.test(formData.password)) {
      newErrors.password = 'رمز عبور باید شامل حرف و عدد باشد';
    }

    if (formData.password !== formData.repeat_password) {
      newErrors.repeat_password = 'رمزهای عبور مطابقت ندارند';
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
        notify.success('حساب شما با موفقیت ساخته شد!');
        navigate('/login');
        return;
      }

      if (res?.fieldErrors && Object.keys(res.fieldErrors).length > 0) {
        const serverErrors = {};
        Object.entries(res.fieldErrors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages) ? messages.join(', ') : String(messages);
        });
        setErrors(serverErrors);
        notify.error(Object.values(serverErrors)[0] || 'لطفاً اطلاعات را بررسی کنید');
        return;
      }

      notify.error(res?.error || res?.message || 'ثبت نام ناموفق بود');
    } catch (err) {
      const serverErr = err?.response?.data;
      if (serverErr?.errors) {
        const serverErrors = {};
        Object.entries(serverErr.errors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages) ? messages.join(', ') : String(messages);
        });
        setErrors(serverErrors);
        notify.error(Object.values(serverErrors)[0]);
      } else {
        notify.error(serverErr?.message || err?.message || 'خطای ارتباط با سرور');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full px-4 flex items-center justify-center relative overflow-hidden">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input[type="password"]::-webkit-password-toggle-button { display: none; }
      `}</style>

      <NetworkBackground3D />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-700/70 shadow-2xl rounded-3xl p-8 sm:p-10">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              ثبت‌نام رایگان
            </h1>
            <p className="text-lg text-gray-300">
              حساب خود را بسازید و شروع کنید
            </p>
          </div>

          {errors.general && (
            <div className="mb-6 text-red-300 text-sm text-center bg-red-900/30 border border-red-600/50 rounded-xl py-3 px-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="نام"
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && <p className="text-red-300 text-xs mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <input
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="نام خانوادگی"
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && <p className="text-red-300 text-xs mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div>
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="ایمیل"
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                name="phone"
                type="text"
                placeholder="تلفن همراه: ۰۹۱۲۳۴۵۶۷۸۹"
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-right"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <p className="text-red-300 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="رمز عبور"
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 transition"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
                aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <input
                name="repeat_password"
                type={showRepeatPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="تکرار رمز عبور"
                className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 transition"
                value={formData.repeat_password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={toggleRepeatPasswordVisibility}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
                aria-label={showRepeatPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
              >
                {showRepeatPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
              {errors.repeat_password && <p className="text-red-300 text-xs mt-1">{errors.repeat_password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-4 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'در حال ثبت‌نام...' : 'ساخت حساب کاربری'}
            </button>
          </form>

          <div className="mt-10 text-center space-y-4">
            <p className="text-xs text-gray-400">
              با ثبت‌نام، <span className="text-gray-200">قوانین</span> و{' '}
              <span className="text-gray-200">حریم خصوصی</span> را می‌پذیرید.
            </p>

            <p className="text-sm text-gray-300">
              از قبل حساب دارید؟{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-bold text-indigo-400 hover:text-indigo-300 transition"
              >
                وارد شوید
              </button>
            </p>

            <p className="text-xs text-gray-500">
              امن، سریع و حرفه‌ای
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;