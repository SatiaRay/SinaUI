import React from 'react';
import { TbApi } from 'react-icons/tb';

/**
 * Information Card Component
 * @component
 * @returns {JSX.Element} Rendered info card
 */
const InfoCard = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-4 sm:p-5">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-800 rounded-lg flex-shrink-0">
          <TbApi className="text-blue-600 dark:text-blue-300 text-sm sm:text-base" />
        </div>
        <div>
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1 sm:mb-2 text-sm sm:text-base">
            نکات مهم
          </h4>
          <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700 dark:text-blue-400">
            <li className="flex items-start gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>
                پس از ذخیره، API به صورت خودکار در دسترس AI Agent قرار می‌گیرد
              </span>
            </li>
            <li className="flex items-start gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>تست API کمک می‌کند از صحت تنظیمات اطمینان حاصل کنید</span>
            </li>
            <li className="flex items-start gap-1 sm:gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
              <span>اطلاعات احراز هویت به صورت امن ذخیره می‌شوند</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
