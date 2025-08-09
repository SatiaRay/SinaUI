import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import NetworkBackground3D from "./components/NetworkBackground3D";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      setError("فیلدهای ضروری را پر کنید");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(
        formData.username,
        formData.email,
        formData.phoneNumber,
        formData.password
      );
      navigate("/chat", { replace: true });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "ثبت نام با خطا مواجه شد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full px-4 flex items-center justify-center relative overflow-hidden">
      <NetworkBackground3D />
      <div className="relative z-10 max-w-md w-full space-y-8 bg-gray-900/80 dark:bg-gray-900/80 backdrop-blur-lg md:p-8 py-8 px-4 rounded-xl shadow-2xl border border-gray-700/50 animate-fade-in">
        <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-white">
          ایجاد حساب کاربری
        </h2>

        {error && (
          <div className="text-red-400 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="نام کاربری"
                value={formData.username}
                onChange={handleChange}
              />
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
            </div>
       
            <div>
              <input
                dir="rtl"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                placeholder="شماره تلفن"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            {/* Password Field with Eye Icon */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
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
            
            {/* Confirm Password Field with Eye Icon */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-4 py-2 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300 pr-10"
                placeholder="تکرار رمز عبور"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
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
                loading ? "opacity-50 cursor-not-allowed" : ""
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
                "ثبت نام"
              )}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">یا</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="relative w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md text-sm font-semibold text-white bg-transparent hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
            >
              ورود به حساب کاربری
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-400">
          قبلاً حساب کاربری دارید؟{' '}
          <button 
            onClick={() => navigate("/login")}
            className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            وارد شوید
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;