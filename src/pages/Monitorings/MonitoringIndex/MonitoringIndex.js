import React from 'react';
import { FileText, BarChart3, Hash, UserCheck, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * MonitoringIndex Component - Main monitoring dashboard
 *
 * This component provides the main dashboard for system monitoring features
 * with navigation to various monitoring sections including logs, statistics,
 * and user activities.
 *
 * @component
 * @example
 * return <MonitoringIndex />
 *
 * @returns {JSX.Element} Monitoring dashboard component
 */
const MonitoringIndex = () => {
  const navigate = useNavigate();

  // Monitoring feature buttons configuration
  const buttons = [
    {
      id: 'recentLogs',
      title: 'لاگ‌های اخیر',
      desc: 'مشاهده آخرین لاگ‌های ثبت‌شده در سامانه',
      icon: <FileText className="text-blue-500 dark:text-blue-400" />,
      path: '/monitoring/logs',
    },
    {
      id: 'toolStats',
      title: 'آمار ابزارها',
      desc: 'نمایش میزان استفاده و عملکرد ابزارهای مختلف',
      icon: <BarChart3 className="text-green-500 dark:text-green-400" />,
      path: '/monitoring/tools',
    },
    {
      id: 'logById',
      title: 'جزئیات لاگ',
      desc: 'جستجو و نمایش لاگ بر اساس شناسه اختصاصی',
      icon: <Hash className="text-orange-500 dark:text-orange-400" />,
      path: '/monitoring/log-by-id',
    },
    /*
    {
      id: 'userStats',
      title: 'آمار کاربران',
      desc: 'بررسی فعالیت و عملکرد کاربران در سامانه',
      icon: <UserCheck className="text-purple-500 dark:text-purple-400" />,
      path: '/monitoring/users',
    },
    {
      id: 'searchLogs',
      title: 'جستجوی لاگ‌ها',
      desc: 'یافتن لاگ‌ها بر اساس کلمات کلیدی و فیلترهای پیشرفته',
      icon: <Search className="text-pink-500 dark:text-pink-400" />,
      path: '/monitoring/search',
    },
    */
  ];

  return (
    <div className="flex flex-1 flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-16 max-w-2xl">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
          مانیتورینگ سامانه
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          مدیریت و رصد کامل فعالیت‌های سیستم، کاربران و ابزارها
        </p>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => navigate(btn.path)}
            className="group flex flex-col items-center text-center p-6 w-full rounded-2xl shadow-lg
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
              min-h-[220px] transform hover:scale-105 focus:outline-none focus:ring-4
              focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
          >
            {/* Icon Container */}
            <div
              className="mb-4 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-blue-50
              dark:from-gray-700 dark:to-blue-900/30 rounded-2xl group-hover:scale-110 transition-transform duration-300"
            >
              {React.cloneElement(btn.icon, {
                className: 'w-8 h-8 ' + btn.icon.props.className,
              })}
            </div>

            {/* Title */}
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
              {btn.title}
            </span>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
              {btn.desc}
            </p>

            {/* Hover Indicator */}
            <div
              className="mt-4 w-8 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
          </button>
        ))}
      </div>

      {/* Coming Soon Section */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            قابلیت‌های بیشتر به زودی...
          </span>
        </div>
      </div>
    </div>
  );
};

export default MonitoringIndex;
