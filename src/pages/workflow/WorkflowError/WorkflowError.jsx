/**
 * Modern Workflow Error Component
 * Displays elegant error state with modern design and smooth animations
 * Provides user-friendly error messages and retry functionality
 * Compatible with RTK Query error structure
 */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// Import SVG files directly from current directory
import BugFixingLeft from './bug-fixing-1.svg';
import BugFixingRight from './bug-fixing.svg';

const WorkflowError = ({ error, onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    // Animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Extracts and formats error message from RTK Query error response
   * Supports various error response formats
   * @returns {string} User-friendly error message
   */
  const getErrorMessage = () => {
    if (!error) return 'یک خطای ناشناخته رخ داده است';

    // Handle RTK Query error structure
    if (error?.data?.detail?.msg) {
      return error.data.detail.msg;
    }

    if (error?.data?.message) {
      return error.data.message;
    }

    if (error?.message) {
      return error.message;
    }

    // Handle HTTP status codes
    if (error?.status) {
      switch (error.status) {
        case 404:
          return 'گردش کارهای درخواستی یافت نشد. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.';
        case 403:
          return 'دسترسی محدود شده است. شما مجوز مشاهده این گردش کارها را ندارید.';
        case 500:
          return 'سرورهای ما با مشکل مواجه شده‌اند. لطفاً چند لحظه دیگر تلاش کنید.';
        case 502:
          return 'سرور به طور موقت در دسترس نیست. ما در حال رفع این مشکل هستیم.';
        case 503:
          return 'سرویس در حال حاضر در حال تعمیر و نگهداری است. لطفاً به زودی دوباره بررسی کنید.';
        default:
          return `خطای ${error.status} در هنگام بارگذاری گردش کارها رخ داده است`;
      }
    }

    return 'بارگذاری گردش کارها ناموفق بود. لطفاً اتصال خود را بررسی کرده و دوباره تلاش کنید.';
  };

  const getErrorTitle = () => {
    if (error?.status) {
      switch (error.status) {
        case 404:
          return 'محتوای مورد نظر یافت نشد';
        case 403:
          return 'دسترسی محدود شده';
        case 500:
          return 'خطای سرور';
        case 502:
        case 503:
          return 'سرویس در دسترس نیست';
        default:
          return 'خطای اتصال';
      }
    }
    return 'مشکلی پیش آمده است';
  };

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 bg-neutral-50 dark:bg-gray-900">
      <div
        className={`
        relative max-w-4xl w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl 
        rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50
        p-8 md:p-12 transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        hover:backdrop-blur-md transition-all duration-300
      `}
        onMouseEnter={() => setHoveredElement('container')}
        onMouseLeave={() => setHoveredElement(null)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />

        <div className="relative flex flex-col items-center text-center gap-8">
          {/* Error Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg animate-pulse" />
              <div
                className={`relative bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-2xl shadow-2xl transform transition-transform duration-300 ${
                  hoveredElement === 'icon' ? 'scale-110' : 'scale-100'
                }`}
                onMouseEnter={() => setHoveredElement('icon')}
                onMouseLeave={() => setHoveredElement('container')}
              >
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Error Title */}
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            {getErrorTitle()}
          </h3>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl">
            {getErrorMessage()}
          </p>

          {/* Illustrations and Action Buttons Container */}
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-8">
            {/* Left Illustration */}
            <div className="flex-shrink-0 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20 animate-pulse" />
                <img
                  src={BugFixingLeft}
                  alt="Bug fixing illustration"
                  className={`relative w-32 h-32 md:w-40 md:h-40 transform transition-transform duration-500 ${
                    hoveredElement === 'leftImage'
                      ? 'scale-110 rotate-6'
                      : 'scale-100'
                  }`}
                  onMouseEnter={() => setHoveredElement('leftImage')}
                  onMouseLeave={() => setHoveredElement('container')}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center order-1 lg:order-2">
              <button
                onClick={onRetry}
                onMouseEnter={() => setHoveredElement('retryButton')}
                onMouseLeave={() => setHoveredElement('container')}
                className={`
                  relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 
                  hover:from-blue-700 hover:to-cyan-700 text-white font-semibold 
                  py-4 px-8 rounded-2xl transition-all duration-300 transform border border-blue-500/30
                  ${hoveredElement === 'retryButton' ? 'scale-105 shadow-2xl backdrop-blur-0' : 'shadow-lg backdrop-blur-sm'}
                `}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  تلاش مجدد
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>

              <button
                onClick={() => window.location.reload()}
                onMouseEnter={() => setHoveredElement('refreshButton')}
                onMouseLeave={() => setHoveredElement('container')}
                className={`
                  border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                  hover:border-gray-400 dark:hover:border-gray-500 font-medium py-4 px-8 
                  rounded-2xl transition-all duration-300 bg-white/50 dark:bg-gray-700/50
                  ${hoveredElement === 'refreshButton' ? 'scale-105 shadow-lg backdrop-blur-0' : 'shadow-md backdrop-blur-sm'}
                `}
              >
                بارگذاری مجدد صفحه
              </button>
            </div>

            {/* Right Illustration */}
            <div className="flex-shrink-0 order-3">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-l from-cyan-500 to-blue-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000" />
                <img
                  src={BugFixingRight}
                  alt="Bug fixing illustration"
                  className={`relative w-32 h-32 md:w-40 md:h-40 transform transition-transform duration-500 delay-100 ${
                    hoveredElement === 'rightImage'
                      ? 'scale-110 -rotate-6'
                      : 'scale-100'
                  }`}
                  onMouseEnter={() => setHoveredElement('rightImage')}
                  onMouseLeave={() => setHoveredElement('container')}
                />
              </div>
            </div>
          </div>

          {/* Additional Help Text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            در صورت تداوم مشکل، با تیم پشتیبانی ما تماس بگیرید.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  );
};

/**
 * Prop Types Definition
 */
WorkflowError.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number,
    data: PropTypes.shape({
      detail: PropTypes.shape({
        msg: PropTypes.string,
      }),
      message: PropTypes.string,
    }),
    message: PropTypes.string,
  }),
  onRetry: PropTypes.func.isRequired,
};

WorkflowError.defaultProps = {
  error: null,
};

export default WorkflowError;
