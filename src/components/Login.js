import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NetworkBackground3D from './NetworkBackground2D';

const Login = () => {
  const { login: authLogin, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('ایمیل و رمز عبور الزامی است');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await authLogin(formData.email, formData.password);

      if (!success) {
        setError('ورود ناموفق بود. لطفاً اطلاعات را بررسی کنید.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'خطایی در ورود به سیستم رخ داد');
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

        {error && (
          <div className="text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6 w-full" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="ایمیل"
              required
              className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              placeholder="رمز عبور"
              required
              className="appearance-none block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
              value={formData.password}
              onChange={handleChange}
            />
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
                  'ورود'
                )}
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
