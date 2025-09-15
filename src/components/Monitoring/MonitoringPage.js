import React from 'react';
import { FileText, BarChart3, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MonitoringPage = () => {
  const navigate = useNavigate();

  const buttons = [
    {
      id: 'recentLogs',
      title: 'لاگ‌های اخیر',
      desc: 'مشاهده آخرین لاگ‌های ثبت‌شده',
      icon: <FileText className="text-blue-500 dark:text-blue-400" />,
      path: '/monitoring/logs',
    },
    {
      id: 'toolStats',
      title: 'آمار ابزارها',
      desc: 'نمایش میزان استفاده از ابزارها',
      icon: <BarChart3 className="text-green-500 dark:text-green-400" />,
      path: '/monitoring/tools',
    },
    {
      id: 'logById',
      title: 'جزئیات لاگ',
      desc: 'نمایش لاگ بر اساس شناسه',
      icon: <Hash className="text-orange-500 dark:text-orange-400" />,
      path: '/monitoring/log-by-id',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-white mb-8 md:mb-16 text-center">
        مانیتورینگ سامانه
      </h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => navigate(btn.path)}
            className="flex flex-col items-center text-center p-6 md:p-8 w-full max-w-xs rounded-3xl shadow-xl 
              bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
              hover:shadow-2xl hover:-translate-y-2 transition-all duration-300
              min-h-[250px] md:min-h-[300px] transform hover:scale-105"
          >
            <div className="mb-4 md:mb-6 flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              {React.cloneElement(btn.icon, {
                className:
                  'w-12 h-12 md:w-16 md:h-16 ' + btn.icon.props.className,
              })}
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
              {btn.title}
            </span>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {btn.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonitoringPage;

{
  /** 
      {
        id: 'userStats',
        title: 'آمار کاربران',
        desc: 'فعالیت کاربران در سامانه',
        icon: <UserCheck className="text-purple-500 dark:text-purple-400" />,
        path: '/monitoring/users',
      },
      {
        id: 'searchLogs',
        title: 'جستجوی لاگ‌ها',
        desc: 'یافتن لاگ‌ها بر اساس متن',
        icon: <Search className="text-pink-500 dark:text-pink-400" />,
        path: '/monitoring/search',
      },
    */
}
