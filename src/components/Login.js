import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import NetworkBackground3D from './NetworkBackground2D';

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loginWithGoogle, loginWithGithub } = useAuth();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/chat', { replace: true });
  }, [user, navigate]);

  const sanitizeEmail = (value) => {
    if (!value) return value;
    return String(value).replace(/[\u200E\u200F\s،\u060C]/g, '');
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canSubmitEmail = useMemo(() => {
    return formData.email && validateEmail(formData.email) && formData.password;
  }, [formData.email, formData.password]);

  const clearErrors = () => setErrors({});

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'email') value = sanitizeEmail(value);

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const handleOAuth = async (provider) => {
    clearErrors();
    setLoadingProvider(provider);

    try {
      if (provider === 'google') await loginWithGoogle?.();
      else if (provider === 'github') await loginWithGithub?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'ورود با شبکه اجتماعی ناموفق بود. دوباره تلاش کنید.';
      setErrors({ general: msg });
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const newErrors = {};
    if (!formData.email) newErrors.email = 'ایمیل الزامی است';
    else if (!validateEmail(formData.email)) newErrors.email = 'ایمیل معتبر نیست';
    if (!formData.password) newErrors.password = 'رمز عبور الزامی است';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoadingProvider('email');
    try {
      const res = await login(formData.email, formData.password);

      if (res && typeof res === 'object' && res.success === false) {
        if (res.fieldErrors) {
          const serverErrors = {};
          Object.entries(res.fieldErrors).forEach(([field, messages]) => {
            serverErrors[field] = Array.isArray(messages)
              ? messages.join(', ')
              : String(messages);
          });
          setErrors(serverErrors);
          return;
        }
        setErrors({ general: res.error || 'ورود ناموفق بود. اطلاعات را بررسی کنید.' });
      }
    } catch (err) {
      const serverData = err?.response?.data;
      if (serverData?.errors && typeof serverData.errors === 'object') {
        const serverErrors = {};
        Object.entries(serverData.errors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages) ? messages.join(', ') : String(messages);
        });
        setErrors(serverErrors);
      } else {
        setErrors({
          general: serverData?.message || err?.message || 'خطایی در ورود به سیستم رخ داد',
        });
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const goRegister = () => navigate('/register');

  return (
    <div className="min-h-[100dvh] w-full px-4 flex items-center justify-center relative overflow-hidden">
      <NetworkBackground3D />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-gray-900/60 border border-gray-700/70 shadow-2xl rounded-3xl p-8 sm:p-10">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              خوش آمدید
            </h1>
          </div>

          {errors.general && (
            <div className="mb-6 text-red-300 text-sm text-center bg-red-900/30 border border-red-600/50 rounded-xl py-3 px-4">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Google Button - با hover effect قوی‌تر */}
            <button
              onClick={() => handleOAuth('google')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-4 rounded-2xl border border-gray-600 bg-white text-gray-900 font-bold py-4 
                         hover:bg-gray-100 hover:shadow-lg hover:border-gray-500 
                         transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loadingProvider === 'google' ? 'در حال اتصال...' : 'ورود با Google'}
            </button>

            {/* GitHub Button - hover effect هماهنگ */}
            <button
              onClick={() => handleOAuth('github')}
              disabled={!!loadingProvider}
              className="w-full flex items-center justify-center gap-4 rounded-2xl border border-gray-600 bg-gray-950 text-white font-bold py-4 
                         hover:bg-gray-800 hover:shadow-lg hover:border-gray-500 
                         transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {loadingProvider === 'github' ? 'در حال اتصال...' : 'ورود با GitHub'}
            </button>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-600/60" />
            <span className="text-sm text-gray-400">یا</span>
            <div className="h-px flex-1 bg-gray-600/60" />
          </div>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showEmailForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <form onSubmit={handleEmailSubmit} noValidate className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ایمیل</label>
                <input
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">رمز عبور</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-12 transition"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white transition"
                    aria-label={showPassword ? 'مخفی کردن رمز عبور' : 'نمایش رمز عبور'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loadingProvider === 'email' || !canSubmitEmail}
                className="w-full rounded-xl py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60"
              >
                {loadingProvider === 'email' ? 'در حال ورود...' : 'ورود با ایمیل'}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  بازگشت
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-indigo-400 hover:text-indigo-300 transition"
                >
                  فراموشی رمز عبور؟
                </button>
              </div>
            </form>
          </div>

          {!showEmailForm && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full rounded-2xl border border-gray-600 bg-gray-800/50 text-white py-4 font-semibold hover:bg-gray-800/70 transition"
            >
              ورود با ایمیل و رمز عبور
            </button>
          )}

          <div className="mt-10 text-center space-y-4">
            <p className="text-xs text-gray-400">
              با ورود، <span className="text-gray-200">قوانین</span> و{' '}
              <span className="text-gray-200">حریم خصوصی</span> را می‌پذیرید.
            </p>

            <p className="text-sm text-gray-300">
              حساب ندارید؟{' '}
              <button onClick={goRegister} className="font-bold text-indigo-400 hover:text-indigo-300 transition">
                ثبت‌نام رایگان
              </button>
            </p>

            <p className="text-xs text-gray-500">
              سریع، امن و بدون نیاز به رمز عبور
            </p>
          </div>          
        </div>
      </div>
    </div>
  );
};

export default Login;