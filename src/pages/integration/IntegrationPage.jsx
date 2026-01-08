// EmbeddedScriptPage.js
import React, { useState } from 'react';
import Icon from '@components/ui/Icon';
import { notify } from '@components/ui/toast';

const EmbeddedScriptPage = () => {
  const scriptValue = () => {
    // Get the current host (window location)
    const host = window.location.origin || 'https://test.com';

    // Get access token from localStorage
    const khanAccessToken = localStorage.getItem('khan-access-token');

    // Build the script tag
    const scriptTag = `<script src="${host}/bundle/chat-bundle.min.js" data-widget="chat" data-access-token="${khanAccessToken || ''}"></script>`;

    return scriptTag;
  };

  /**
   * Handle copy embed code
   */
  const handleCopyEmbedCode = () => {
    const embedCode = scriptValue(); // Use the dynamic script value
    
    navigator.clipboard
      .writeText(embedCode)
      .then(() => notify.success('کود تعبیه در کلیپ‌بورد کپی شد'))
      .catch(() => notify.error('خطا در کپی کردن کود'));
  };

  return (
    <div className="h-full flex flex-col justify-start pb-3 md:pb-0">
      {/* صفحه‌بندی هدر */}
      <div className="mx-3 md:mx-0 md:mb-3 pb-3 pt-3 md:pt-0 border-b border-gray-600 flex justify-between items-center">
        <div>
          <h3 className="text-xl md:text-2xl">ماژول‌های تعبیه‌شده</h3>
          <p className="text-sm text-gray-400 mt-1">
            مدیریت و نمایش اسکریپت‌های تعبیه‌شده با توکن
          </p>
        </div>
      </div>

      {/* ماژول تعبیه‌شده */}
      <div className="p-3 md:p-0 md:my-4">
        <div className="space-y-6">
          {/* هدر مدیریت */}
          <div className="p-4 md:p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h4 className="text-lg font-medium mb-1">
                  ماژول تعبیه‌شده شما
                </h4>
                <p className="text-sm text-gray-400">
                  این ماژول به صورت خودکار از اطلاعات حساب شما ایجاد شده است
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyEmbedCode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                >
                  <Icon name="Copy" size={20} />
                  کپی کود
                </button>
              </div>
            </div>

            {/* اطلاعات توکن */}
            <div className="mb-4 p-3 dark:bg-gray-900 bg-gray-200 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">
                  اسکریپت شما
                </span>
              </div>
              <code className="text-sm text-gray-400 break-all">{scriptValue()}</code>
              <p className="text-xs text-gray-500 mt-2">
                این توکن به صورت خودکار تولید شده و فقط برای شما قابل مشاهده است
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* راهنما */}
      <div className="mt-6 p-4 dark:bg-gray-800 bg-gray-100 rounded-lg m-3 md:m-0">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-blue-400" />
          راهنمای استفاده
        </h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• این ماژول به صورت خودکار از اطلاعات حساب شما ایجاد شده است</li>
          <li>• برای استفاده، کود تعبیه را در وبسایت خود قرار دهید</li>
          <li>• با کلیک روی هدر می‌توانید ماژول را جمع یا باز کنید</li>
          <li>• دکمه "کپی کود" برای کپی کردن کود تعبیه در کلیپ‌بورد</li>
          <li>• می‌توانید عنوان و توضیحات ماژول را شخصی‌سازی کنید</li>
          <li>• در صورت نیاز می‌توانید توکن را مجدداً تولید کنید</li>
        </ul>
      </div>
    </div>
  );
};

export default EmbeddedScriptPage;
